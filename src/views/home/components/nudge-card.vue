<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleConfig } from '@/types/nudge'
import { calculateNextTriggerTime } from '@/utils/schedule'
import ToggleSwitch from './toggle-switch.vue'
import CountdownTimer from './countdown-timer.vue'

interface Props {
    title: string
    description: string
    schedule: string
    scheduleConfig: ScheduleConfig
    nextReminder?: string
    active?: boolean
    /** 上次触发时间戳（用于 interval 模式计算下次触发） */
    lastTriggerTime?: number
}

const props = withDefaults(defineProps<Props>(), {
    active: true,
    nextReminder: '',
    lastTriggerTime: undefined,
})

const emit = defineEmits<{
    'update:active': [value: boolean]
    'edit': []
}>()

// 计算下一次触发时间戳
const nextTriggerTimestamp = computed(() => {
    return calculateNextTriggerTime(props.scheduleConfig, props.lastTriggerTime)
})
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
        <p class="nudge-card__description">
            {{ description || '&nbsp;&nbsp;' }}
        </p>
        <div class="nudge-card__footer">
            <div
                class="nudge-card__schedule-tag"
                @click="emit('edit')"
            >
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
            <div class="nudge-card__next-reminder">
                <span class="nudge-card__next-reminder-label">下次提醒：</span>
                <span
                    v-if="!active"
                    class="nudge-card__paused-text"
                    >任务已关闭</span
                >
                <CountdownTimer
                    v-else
                    :target-timestamp="nextTriggerTimestamp"
                />
            </div>
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
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--color-primary);
    font-size: 14px;
    margin-top: var(--gap-sm);
}

.nudge-card__next-reminder-label {
    color: var(--text-secondary);
}

.nudge-card__paused-text {
    color: var(--text-tertiary);
}
</style>
