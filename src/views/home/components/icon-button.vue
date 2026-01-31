<script setup lang="ts">
interface Props {
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    disabled: false,
})
</script>

<template>
    <button
        class="icon-button"
        :class="{ 'icon-button--disabled': disabled }"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<style scoped lang="scss">
.icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover:not(:disabled) {
        background: var(--bg-elevated);
        color: var(--text-primary);
    }

    &--disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
}
</style>
