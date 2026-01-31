<script setup lang="ts">
import { ref } from 'vue'
import FilterTabs from './filter-tabs.vue'
import NudgeCard from './nudge-card.vue'
import NudgeCreateCard from './nudge-create-card.vue'

const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'paused', label: 'Paused' },
]

const activeFilter = ref('all')

const nudges = ref([
    {
        id: 1,
        title: '起身活动',
        description: '站起来活动一下，伸展你的身体吧',
        schedule: '每 45 分钟',
        nextReminder: '42 分钟后',
        active: true,
    },
    {
        id: 2,
        title: '眼部休息',
        description: '看看远处，让眼睛放松一下',
        schedule: '每 20 分钟',
        nextReminder: '15 分钟后',
        active: true,
    },
    {
        id: 3,
        title: '调整坐姿',
        description: '检查一下你的坐姿是否正确',
        schedule: '每 1 小时',
        nextReminder: '',
        active: false,
    },
    {
        id: 4,
        title: '深呼吸',
        description: '做几次深呼吸，放松身心',
        schedule: '每 2 小时',
        nextReminder: '1 小时 30 分钟后',
        active: true,
    },
    {
        id: 5,
        title: '喝水提醒',
        description: '记得补充水分，保持身体水分充足',
        schedule: '每 30 分钟',
        nextReminder: '25 分钟后',
        active: true,
    },
])

function toggleNudge(id: number, value: boolean) {
    const nudge = nudges.value.find(n => n.id === id)
    if (nudge) {
        nudge.active = value
    }
}
</script>

<template>
    <section class="nudge-list">
        <div class="nudge-list__header">
            <div class="nudge-list__title-area">
                <h1 class="nudge-list__title">Active Nudges</h1>
                <p class="nudge-list__subtitle">
                    Next nudge in
                    <span class="nudge-list__countdown">04:21</span> • Hydration
                </p>
            </div>
            <FilterTabs
                v-model="activeFilter"
                :tabs="filterTabs"
            />
        </div>
        <div class="nudge-list__grid">
            <NudgeCard
                v-for="nudge in nudges"
                :key="nudge.id"
                :title="nudge.title"
                :description="nudge.description"
                :schedule="nudge.schedule"
                :next-reminder="nudge.nextReminder"
                :active="nudge.active"
                @update:active="toggleNudge(nudge.id, $event)"
            />
            <NudgeCreateCard />
        </div>
    </section>
</template>

<style scoped lang="scss">
.nudge-list {
    padding: var(--gap-lg);
}

.nudge-list__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--gap-lg);
}

.nudge-list__title-area {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.nudge-list__title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.nudge-list__subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
}

.nudge-list__countdown {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.nudge-list__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--gap-md);
}
</style>
