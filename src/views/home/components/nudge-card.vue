<script setup lang="ts">
import ToggleSwitch from './toggle-switch.vue'

interface Props {
    title: string
    description: string
    schedule: string
    nextReminder?: string
    active?: boolean
}

withDefaults(defineProps<Props>(), {
    active: true,
    nextReminder: '',
})

const emit = defineEmits<{
    'update:active': [value: boolean]
}>()
</script>

<template>
    <div
        class="nudge-card"
        :class="{ 'nudge-card--inactive': !active }"
    >
        <div class="nudge-card__header">
            <h3 class="nudge-card__title">{{ title }}</h3>
            <ToggleSwitch
                :model-value="active"
                @update:model-value="emit('update:active', $event)"
            />
        </div>
        <p class="nudge-card__description">{{ description }}</p>
        <div class="nudge-card__footer">
            <div class="nudge-card__schedule-tag">
                <i-lucide-refresh-cw
                    class="nudge-card__refresh-icon"
                    width="14"
                    height="14"
                />
                <span>{{ schedule }}</span>
                <i-lucide-bolt
                    class="nudge-card__bolt-icon"
                    width="14"
                    height="14"
                />
            </div>
            <p
                v-if="nextReminder"
                class="nudge-card__next-reminder"
            >
                下次提醒：{{ nextReminder }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.nudge-card {
    min-width: 300px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    padding: var(--gap-md);
    transition: all var(--transition-fast);
    -webkit-user-select: none;
    user-select: none;

    &:hover {
        border-color: var(--border-hover);
    }

    &--inactive {
        opacity: 0.6;
    }
}

.nudge-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-base);
}

.nudge-card__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.nudge-card__description {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
    margin-top: var(--gap-sm);
}

.nudge-card__footer {
    margin-top: var(--gap-base);
}

.nudge-card__schedule-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    background: var(--bg-surface);
    border-radius: var(--radius-full);
    padding: var(--gap-xs) var(--gap-sm);
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;

    [class^='i-lucide'] {
        flex-shrink: 0;
    }
}

.nudge-card__refresh-icon {
    color: var(--text-tertiary);
}

.nudge-card__settings-icon {
    color: var(--text-tertiary);
    margin-left: var(--gap-xs);
}

.nudge-card__next-reminder {
    color: var(--color-primary);
    font-size: 14px;
    margin-top: var(--gap-sm);
}
</style>
