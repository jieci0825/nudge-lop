/** 提醒模式类型 */
export type ScheduleMode = 'interval' | 'fixed' | 'hourly'

/** 间隔循环调度配置 */
export interface IntervalSchedule {
    mode: 'interval'
    /** 间隔分钟数 */
    intervalMinutes: number
}

/** 固定时间调度配置 */
export interface FixedSchedule {
    mode: 'fixed'
    /** 选中的日期（0-6，0 为周日） */
    days: number[]
    /** 时间点列表（HH:mm 格式） */
    times: string[]
}

/** 整点提醒调度配置 */
export interface HourlySchedule {
    mode: 'hourly'
    /** 选中的日期（0-6，0 为周日） */
    days: number[]
    /** 每小时的第几分钟（0-59） */
    minuteOfHour: number
}

/** 调度配置联合类型 */
export type ScheduleConfig = IntervalSchedule | FixedSchedule | HourlySchedule

/** Nudge 提醒项 */
export interface Nudge {
    id: number
    title: string
    description: string
    /** 调度配置 */
    scheduleConfig: ScheduleConfig
    /** 用于显示的调度描述（自动生成） */
    schedule: string
    nextReminder: string
    active: boolean
}

/** 表单数据（不含 id） */
export type NudgeFormData = Omit<Nudge, 'id' | 'schedule' | 'nextReminder'> & {
    scheduleConfig: ScheduleConfig
}
