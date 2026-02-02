import { ref, computed, watch } from 'vue'
import type { Nudge, ScheduleConfig } from '@/types/nudge'
import { loadNudges, saveNudges } from '@/utils/storage'
import { DEFAULT_NUDGES } from '@/constants/default-nudges'

// 从本地存储加载 nudges 数据
const nudges = ref<Nudge[]>(loadNudges())

/**
 * 根据调度配置生成描述文本
 */
function generateScheduleText(config: ScheduleConfig): string {
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    const formatDays = (days: number[]): string => {
        if (days.length === 7) return '每天'
        const sorted = days
            .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
            .map(d => dayNames[d])
            .join('、')
        return `周${sorted}`
    }

    switch (config.mode) {
        case 'interval':
            return `每 ${config.intervalMinutes} 分钟`
        case 'fixed':
            return `${formatDays(config.days)} ${config.times.length} 个时间点`
        case 'hourly':
            return `${formatDays(config.days)} 每小时第 ${
                config.minuteOfHour
            } 分`
    }
}

// 监听 nudges 变化，自动保存到本地存储
watch(
    nudges,
    newNudges => {
        saveNudges(newNudges)
    },
    { deep: true }
)

export type FilterType = 'all' | 'active' | 'paused'

export function useNudges() {
    const activeFilter = ref<FilterType>('all')

    const filteredNudges = computed(() => {
        switch (activeFilter.value) {
            case 'active':
                return nudges.value.filter(n => n.active)
            case 'paused':
                return nudges.value.filter(n => !n.active)
            default:
                return nudges.value
        }
    })

    function setNudges(list: Nudge[]) {
        nudges.value = list
    }

    function add(nudge: Omit<Nudge, 'id'>) {
        nudges.value.push({
            ...nudge,
            id: Date.now(),
        })
    }

    function remove(id: number) {
        const index = nudges.value.findIndex(n => n.id === id)
        if (index !== -1) {
            nudges.value.splice(index, 1)
        }
    }

    function toggle(id: number, active: boolean) {
        const nudge = nudges.value.find(n => n.id === id)
        if (nudge) {
            nudge.active = active
        }
    }

    function update(id: number, data: Partial<Omit<Nudge, 'id'>>) {
        const nudge = nudges.value.find(n => n.id === id)
        if (nudge) {
            Object.assign(nudge, data)
        }
    }

    /**
     * 重置为默认任务
     * 清空所有任务，然后添加默认任务
     */
    function resetToDefault() {
        nudges.value = DEFAULT_NUDGES.map((defaultNudge, index) => ({
            ...defaultNudge,
            id: Date.now() + index,
            schedule: generateScheduleText(defaultNudge.scheduleConfig),
            nextReminder: '计算中...',
        }))
    }

    return {
        nudges,
        activeFilter,
        filteredNudges,
        setNudges,
        add,
        remove,
        toggle,
        update,
        resetToDefault,
    }
}
