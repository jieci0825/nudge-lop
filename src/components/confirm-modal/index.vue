<script setup lang="ts">
import AppButton from '@/components/button/index.vue'

interface Props {
    visible: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    title: '确认操作',
    confirmText: '确认',
    cancelText: '取消',
    type: 'warning',
})

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'confirm': []
    'cancel': []
}>()

function handleClose() {
    emit('update:visible', false)
    emit('cancel')
}

function handleConfirm() {
    emit('update:visible', false)
    emit('confirm')
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
                        <div
                            class="modal-icon"
                            :class="`modal-icon--${type}`"
                        >
                            <i-lucide-alert-triangle
                                v-if="type === 'warning' || type === 'danger'"
                                width="24"
                                height="24"
                            />
                            <i-lucide-info
                                v-else
                                width="24"
                                height="24"
                            />
                        </div>
                        <h2 class="modal-title">{{ title }}</h2>
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
                        <p class="modal-message">{{ message }}</p>
                    </div>

                    <div class="modal-footer">
                        <AppButton
                            type="outline"
                            @click="handleClose"
                        >
                            {{ cancelText }}
                        </AppButton>
                        <AppButton
                            type="primary"
                            @click="handleConfirm"
                        >
                            {{ confirmText }}
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
    padding: var(--gap-base);
}

.modal-container {
    background: var(--bg-deep);
    border-radius: var(--radius-base);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
    padding: var(--gap-base);
    padding-bottom: var(--gap-sm);
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.modal-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-icon--warning {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
}

.modal-icon--danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.modal-icon--info {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
}

.modal-title {
    flex: 1;
    font-size: 18px;
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
    padding: var(--gap-sm) var(--gap-base);
}

.modal-message {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.modal-footer {
    padding: var(--gap-base);
    padding-top: var(--gap-base);
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
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
