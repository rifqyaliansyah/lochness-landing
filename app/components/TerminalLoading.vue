<template>
    <div class="loading-screen">
        <div class="terminal-window">
            <div class="terminal-content">
                <div class="line">Microsoft Windows [Version 10.0.26200.7462]</div>
                <div class="line">(c) Microsoft Corporation. All rights reserved.</div>
                <div class="line">&nbsp;</div>
                <div class="line">
                    <span class="prompt">C:\Users\rifqy&gt;</span>
                    <span class="command">{{ currentCommand }}</span>
                    <span class="cursor blink"></span>
                </div>
                <div v-if="showOutput" class="output">
                    <div v-for="(output, index) in outputs" :key="index" class="line">{{ output }}</div>
                </div>
                <div v-if="showProgress" class="line progress-container">
                    <span class="progress-bar">{{ progressBar }}</span>
                    <span class="progress-text">{{ progress }}%</span>
                </div>
                <div v-if="statusText" class="line status">{{ statusText }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppLoading } from '~/composables/useAppLoading'

const { finishLoading } = useAppLoading()

const currentCommand = ref('')
const showOutput = ref(false)
const outputs = ref([])
const showProgress = ref(false)
const progress = ref(0)
const statusText = ref('')

const commands = [
    { cmd: 'dir', output: [' Volume in drive C has no label.', ' Directory of C:\\Users\\rifqy\\website', '', ' 12/29/2025  02:15 PM    <DIR>          .', ' 12/29/2025  02:15 PM    <DIR>          ..', ' 12/29/2025  02:15 PM    <DIR>          node_modules', ' 12/29/2025  02:15 PM             1,234 package.json', '               1 File(s)          1,234 bytes'] },
    { cmd: 'npm start', output: ['', '> starting development server...', ''] },
    { cmd: 'echo Initializing...', output: ['Initializing...'] },
]

let commandIndex = 0
let charIndex = 0

const progressBar = computed(() => {
    const total = 20
    const filled = Math.floor((progress.value / 100) * total)
    const empty = total - filled
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']'
})

const typeCommand = () => {
    if (commandIndex < commands.length) {
        const command = commands[commandIndex].cmd

        if (charIndex < command.length) {
            currentCommand.value += command[charIndex]
            charIndex++
            setTimeout(typeCommand, 50)
        } else {
            setTimeout(() => {
                // Tampilkan output command
                showOutput.value = true
                outputs.value = commands[commandIndex].output

                setTimeout(() => {
                    commandIndex++
                    charIndex = 0
                    currentCommand.value = ''
                    showOutput.value = false
                    outputs.value = []

                    if (commandIndex < commands.length) {
                        setTimeout(typeCommand, 300)
                    } else {
                        startProgress()
                    }
                }, 500)
            }, 200)
        }
    }
}

const startProgress = () => {
    showProgress.value = true
    statusText.value = 'Loading resources...'

    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += Math.random() * 8
            if (progress.value > 100) progress.value = 100

            if (progress.value >= 25 && progress.value < 50) {
                statusText.value = 'Compiling assets...'
            } else if (progress.value >= 50 && progress.value < 75) {
                statusText.value = 'Building modules...'
            } else if (progress.value >= 75 && progress.value < 95) {
                statusText.value = 'Optimizing...'
            } else if (progress.value >= 95) {
                statusText.value = 'Starting server...'
            }
        } else {
            clearInterval(interval)
            statusText.value = 'Server started successfully!'

            setTimeout(() => {
                finishLoading()
            }, 500)
        }
    }, 120)
}

onMounted(() => {
    setTimeout(typeCommand, 500)
})
</script>

<style scoped>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #0c0c0c;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.terminal-window {
    width: 90%;
    max-width: 800px;
    padding: 20px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    color: #cccccc;
}

.terminal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.line {
    white-space: pre-wrap;
    word-wrap: break-word;
    display: flex;
    align-items: center;
    gap: 4px;
}

.output {
    margin: 4px 0;
}

.output .line {
    color: #cccccc;
}

.prompt {
    color: #cccccc;
}

.command {
    color: #cccccc;
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: #cccccc;
    margin-left: 2px;
}

.cursor.blink {
    animation: blink 1s step-end infinite;
}

@keyframes blink {

    0%,
    49% {
        opacity: 1;
    }

    50%,
    100% {
        opacity: 0;
    }
}

.progress-container {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-bar {
    font-family: 'Consolas', 'Courier New', monospace;
    color: #cccccc;
    letter-spacing: -1px;
}

.progress-text {
    min-width: 40px;
    text-align: right;
    color: #cccccc;
}

.status {
    color: #cccccc;
    margin-top: 4px;
}

@media (max-width: 768px) {
    .terminal-window {
        width: 95%;
        padding: 16px;
        font-size: 13px;
    }

    .cursor {
        height: 14px;
    }
}

@media (max-width: 480px) {
    .terminal-window {
        font-size: 12px;
    }

    .cursor {
        height: 13px;
    }
}
</style>