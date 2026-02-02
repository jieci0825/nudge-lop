<script setup lang="ts">
import AppButton from '@/components/button/index.vue'
import ToggleSwitch from './toggle-switch.vue'

interface Props {
    visible: boolean
    autoStart: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'update:autoStart': [value: boolean]
}>()

function handleClose() {
    emit('update:visible', false)
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="visible"
                class="modal-overlay"
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">设置</h2>
                        <button
                            class="modal-close"
                            @click="handleClose"
                        >
                            <i-lucide-x
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>

                    <div class="modal-body">
                        <!-- 开机自启 -->
                        <div class="setting-item">
                            <div class="setting-item__info">
                                <div class="setting-item__label">开机自启</div>
                                <div class="setting-item__desc">
                                    应用将在系统启动时自动运行
                                </div>
                            </div>
                            <ToggleSwitch
                                :model-value="autoStart"
                                @update:model-value="
                                    emit('update:autoStart', $event)
                                "
                            />
                        </div>

                        <!-- 系统通知说明 -->
                        <div class="setting-item setting-item--info">
                            <div class="setting-item__info">
                                <div class="setting-item__label">
                                    <i-lucide-bell
                                        width="16"
                                        height="16"
                                    />
                                    通知设置
                                </div>
                                <div class="setting-item__desc">
                                    提醒将通过系统原生通知发送。你可以在系统设置
                                    → 通知中调整通知行为和声音。
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <AppButton
                            type="primary"
                            @click="handleClose"
                        >
                            完成
                        </AppButton>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--gap-lg);
}

.modal-container {
    background: var(--bg-deep);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
    padding: var(--gap-lg);
    border-bottom: 1px solid var(--border-default);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.modal-close {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);

    &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--gap-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
}

.modal-footer {
    padding: var(--gap-lg);
    border-top: 1px solid var(--border-default);
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-lg);
    padding: var(--gap-base);
    background: var(--bg-surface);
    border-radius: var(--radius-md);
}

.setting-item--info {
    background: var(--bg-deep);
    border: 1px solid var(--border-default);
}

.setting-item__info {
    flex: 1;
}

.setting-item__label {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--gap-xs);
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
}

.setting-item__desc {
    font-size: 13px;
    color: var(--text-tertiary);
    line-height: 1.5;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
    transition: opacity var(--transition-base);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition: transform var(--transition-base), opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    transform: scale(0.95);
    opacity: 0;
}
</style>
