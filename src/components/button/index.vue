<script setup lang="ts">
type ButtonType = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'small' | 'medium' | 'large'

interface Props {
    type?: ButtonType
    size?: ButtonSize
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'primary',
    size: 'medium',
    disabled: false,
})
</script>

<template>
    <button
        class="btn"
        :class="[`btn-${type}`, `btn-${size}`]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<style scoped lang="scss">
.btn {
    border-radius: var(--radius-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    &:disabled {
        cursor: not-allowed;
    }
}

.btn-primary {
    background: var(--color-primary);
    color: var(--text-inverse);

    &:hover:not(:disabled) {
        background: var(--color-primary-hover);
    }

    &:active:not(:disabled) {
        background: var(--color-primary-active);
    }

    &:disabled {
        background: var(--color-primary-disabled);
    }
}

.btn-outline {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);

    &:hover:not(:disabled) {
        background: var(--color-primary-ghost);
    }

    &:disabled {
        opacity: 0.5;
    }
}

.btn-ghost {
    background: var(--color-primary-ghost);
    color: var(--color-primary);

    &:hover:not(:disabled) {
        background: rgba(62, 249, 28, 0.2);
    }

    &:disabled {
        opacity: 0.5;
    }
}

/* Size variants */
.btn-small {
    padding: var(--gap-xs) var(--gap-sm);
    font-size: 13px;
}

.btn-medium {
    padding: var(--gap-sm) var(--gap-md);
    font-size: 14px;
}

.btn-large {
    padding: var(--gap-base) var(--gap-lg);
    font-size: 16px;
}
</style>
