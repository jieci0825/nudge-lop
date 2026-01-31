<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Nudge, ScheduleMode, ScheduleConfig } from '@/types/nudge'
import { useNudges } from '@/composables/use-nudges'
import NudgeFormModal from './nudge-form-modal.vue'

interface Props {
    visible: boolean
    /** 编辑模式下传入的 Nudge 数据 */
    editData?: Nudge | null
}

const props = withDefaults(defineProps<Props>(), {
    editData: null,
})

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'success': []
}>()

const { nudges, add, update } = useNudges()

const mode = computed(() => (props.editData ? 'edit' : 'add'))

const title = ref('')
const description = ref('')
const scheduleMode = ref<ScheduleMode>('interval')
const intervalMinutes = ref(30)
const selectedDays = ref<number[]>([1, 2, 3, 4, 5])
const times = ref<string[]>(['09:00'])
const minuteOfHour = ref(0)

function resetForm() {
    title.value = ''
    description.value = ''
    scheduleMode.value = 'interval'
    intervalMinutes.value = 30
    selectedDays.value = [1, 2, 3, 4, 5]
    times.value = ['09:00']
    minuteOfHour.value = 0
}

function loadEditData(data: Nudge) {
    title.value = data.title
    description.value = data.description

    const config = data.scheduleConfig
    scheduleMode.value = config.mode

    if (config.mode === 'interval') {
        intervalMinutes.value = config.intervalMinutes
    } else if (config.mode === 'fixed') {
        selectedDays.value = [...config.days]
        times.value = [...config.times]
    } else if (config.mode === 'hourly') {
        selectedDays.value = [...config.days]
        minuteOfHour.value = config.minuteOfHour
    }
}

watch(
    () => props.visible,
    visible => {
        if (visible) {
            if (props.editData) {
                loadEditData(props.editData)
            } else {
                resetForm()
            }
        }
    }
)

/** 校验时间字符串是否合法（HH:mm，小时 0-23，分钟 0-59） */
function isValidTimeStr(str: string): boolean {
    if (!/^\d{1,2}:\d{1,2}$/.test(str)) return false
    const [h, m] = str.split(':').map(Number)
    return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/** 固定时间模式下，去重并返回合法时间列表 */
function getDedupedValidTimes(): string[] {
    const unique = [...new Set(times.value)]
    return unique.filter(isValidTimeStr)
}

function buildScheduleConfig(fixedTimes?: string[]): ScheduleConfig {
    switch (scheduleMode.value) {
        case 'interval':
            return {
                mode: 'interval',
                intervalMinutes: intervalMinutes.value,
            }
        case 'fixed':
            return {
                mode: 'fixed',
                days: [...selectedDays.value],
                times: fixedTimes ?? [...times.value],
            }
        case 'hourly':
            return {
                mode: 'hourly',
                days: [...selectedDays.value],
                minuteOfHour: minuteOfHour.value,
            }
    }
}

function formatDays(days: number[]): string {
    if (days.length === 7) {
        return '每天'
    }
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    const sorted = days
        .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
        .map(d => dayNames[d])
        .join('、')
    return `周${sorted}`
}

function generateScheduleText(config: ScheduleConfig): string {
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

function handleSubmit() {
    const trimmedTitle = title.value.trim()
    if (!trimmedTitle) {
        return
    }

    // 新增时：检查是否存在同名任务
    if (mode.value === 'add') {
        const hasSameName = nudges.value.some(
            n => n.title.trim() === trimmedTitle
        )
        if (hasSameName) {
            alert('已存在同名任务，请修改标题后再添加')
            return
        }
    }

    // 固定时间模式：校验时间合法性并去重
    if (scheduleMode.value === 'fixed') {
        const invalidTimes = times.value.filter(t => !isValidTimeStr(t))
        if (invalidTimes.length > 0) {
            alert('存在非法时间，请使用 HH:mm 格式（小时 0-23，分钟 0-59）')
            return
        }
        const dedupedTimes = getDedupedValidTimes()
        if (dedupedTimes.length === 0) {
            alert('请至少添加一个有效时间点')
            return
        }
        // 同步回表单，避免下次打开仍是重复项
        times.value = dedupedTimes
    }

    const scheduleConfig = buildScheduleConfig(
        scheduleMode.value === 'fixed' ? times.value : undefined
    )
    const schedule = generateScheduleText(scheduleConfig)

    if (mode.value === 'add') {
        add({
            title: trimmedTitle,
            description: description.value.trim(),
            scheduleConfig,
            schedule,
            nextReminder: '计算中...',
            active: true,
        })
    } else if (props.editData) {
        update(props.editData.id, {
            title: trimmedTitle,
            description: description.value.trim(),
            scheduleConfig,
            schedule,
        })
    }

    emit('update:visible', false)
    emit('success')
}

function handleCancel() {
    emit('update:visible', false)
}
</script>

<template>
    <NudgeFormModal
        :visible="visible"
        :mode="mode"
        :title="title"
        :description="description"
        :schedule-mode="scheduleMode"
        :interval-minutes="intervalMinutes"
        :selected-days="selectedDays"
        :times="times"
        :minute-of-hour="minuteOfHour"
        @update:visible="emit('update:visible', $event)"
        @update:title="title = $event"
        @update:description="description = $event"
        @update:schedule-mode="scheduleMode = $event"
        @update:interval-minutes="intervalMinutes = $event"
        @update:selected-days="selectedDays = $event"
        @update:times="times = $event"
        @update:minute-of-hour="minuteOfHour = $event"
        @submit="handleSubmit"
        @cancel="handleCancel"
    />
</template>
