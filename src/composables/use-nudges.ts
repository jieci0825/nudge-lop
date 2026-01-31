import { ref, computed } from 'vue'
import type { Nudge } from '@/types/nudge'

const defaultNudges: Nudge[] = []

const nudges = ref<Nudge[]>(defaultNudges)

export type FilterType = 'all' | 'active' | 'paused'

export function useNudges() {
    const activeFilter = ref<FilterType>('all')

    const filteredNudges = computed(() => {
        switch (activeFilter.value) {
            case 'active':
                return nudges.value.filter(n => n.active)
            case 'paused':
                return nudges.value.filter(n => !n.active)
            default:
                return nudges.value
        }
    })

    function setNudges(list: Nudge[]) {
        nudges.value = list
    }

    function add(nudge: Omit<Nudge, 'id'>) {
        nudges.value.push({
            ...nudge,
            id: Date.now(),
        })
    }

    function remove(id: number) {
        const index = nudges.value.findIndex(n => n.id === id)
        if (index !== -1) {
            nudges.value.splice(index, 1)
        }
    }

    function toggle(id: number, active: boolean) {
        const nudge = nudges.value.find(n => n.id === id)
        if (nudge) {
            nudge.active = active
        }
    }

    function update(id: number, data: Partial<Omit<Nudge, 'id'>>) {
        const nudge = nudges.value.find(n => n.id === id)
        if (nudge) {
            Object.assign(nudge, data)
        }
    }

    return {
        nudges,
        activeFilter,
        filteredNudges,
        setNudges,
        add,
        remove,
        toggle,
        update,
    }
}
