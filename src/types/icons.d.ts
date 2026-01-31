import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        ILucidePlus: typeof import('~icons/lucide/plus')['default']
        ILucideSettings: typeof import('~icons/lucide/settings')['default']
        ILucideRefreshCw: typeof import('~icons/lucide/refresh-cw')['default']
        ILucideSun: typeof import('~icons/lucide/sun')['default']
        ILucideBolt: typeof import('~icons/lucide/bolt')['default']
    }
}
