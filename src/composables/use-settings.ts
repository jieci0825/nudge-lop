import { ref } from 'vue'
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart'
import type { AppSettings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

const STORAGE_KEY = 'app_settings'

// 从 localStorage 加载设置
function loadSettings(): AppSettings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        }
    } catch (error) {
        console.error('Failed to load settings:', error)
    }
    return { ...DEFAULT_SETTINGS }
}

// 保存设置到 localStorage
function saveSettings(settings: AppSettings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
        console.error('Failed to save settings:', error)
    }
}

// 设置开机自启
async function setAutoStart(enabled: boolean): Promise<boolean> {
    try {
        if (enabled) {
            await enable()
        } else {
            await disable()
        }
        return true
    } catch (error) {
        console.error('Failed to set autostart:', error)
        return false
    }
}

// 获取开机自启状态
async function getAutoStartStatus(): Promise<boolean> {
    try {
        return await isEnabled()
    } catch (error) {
        console.error('Failed to get autostart status:', error)
        return false
    }
}

const settings = ref<AppSettings>(loadSettings())

// 初始化时同步系统开机自启状态
async function syncAutoStartStatus() {
    try {
        const systemAutoStart = await getAutoStartStatus()
        if (settings.value.autoStart !== systemAutoStart) {
            settings.value.autoStart = systemAutoStart
            saveSettings(settings.value)
        }
    } catch (error) {
        console.error('Failed to sync autostart status:', error)
    }
}

// 初始化时同步状态
syncAutoStartStatus()

export function useSettings() {
    async function updateSettings(updates: Partial<AppSettings>) {
        // 如果更新开机自启设置，先调用系统 API
        if (updates.autoStart !== undefined) {
            const success = await setAutoStart(updates.autoStart)
            if (!success) {
                // 如果设置失败，不更新本地状态
                console.error('Failed to update autostart setting')
                return
            }
        }

        settings.value = { ...settings.value, ...updates }
        saveSettings(settings.value)
    }

    function resetSettings() {
        // 重置时禁用开机自启
        setAutoStart(false)
        settings.value = { ...DEFAULT_SETTINGS }
        saveSettings(settings.value)
    }

    return {
        settings,
        updateSettings,
        resetSettings,
    }
}
