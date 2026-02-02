<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppHeader from './components/app-header.vue'
import NudgeList from './components/nudge-list.vue'
import SettingsModal from './components/settings-modal.vue'
import ConfirmModal from '@/components/confirm-modal/index.vue'
import { useSettings } from '@/composables/use-settings'
import { useNudges } from '@/composables/use-nudges'
import { useScheduler } from '@/composables/use-scheduler'
import { useNotificationPermission } from '@/composables/use-notification-permission'

const nudgeListRef = ref<InstanceType<typeof NudgeList> | null>(null)
const settingsVisible = ref(false)
const resetConfirmVisible = ref(false)

const { settings, updateSettings } = useSettings()
const { nudges, update: updateNudge, resetToDefault } = useNudges()

// 通知权限管理
const {
    showPermissionModal,
    initPermissionCheck,
    handleRequestPermission,
    closePermissionModal,
} = useNotificationPermission()

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

function handleResetToDefault() {
    resetConfirmVisible.value = true
}

function confirmReset() {
    resetToDefault()
}

// 启动调度器并检查通知权限
onMounted(() => {
    startScheduler()
    initPermissionCheck()
})
</script>

<template>
    <div class="home">
        <AppHeader
            @add-task="handleAddTask"
            @open-settings="handleOpenSettings"
            @reset-to-default="handleResetToDefault"
        />
        <main class="home__main">
            <NudgeList ref="nudgeListRef" />
        </main>
        <SettingsModal
            v-model:visible="settingsVisible"
            v-model:auto-start="settings.autoStart"
            @update:auto-start="updateSettings({ autoStart: $event })"
        />

        <ConfirmModal
            v-model:visible="resetConfirmVisible"
            title="重置任务"
            message="确定要重置为默认任务吗？这将删除所有现有任务，恢复为初始的默认配置。"
            confirm-text="确认重置"
            cancel-text="取消"
            type="warning"
            @confirm="confirmReset"
        />

        <!-- 通知权限提示弹窗 -->
        <ConfirmModal
            v-model:visible="showPermissionModal"
            title="开启通知权限"
            message="Nudge Loop 需要通知权限才能在任务触发时提醒您。请点击「去开启」按钮授予通知权限。"
            confirm-text="去开启"
            cancel-text="稍后再说"
            type="info"
            @confirm="handleRequestPermission"
            @cancel="closePermissionModal"
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
