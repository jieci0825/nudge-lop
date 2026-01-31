import type { ScheduleConfig } from '@/types/nudge'

/**
 * 计算下一次触发的时间戳
 * @param scheduleConfig 调度配置
 * @param lastTriggerTime 上次触发时间戳（可选，用于间隔模式）
 * @returns 下一次触发的时间戳（毫秒）
 */
export function calculateNextTriggerTime(
    scheduleConfig: ScheduleConfig,
    lastTriggerTime?: number
): number {
    const now = Date.now()

    switch (scheduleConfig.mode) {
        case 'interval':
            return calculateIntervalNext(
                scheduleConfig.intervalMinutes,
                lastTriggerTime || now
            )

        case 'fixed':
            return calculateFixedNext(scheduleConfig.days, scheduleConfig.times)

        case 'hourly':
            return calculateHourlyNext(
                scheduleConfig.days,
                scheduleConfig.minuteOfHour
            )

        default:
            return now
    }
}

/**
 * 计算间隔模式的下一次触发时间
 */
function calculateIntervalNext(
    intervalMinutes: number,
    lastTriggerTime: number
): number {
    const now = Date.now()
    const nextTime = lastTriggerTime + intervalMinutes * 60 * 1000

    // 如果计算出的下次时间已经过去，则从现在开始计算
    return nextTime > now ? nextTime : now + intervalMinutes * 60 * 1000
}

/**
 * 计算固定时间模式的下一次触发时间
 */
function calculateFixedNext(days: number[], times: string[]): number {
    if (days.length === 0 || times.length === 0) {
        return Date.now()
    }

    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    // 将时间字符串转换为分钟数
    const timeMinutes = times
        .map(time => {
            const [hours, minutes] = time.split(':').map(Number)
            return hours * 60 + minutes
        })
        .sort((a, b) => a - b)

    // 检查今天是否有符合条件的时间点
    if (days.includes(currentDay)) {
        const todayTimes = timeMinutes.filter(time => time > currentTime)
        if (todayTimes.length > 0) {
            const nextMinute = todayTimes[0]
            const nextDate = new Date(now)
            nextDate.setHours(
                Math.floor(nextMinute / 60),
                nextMinute % 60,
                0,
                0
            )
            return nextDate.getTime()
        }
    }

    // 查找未来 7 天内最近的一次
    for (let i = 1; i <= 7; i++) {
        const checkDay = (currentDay + i) % 7
        if (days.includes(checkDay)) {
            const nextDate = new Date(now)
            nextDate.setDate(now.getDate() + i)
            const firstTime = timeMinutes[0]
            nextDate.setHours(Math.floor(firstTime / 60), firstTime % 60, 0, 0)
            return nextDate.getTime()
        }
    }

    return Date.now()
}

/**
 * 计算整点提醒模式的下一次触发时间
 */
function calculateHourlyNext(days: number[], minuteOfHour: number): number {
    if (days.length === 0) {
        return Date.now()
    }

    const now = new Date()
    const currentDay = now.getDay()
    const currentMinute = now.getMinutes()
    const currentHour = now.getHours()

    // 检查今天是否在选中的日期中
    if (days.includes(currentDay)) {
        // 检查当前小时的提醒时间是否还没到
        if (currentMinute < minuteOfHour) {
            const nextDate = new Date(now)
            nextDate.setMinutes(minuteOfHour, 0, 0)
            return nextDate.getTime()
        }

        // 检查今天后续的小时
        if (currentHour < 23) {
            const nextDate = new Date(now)
            nextDate.setHours(currentHour + 1, minuteOfHour, 0, 0)
            return nextDate.getTime()
        }
    }

    // 查找未来 7 天内最近的一次
    for (let i = 1; i <= 7; i++) {
        const checkDay = (currentDay + i) % 7
        if (days.includes(checkDay)) {
            const nextDate = new Date(now)
            nextDate.setDate(now.getDate() + i)
            nextDate.setHours(0, minuteOfHour, 0, 0)
            return nextDate.getTime()
        }
    }

    return Date.now()
}
