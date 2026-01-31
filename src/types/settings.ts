export interface AppSettings {
    /** 是否开机自启 */
    autoStart: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
    autoStart: false,
}
