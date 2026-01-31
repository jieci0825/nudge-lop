import { ref, watch, onUnmounted } from 'vue'
import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification'
import type { Nudge } from '@/types/nudge'
import { calculateNextTriggerTime } from '@/utils/schedule'

export interface TriggeredNudge {
    nudge: Nudge
    triggeredAt: number
}

// 缓存权限状态，避免重复检查
let permissionGranted: boolean | null = null

/**
 * 检查并请求通知权限
 */
async function ensureNotificationPermission(): Promise<boolean> {
    // 如果已经检查过权限，直接返回缓存结果
    if (permissionGranted !== null) {
        return permissionGranted
    }

    try {
        // 检查是否已授予权限
        permissionGranted = await isPermissionGranted()

        // 如果没有，请求权限
        if (!permissionGranted) {
            const permission = await requestPermission()
            permissionGranted = permission === 'granted'
        }

        return permissionGranted
    } catch (error) {
        console.error('Failed to check notification permission:', error)
        return false
    }
}

/**
 * 发送系统原生通知
 */
async function sendSystemNotification(title: string, body: string) {
    try {
        // 确保有通知权限
        const hasPermission = await ensureNotificationPermission()
        console.log('hasPermission', hasPermission)
        if (!hasPermission) {
            console.warn('Notification permission not granted')
            return
        }
        console.log('sendNotification', title, body)
        // 发送通知
        sendNotification({ title, body })
    } catch (error) {
        console.error('Failed to send system notification:', error)
    }
}

/**
 * 任务调度器 composable
 * 监听所有激活的 nudge，在到达触发时间时发送系统通知
 */
export function useScheduler(nudges: () => Nudge[]) {
    // 当前触发的任务（用于更新 lastTriggerTime）
    const triggeredNudge = ref<TriggeredNudge | null>(null)
    // 调度器状态
    const isRunning = ref(false)
    // 存储每个 nudge 的定时器
    const timers = new Map<number, ReturnType<typeof setTimeout>>()
    // 存储每个 nudge 的下次触发时间
    const nextTriggerTimes = new Map<number, number>()

    /**
     * 调度单个 nudge
     */
    function scheduleNudge(nudge: Nudge) {
        // 如果任务未激活，跳过
        if (!nudge.active) {
            clearNudgeTimer(nudge.id)
            return
        }

        // 清除已存在的定时器
        clearNudgeTimer(nudge.id)

        // 计算下一次触发时间
        const nextTime = calculateNextTriggerTime(nudge.scheduleConfig)
        const now = Date.now()
        const delay = nextTime - now

        // 存储下次触发时间
        nextTriggerTimes.set(nudge.id, nextTime)

        // 如果延迟时间有效，设置定时器
        if (delay > 0) {
            const timer = setTimeout(() => {
                triggerNudge(nudge)
            }, delay)
            timers.set(nudge.id, timer)
        } else {
            // 如果时间已过，立即触发并重新调度
            triggerNudge(nudge)
        }
    }

    /**
     * 触发 nudge - 发送系统原生通知
     */
    async function triggerNudge(nudge: Nudge) {
        // 发送系统通知
        const body = nudge.description || '是时候行动了！'
        await sendSystemNotification(nudge.title, body)

        // 更新触发状态（用于记录 lastTriggerTime）
        triggeredNudge.value = {
            nudge,
            triggeredAt: Date.now(),
        }

        // 自动清除触发状态
        setTimeout(() => {
            if (
                triggeredNudge.value &&
                triggeredNudge.value.nudge.id === nudge.id
            ) {
                triggeredNudge.value = null
            }
        }, 1000)

        // 触发后重新调度下一次
        // 使用 setTimeout 确保下一次调度时间是基于当前触发时间计算的
        setTimeout(() => {
            // 重新获取最新的 nudge 状态
            const currentNudges = nudges()
            const currentNudge = currentNudges.find(n => n.id === nudge.id)
            if (currentNudge && currentNudge.active) {
                scheduleNudge(currentNudge)
            }
        }, 1000)
    }

    /**
     * 清除单个 nudge 的定时器
     */
    function clearNudgeTimer(nudgeId: number) {
        const timer = timers.get(nudgeId)
        if (timer) {
            clearTimeout(timer)
            timers.delete(nudgeId)
        }
        nextTriggerTimes.delete(nudgeId)
    }

    /**
     * 清除所有定时器
     */
    function clearAllTimers() {
        timers.forEach(timer => clearTimeout(timer))
        timers.clear()
        nextTriggerTimes.clear()
    }

    /**
     * 启动调度器
     */
    function start() {
        if (isRunning.value) return
        isRunning.value = true

        const currentNudges = nudges()
        currentNudges.forEach(nudge => {
            if (nudge.active) {
                scheduleNudge(nudge)
            }
        })
    }

    /**
     * 停止调度器
     */
    function stop() {
        isRunning.value = false
        clearAllTimers()
    }

    /**
     * 重新调度所有任务
     */
    function rescheduleAll() {
        clearAllTimers()
        if (!isRunning.value) return

        const currentNudges = nudges()
        currentNudges.forEach(nudge => {
            if (nudge.active) {
                scheduleNudge(nudge)
            }
        })
    }

    /**
     * 关闭当前弹窗
     */
    function dismissCurrentNudge() {
        triggeredNudge.value = null
    }

    /**
     * 获取 nudge 的下次触发时间
     */
    function getNextTriggerTime(nudgeId: number): number | undefined {
        return nextTriggerTimes.get(nudgeId)
    }

    // 监听 nudges 变化，重新调度
    watch(
        () => nudges(),
        newNudges => {
            if (!isRunning.value) return

            // 找出需要更新的 nudge
            const currentIds = new Set(newNudges.map(n => n.id))

            // 清除已删除的 nudge 的定时器
            timers.forEach((_, id) => {
                if (!currentIds.has(id)) {
                    clearNudgeTimer(id)
                }
            })

            // 重新调度所有 nudge
            newNudges.forEach(nudge => {
                scheduleNudge(nudge)
            })
        },
        { deep: true }
    )

    // 组件卸载时清理
    onUnmounted(() => {
        stop()
    })

    return {
        triggeredNudge,
        isRunning,
        start,
        stop,
        rescheduleAll,
        dismissCurrentNudge,
        getNextTriggerTime,
    }
}
