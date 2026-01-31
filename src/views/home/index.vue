<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppHeader from './components/app-header.vue'
import NudgeList from './components/nudge-list.vue'
import SettingsModal from './components/settings-modal.vue'
import { useSettings } from '@/composables/use-settings'
import { useNudges } from '@/composables/use-nudges'
import { useScheduler } from '@/composables/use-scheduler'

const nudgeListRef = ref<InstanceType<typeof NudgeList> | null>(null)
const settingsVisible = ref(false)

const { settings, updateSettings } = useSettings()
const { nudges, update: updateNudge } = useNudges()

// 初始化任务调度器
const { triggeredNudge, start: startScheduler } = useScheduler(
    () => nudges.value
)

// 监听触发事件，更新 nudge 的 lastTriggerTime
watch(triggeredNudge, newValue => {
    if (newValue) {
        updateNudge(newValue.nudge.id, {
            lastTriggerTime: newValue.triggeredAt,
        })
    }
})

function handleAddTask() {
    nudgeListRef.value?.openCreateForm()
}

function handleOpenSettings() {
    settingsVisible.value = true
}

// 启动调度器
onMounted(() => {
    startScheduler()
})
</script>

<template>
    <div class="home">
        <AppHeader
            @add-task="handleAddTask"
            @open-settings="handleOpenSettings"
        />
        <main class="home__main">
            <NudgeList ref="nudgeListRef" />
        </main>
        <SettingsModal
            v-model:visible="settingsVisible"
            v-model:auto-start="settings.autoStart"
            @update:auto-start="updateSettings({ autoStart: $event })"
        />
    </div>
</template>

<style scoped lang="scss">
.home {
    min-height: 100vh;
    background: var(--bg-deep);
}

.home__main {
    margin: 0 auto;
}
</style>
