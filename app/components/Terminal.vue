<template>
    <div class="terminal-window" @click="focusInput">
        <!-- Import Title Bar Component -->
        <TitleBar @minimize="minimize" @maximize="maximize" @close="close" />

        <!-- Terminal Content -->
        <div class="terminal-content" ref="terminalContent">
            <div class="terminal-output">
                <div v-if="showWelcome" class="output-line">Microsoft Windows [Version 10.0.26200.7462]</div>
                <div v-if="showWelcome" class="output-line">(c) Microsoft Corporation. All rights reserved.</div>
                <div v-if="showWelcome" class="output-line">&nbsp;</div>

                <div v-for="(line, index) in commandHistory" :key="index" class="output-line">
                    <div class="prompt-line">
                        <span class="prompt">C:\Users\rifqy&gt;</span><span class="command">{{ line.command }}</span>
                    </div>
                    <div v-if="line.output" class="command-output" v-html="formatOutput(line.output)"></div>
                </div>
            </div>

            <div class="input-line">
                <span class="prompt">C:\Users\rifqy&gt;</span><span class="input-wrapper">
                    <span class="input-content">
                        <span class="input-display">{{ currentCommand.substring(0, cursorPosition) }}</span>
                        <span class="cursor" :class="{ blink: !isTyping }"></span>
                        <span class="input-display">{{ currentCommand.substring(cursorPosition) }}</span>
                        <span v-if="suggestion && cursorPosition === currentCommand.length" class="suggestion">{{
                            suggestion }}</span>
                    </span>
                    <input v-model="currentCommand" @keydown.enter="executeCommand" @keydown.up="navigateHistory(-1)"
                        @keydown.down="navigateHistory(1)" @keydown.tab.prevent="autocomplete"
                        @keydown.right="handleArrowRight" @keydown.left="updateCursorPosition" @input="handleInput"
                        @click="updateCursorPosition" @keyup="updateCursorPosition" ref="commandInput" type="text"
                        class="command-input" spellcheck="false" autocomplete="off" />
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch, onBeforeUnmount } from 'vue'
import { executeWindowsCommand, getAvailableCommands, isValidCommand } from '@/utils/commandExecutor'

const currentCommand = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)
const commandInput = ref(null)
const terminalContent = ref(null)
const isTyping = ref(false)
const showWelcome = ref(true)
const cursorPosition = ref(0)
let typingTimer = null
let focusInterval = null

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

// Watch for visibility changes
watch(() => document.visibilityState, (newVal) => {
    if (newVal === 'visible') {
        setTimeout(() => focusInput(), 100)
    }
})

const updateCursorPosition = () => {
    if (commandInput.value) {
        cursorPosition.value = commandInput.value.selectionStart
    }
}

const handleInput = () => {
    // Set typing state
    isTyping.value = true

    // Update cursor position
    updateCursorPosition()

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
const handleArrowRight = (e) => {
    if (suggestion.value && cursorPosition.value === currentCommand.value.length) {
        e.preventDefault()
        currentCommand.value = currentCommand.value + suggestion.value
        nextTick(() => {
            cursorPosition.value = currentCommand.value.length
        })
    } else {
        // Let default behavior happen, then update cursor
        nextTick(() => {
            updateCursorPosition()
        })
    }
}

const formatOutput = (text) => {
    if (!text) return ''

    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g

    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g

    let formatted = text.replace(emailRegex, (email) => {
        return `<a href="mailto:${email}" class="terminal-link">${email}</a>`
    })

    formatted = formatted.replace(urlRegex, (url) => {
        const href = url.startsWith('www.') ? `https://${url}` : url
        return `<a href="${href}" target="_blank" class="terminal-link">${url}</a>`
    })

    return formatted
}

const executeCommand = () => {
    const cmd = currentCommand.value.trim()

    if (cmd) {
        const result = executeWindowsCommand(cmd)

        if (typeof result === 'object' && result.clear) {
            commandHistory.value = []
            showWelcome.value = false
            currentCommand.value = ''
            cursorPosition.value = 0
            return
        }

        commandHistory.value.push({
            command: cmd,
            output: result
        })

        currentCommand.value = ''
        cursorPosition.value = 0
        historyIndex.value = -1

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
            cursorPosition.value = 0
        } else {
            currentCommand.value = commandHistory.value[commandHistory.value.length - 1 - newIndex].command
            nextTick(() => {
                cursorPosition.value = currentCommand.value.length
            })
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
        currentCommand.value = matches[0]
        nextTick(() => {
            cursorPosition.value = currentCommand.value.length
        })
    } else if (matches.length > 1) {
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
    showWelcome.value = true

    const homeResult = executeWindowsCommand('home')
    commandHistory.value.push({
        command: 'home',
        output: homeResult
    })

    nextTick(() => {
        if (terminalContent.value) {
            terminalContent.value.scrollTop = terminalContent.value.scrollHeight
        }
    })

    focusInput()
    setTimeout(() => focusInput(), 100)
    setTimeout(() => focusInput(), 300)
    setTimeout(() => focusInput(), 500)

    focusInterval = setInterval(() => {
        if (document.activeElement !== commandInput.value) {
            focusInput()
        }
    }, 2000)
})

onBeforeUnmount(() => {
    // Clear interval saat component di-unmount
    if (focusInterval) {
        clearInterval(focusInterval)
    }
    if (typingTimer) {
        clearTimeout(typingTimer)
    }
})
</script>

<style scoped>
/* Style tetap sama seperti sebelumnya */
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
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
}

.prompt {
    color: #cccccc;
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
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
}

.input-wrapper {
    position: relative;
    display: inline;
}

.input-content {
    display: inline;
    pointer-events: none;
}

.input-display {
    color: #cccccc;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
}

.command-input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: transparent;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    padding: 0;
    caret-color: transparent;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 16px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.command-input::selection {
    background: transparent;
    color: transparent;
}

.command-input::-moz-selection {
    background: transparent;
    color: transparent;
}

.cursor {
    display: inline-block;
    width: 1px;
    height: 16px;
    background: #cccccc;
    pointer-events: none;
    vertical-align: text-bottom;
}

.cursor.blink {
    animation: blink 1s step-end infinite;
}

.suggestion {
    color: #666666;
    font-size: 14px;
    font-family: 'Consolas', 'Courier New', monospace;
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