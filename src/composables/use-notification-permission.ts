import { ref } from 'vue'
import {
    isPermissionGranted,
    requestPermission,
} from '@tauri-apps/plugin-notification'

export function useNotificationPermission() {
    const hasPermission = ref<boolean | null>(null)
    const isChecking = ref(false)
    const showPermissionModal = ref(false)

    /**
     * 检查通知权限状态
     */
    async function checkPermission(): Promise<boolean> {
        isChecking.value = true
        try {
            const granted = await isPermissionGranted()
            hasPermission.value = granted
            return granted
        } catch (error) {
            console.error('检查通知权限失败:', error)
            hasPermission.value = false
            return false
        } finally {
            isChecking.value = false
        }
    }

    /**
     * 请求通知权限
     */
    async function requestNotificationPermission(): Promise<boolean> {
        try {
            const permission = await requestPermission()
            const granted = permission === 'granted'
            hasPermission.value = granted
            return granted
        } catch (error) {
            console.error('请求通知权限失败:', error)
            return false
        }
    }

    /**
     * 初始化时检查权限，如果没有权限则显示弹窗
     */
    async function initPermissionCheck() {
        const granted = await checkPermission()
        if (!granted) {
            showPermissionModal.value = true
        }
    }

    /**
     * 处理用户确认请求权限
     */
    async function handleRequestPermission() {
        const granted = await requestNotificationPermission()
        if (granted) {
            showPermissionModal.value = false
        }
        return granted
    }

    /**
     * 关闭权限弹窗
     */
    function closePermissionModal() {
        showPermissionModal.value = false
    }

    return {
        hasPermission,
        isChecking,
        showPermissionModal,
        checkPermission,
        requestNotificationPermission,
        initPermissionCheck,
        handleRequestPermission,
        closePermissionModal,
    }
}
