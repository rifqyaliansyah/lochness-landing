<template>
    <div class="title-bar">
        <div class="title-bar-left">
            <div class="active-tab">
                <div class="terminal-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v10H2V3zm1 1v8h10V4H3z" />
                        <path d="M4 6h2v1H4V6zm3 0h5v1H7V6zm-3 2h8v1H4V8z" />
                    </svg>
                </div>
                <span class="title-text">Command Prompt</span>
                <button class="tab-control-btn close-tab">×</button>
            </div>
            <button class="tab-control-btn new-tab">+</button>
            <div class="separator"></div>
            <button class="tab-control-btn dropdown-tab">
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>
            </button>
        </div>
        <div class="title-bar-right">
            <button class="title-btn minimize" @click="$emit('minimize')">
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M0 6h12" stroke="currentColor" stroke-width="1" />
                </svg>
            </button>
            <button class="title-btn maximize" @click="$emit('maximize')">
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <rect x="1" y="1" width="10" height="10" stroke="currentColor" stroke-width="1" fill="none" />
                </svg>
            </button>
            <button class="title-btn close" @click="$emit('close')">
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
defineEmits(['minimize', 'maximize', 'close'])
</script>

<style scoped>
.title-bar {
    height: 48px;
    background: #2d2d2d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0 0 0;
    user-select: none;
}

.title-bar-left {
    display: flex;
    align-items: center;
    gap: 0;
    height: 40px;
    padding-left: 8px;
}

.active-tab {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0c0c0c;
    height: 100%;
    padding: 0 12px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.terminal-icon {
    width: 16px;
    height: 16px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title-text {
    font-size: 12px;
    color: #ffffff;
    font-family: 'Segoe UI', sans-serif;
    font-weight: 600;
    margin-right: 24px;
}

.tab-control-btn {
    width: 32px;
    height: 28px;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    transition: background 0.15s;
}

.tab-control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.tab-control-btn.close-tab {
    font-size: 18px;
    font-weight: 300;
    border-radius: 4px;
}

.tab-control-btn.new-tab {
    font-size: 20px;
    font-weight: 300;
    margin-left: 8px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.tab-control-btn.dropdown-tab {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.tab-control-btn.dropdown-tab svg {
    margin-top: 0;
}

.separator {
    width: 1px;
    height: 28px;
    background: rgba(204, 204, 204, 0.3);
}

.title-bar-right {
    display: flex;
    gap: 0;
    height: 40px;
    margin-bottom: 16px;
}

.title-btn {
    width: 46px;
    height: 48px;
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}

.title-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.title-btn.close:hover {
    background: #c42b1c;
    color: white;
}
</style>