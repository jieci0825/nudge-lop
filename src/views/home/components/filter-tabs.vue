<script setup lang="ts">
interface TabItem {
    key: string
    label: string
}

interface Props {
    tabs: TabItem[]
    modelValue?: string
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

function selectTab(key: string) {
    emit('update:modelValue', key)
}
</script>

<template>
    <div class="filter-tabs">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            class="filter-tabs__item"
            :class="{ 'filter-tabs__item--active': modelValue === tab.key }"
            @click="selectTab(tab.key)"
        >
            {{ tab.label }}
        </button>
    </div>
</template>

<style scoped lang="scss">
.filter-tabs {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    background: var(--bg-elevated);
    border-radius: var(--radius-md);
    padding: 4px;
}

.filter-tabs__item {
    padding: var(--gap-xs) var(--gap-base);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--radius-base);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover:not(.filter-tabs__item--active) {
        color: var(--text-primary);
    }

    &--active {
        background: var(--color-primary);
        color: var(--text-inverse);
    }
}
</style>
