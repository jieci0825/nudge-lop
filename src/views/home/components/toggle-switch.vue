<script setup lang="ts">
interface Props {
    modelValue?: boolean
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

function toggle(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
}
</script>

<template>
    <label
        class="toggle-switch"
        :class="{ 'toggle-switch--disabled': disabled }"
    >
        <input
            type="checkbox"
            class="toggle-switch__input"
            :checked="modelValue"
            :disabled="disabled"
            @change="toggle"
        />
        <span class="toggle-switch__slider">
            <span class="toggle-switch__thumb">
                <svg
                    v-if="modelValue"
                    class="toggle-switch__icon"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path
                        d="M2.5 6L5 8.5L9.5 4"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </span>
        </span>
    </label>
</template>

<style scoped lang="scss">
.toggle-switch {
    display: inline-flex;
    cursor: pointer;

    &--disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
}

.toggle-switch__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-switch__slider {
    width: 52px;
    height: 28px;
    background: var(--bg-surface);
    border-radius: var(--radius-full);
    position: relative;
    transition: background var(--transition-fast);

    .toggle-switch__input:checked + & {
        background: var(--color-primary);
    }
}

.toggle-switch__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    background: var(--text-primary);
    border-radius: var(--radius-full);
    transition: transform var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;

    .toggle-switch__input:checked + .toggle-switch__slider & {
        transform: translateX(24px);
    }
}

.toggle-switch__icon {
    width: 12px;
    height: 12px;
    color: var(--color-primary);
}
</style>
