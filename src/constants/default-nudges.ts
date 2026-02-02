import type { Nudge } from '@/types/nudge'

/** 默认任务数据（不含 id，添加时会自动生成） */
export type DefaultNudge = Omit<Nudge, 'id' | 'schedule' | 'nextReminder'>

/** 默认任务列表 */
export const DEFAULT_NUDGES: DefaultNudge[] = [
    {
        title: '久坐伤身',
        description: '久坐伤身，常站常动才是人体的"默认设置"。',
        scheduleConfig: {
            mode: 'interval',
            intervalMinutes: 45,
        },
        active: true,
    },
    {
        title: '该喝水了',
        description: '及时补水，别等口渴才想起身体。',
        scheduleConfig: {
            mode: 'interval',
            intervalMinutes: 30,
        },
        active: true,
    },
]
