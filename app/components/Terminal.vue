<template>
    <div class="terminal-window" @click="focusInput">
        <!-- Import Title Bar Component -->
        <TitleBar @minimize="minimize" @maximize="maximize" @close="close" />

        <!-- Terminal Content -->
        <div class="terminal-content" ref="terminalContent">
            <div class="terminal-output">
                <div class="output-line">Microsoft Windows [Version 10.0.26200.7462]</div>
                <div class="output-line">(c) Microsoft Corporation. All rights reserved.</div>
                <div class="output-line">&nbsp;</div>

                <div v-for="(line, index) in commandHistory" :key="index" class="output-line">
                    <div class="prompt-line">
                        <span class="prompt">C:\Users\rifqy&gt;</span>
                        <span class="command">{{ line.command }}</span>
                    </div>
                    <div v-if="line.output" class="command-output">{{ line.output }}</div>
                </div>
            </div>

            <div class="input-line">
                <span class="prompt">C:\Users\rifqy&gt;</span>
                <span class="input-wrapper">
                    <span class="input-display">{{ currentCommand }}</span>
                    <span v-if="suggestion" class="suggestion">{{ suggestion }}</span>
                    <input v-model="currentCommand" @keydown.enter="executeCommand" @keydown.up="navigateHistory(-1)"
                        @keydown.down="navigateHistory(1)" @keydown.tab.prevent="autocomplete"
                        @keydown.right="acceptSuggestion" @input="handleInput" ref="commandInput" type="text"
                        class="command-input" spellcheck="false" autocomplete="off" />
                    <span class="cursor" :class="{ blink: !isTyping }"></span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { executeWindowsCommand, getAvailableCommands, isValidCommand } from '@/utils/commandExecutor'

const currentCommand = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)
const commandInput = ref(null)
const terminalContent = ref(null)
const isTyping = ref(false)
let typingTimer = null

// Computed suggestions based on current input
const suggestions = computed(() => {
    const cmd = currentCommand.value.toLowerCase().trim()
    if (!cmd) return []

    const availableCommands = getAvailableCommands()
    return availableCommands.filter(c => c.startsWith(cmd) && c !== cmd)
})

// Ghost text suggestion (first match)
const suggestion = computed(() => {
    const cmd = currentCommand.value.toLowerCase().trim()
    if (!cmd) return ''

    const match = suggestions.value[0]
    if (match) {
        return match.substring(cmd.length)
    }
    return ''
})

const focusInput = () => {
    if (commandInput.value) {
        commandInput.value.focus()
    }
}

const handleInput = () => {
    // Set typing state
    isTyping.value = true

    // Clear previous timer
    if (typingTimer) {
        clearTimeout(typingTimer)
    }

    // Set timer to stop typing state after 500ms of no input
    typingTimer = setTimeout(() => {
        isTyping.value = false
    }, 500)
}

// Accept ghost suggestion with right arrow key
const acceptSuggestion = () => {
    if (suggestion.value) {
        currentCommand.value = currentCommand.value + suggestion.value
    }
}

const executeCommand = () => {
    const cmd = currentCommand.value.trim()

    if (cmd) {
        // Execute command menggunakan utils
        const result = executeWindowsCommand(cmd)

        // Check apakah command adalah CLS (clear screen)
        if (typeof result === 'object' && result.clear) {
            commandHistory.value = []
            currentCommand.value = ''
            return
        }

        // Add ke history
        commandHistory.value.push({
            command: cmd,
            output: result
        })

        currentCommand.value = ''
        historyIndex.value = -1

        // Scroll ke bawah
        nextTick(() => {
            if (terminalContent.value) {
                terminalContent.value.scrollTop = terminalContent.value.scrollHeight
            }
        })
    }
}

const navigateHistory = (direction) => {
    if (commandHistory.value.length === 0) return

    const newIndex = historyIndex.value + direction

    if (newIndex >= -1 && newIndex < commandHistory.value.length) {
        historyIndex.value = newIndex

        if (newIndex === -1) {
            currentCommand.value = ''
        } else {
            currentCommand.value = commandHistory.value[commandHistory.value.length - 1 - newIndex].command
        }
    }
}

// Autocomplete feature
const autocomplete = () => {
    const cmd = currentCommand.value.toLowerCase().trim()
    if (!cmd) return

    const availableCommands = getAvailableCommands()
    const matches = availableCommands.filter(c => c.startsWith(cmd))

    if (matches.length === 1) {
        // Autocomplete ke satu-satunya match
        currentCommand.value = matches[0]
    } else if (matches.length > 1) {
        // Show all matches di terminal output
        commandHistory.value.push({
            command: currentCommand.value,
            output: matches.join('  ')
        })
        nextTick(() => {
            if (terminalContent.value) {
                terminalContent.value.scrollTop = terminalContent.value.scrollHeight
            }
        })
    }
}

const minimize = () => {
    console.log('Minimize clicked')
}

const maximize = () => {
    console.log('Maximize clicked')
}

const close = () => {
    console.log('Close clicked')
}

onMounted(() => {
    focusInput()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.terminal-window {
    width: 100%;
    max-width: 1050px;
    height: 567px;
    margin: 0 auto;
    background: #0c0c0c;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    font-family: 'Consolas', 'Courier New', monospace;
}

.terminal-content {
    flex: 1;
    background: #0c0c0c;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    color: #cccccc;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    cursor: text;
}

.terminal-content::-webkit-scrollbar {
    width: 12px;
}

.terminal-content::-webkit-scrollbar-track {
    background: #0c0c0c;
}

.terminal-content::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 6px;
    border: 2px solid #0c0c0c;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
    background: #4a4a4a;
}

.output-line {
    white-space: pre-wrap;
    word-wrap: break-word;
}

.prompt-line {
    display: flex;
    gap: 4px;
}

.prompt {
    color: #cccccc;
    white-space: nowrap;
}

.command {
    color: #cccccc;
}

.command-output {
    margin-left: 0;
    margin-top: 2px;
    margin-bottom: 8px;
    color: #cccccc;
    white-space: pre-wrap;
}

.input-line {
    display: flex;
    align-items: center;
    gap: 4px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
}

.input-display {
    color: #cccccc;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    white-space: pre;
    pointer-events: none;
}

.command-input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: transparent;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    padding: 0;
    caret-color: transparent;
}

.cursor {
    display: inline-block;
    width: 1px;
    height: 16px;
    background: #cccccc;
    pointer-events: none;
    margin-left: -1px;
}

.cursor.blink {
    animation: blink 1s step-end infinite;
}

.suggestion {
    color: #666666;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    white-space: pre;
    pointer-events: none;
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

/* Mobile Responsive - Full Height */
@media (max-width: 768px) {
    .terminal-window {
        height: 100vh;
        height: 100dvh;
        max-width: 100%;
        margin: 0;
        border-radius: 8px;
    }

    .terminal-content {
        padding: 12px;
        font-size: 13px;
    }

    .cursor {
        height: 14px;
    }
}

@media (max-width: 480px) {
    .terminal-content {
        padding: 10px;
        font-size: 12px;
    }

    .input-display,
    .command-input {
        font-size: 12px;
    }

    .cursor {
        height: 13px;
    }

    .terminal-content::-webkit-scrollbar {
        width: 8px;
    }
}
</style>