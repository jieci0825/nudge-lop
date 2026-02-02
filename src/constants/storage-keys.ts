/**
 * 本地存储 key 常量管理
 * 统一管理所有 localStorage 使用的 key
 */

/** 存储 key 前缀 */
export const STORAGE_PREFIX = 'nudge_loop_'

/** 存储 key 枚举 */
export const STORAGE_KEYS = {
    /** Nudges 列表数据 */
    NUDGES: 'nudges',
    /** 应用设置 */
    SETTINGS: 'settings',
} as const

/** 存储 key 类型 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * 获取带前缀的完整存储 key
 */
export function getStorageKey(key: StorageKey): string {
    return `${STORAGE_PREFIX}${key}`
}
