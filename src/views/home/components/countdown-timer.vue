<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
    /** 目标时间戳（毫秒） */
    targetTimestamp: number
}

const props = defineProps<Props>()

const currentTime = ref(Date.now())
let timer: number | null = null

// 计算剩余时间
const remainingTime = computed(() => {
    const diff = props.targetTimestamp - currentTime.value
    if (diff <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
        }
    }

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    return {
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        total: diff,
    }
})

// 格式化显示文本
const displayText = computed(() => {
    const { days, hours, minutes, seconds, total } = remainingTime.value

    if (total <= 0) {
        return '计算中...'
    }

    const parts: string[] = []

    if (days > 0) {
        parts.push(`${days}天`)
    }
    if (hours > 0 || days > 0) {
        parts.push(`${hours}小时`)
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        parts.push(`${minutes}分钟`)
    }
    parts.push(`${seconds}秒`)

    return parts.join(' ')
})

// 启动定时器
function startTimer() {
    timer = window.setInterval(() => {
        currentTime.value = Date.now()
    }, 1000)
}

// 停止定时器
function stopTimer() {
    if (timer !== null) {
        clearInterval(timer)
        timer = null
    }
}

onMounted(() => {
    startTimer()
})

onUnmounted(() => {
    stopTimer()
})
</script>

<template>
    <div class="countdown-timer">
        <span class="countdown-timer__text">{{ displayText }}</span>
    </div>
</template>

<style scoped lang="scss">
.countdown-timer {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.countdown-timer__text {
    font-size: 14px;
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
}
</style>
