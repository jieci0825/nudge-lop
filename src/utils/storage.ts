/**
 * 本地存储工具模块
 * 提供类型安全的 localStorage 封装
 */

import {
    STORAGE_PREFIX,
    STORAGE_KEYS,
    getStorageKey,
    type StorageKey,
} from '@/constants/storage-keys'

export interface StorageOptions<T> {
    /** 存储的 key */
    key: StorageKey
    /** 默认值 */
    defaultValue: T
    /** 自定义序列化函数 */
    serialize?: (value: T) => string
    /** 自定义反序列化函数 */
    deserialize?: (raw: string) => T
}

/**
 * 从 localStorage 加载数据
 */
export function loadFromStorage<T>(options: StorageOptions<T>): T {
    const { key, defaultValue, deserialize } = options
    const fullKey = getStorageKey(key)

    try {
        const raw = localStorage.getItem(fullKey)
        if (raw === null) {
            return defaultValue
        }

        if (deserialize) {
            return deserialize(raw)
        }

        return JSON.parse(raw) as T
    } catch (error) {
        console.error(`[Storage] Failed to load "${key}":`, error)
        return defaultValue
    }
}

/**
 * 保存数据到 localStorage
 */
export function saveToStorage<T>(
    options: Pick<StorageOptions<T>, 'key' | 'serialize'>,
    value: T
): boolean {
    const { key, serialize } = options
    const fullKey = getStorageKey(key)

    try {
        const raw = serialize ? serialize(value) : JSON.stringify(value)
        localStorage.setItem(fullKey, raw)
        return true
    } catch (error) {
        console.error(`[Storage] Failed to save "${key}":`, error)
        return false
    }
}

/**
 * 从 localStorage 删除数据
 */
export function removeFromStorage(key: StorageKey): boolean {
    const fullKey = getStorageKey(key)

    try {
        localStorage.removeItem(fullKey)
        return true
    } catch (error) {
        console.error(`[Storage] Failed to remove "${key}":`, error)
        return false
    }
}

/**
 * 检查 localStorage 中是否存在指定 key
 */
export function hasInStorage(key: StorageKey): boolean {
    const fullKey = getStorageKey(key)
    return localStorage.getItem(fullKey) !== null
}

/**
 * 清除所有带前缀的存储数据
 */
export function clearAllStorage(): boolean {
    try {
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(STORAGE_PREFIX)) {
                keysToRemove.push(key)
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        return true
    } catch (error) {
        console.error('[Storage] Failed to clear storage:', error)
        return false
    }
}

// ============================================
// Nudges 专用存储 API
// ============================================

import type { Nudge } from '@/types/nudge'

/**
 * 加载 Nudges 列表
 */
export function loadNudges(): Nudge[] {
    return loadFromStorage<Nudge[]>({
        key: STORAGE_KEYS.NUDGES,
        defaultValue: [],
    })
}

/**
 * 保存 Nudges 列表
 */
export function saveNudges(nudges: Nudge[]): boolean {
    return saveToStorage({ key: STORAGE_KEYS.NUDGES }, nudges)
}

/**
 * 清除 Nudges 数据
 */
export function clearNudges(): boolean {
    return removeFromStorage(STORAGE_KEYS.NUDGES)
}
