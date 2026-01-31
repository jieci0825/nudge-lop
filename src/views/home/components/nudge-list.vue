<script setup lang="ts">
import { ref } from 'vue'
import { useNudges } from '@/composables/use-nudges'
import type { Nudge } from '@/types/nudge'
import FilterTabs from './filter-tabs.vue'
import NudgeCard from './nudge-card.vue'
import NudgeCreateCard from './nudge-create-card.vue'
import NudgeFormContainer from './nudge-form-container.vue'

const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'paused', label: 'Paused' },
]

const { filteredNudges, activeFilter, toggle } = useNudges()

const formVisible = ref(false)
const editingNudge = ref<Nudge | null>(null)

function openCreateForm() {
    editingNudge.value = null
    formVisible.value = true
}

function openEditForm(nudge: Nudge) {
    editingNudge.value = nudge
    formVisible.value = true
}

defineExpose({
    openCreateForm,
})
</script>

<template>
    <section class="nudge-list">
        <div class="nudge-list__header">
            <h1 class="nudge-list__title">让提醒成为一种节律</h1>
            <FilterTabs
                v-model="activeFilter"
                :tabs="filterTabs"
            />
        </div>
        <div class="nudge-list__grid">
            <NudgeCard
                v-for="nudge in filteredNudges"
                :key="nudge.id"
                :title="nudge.title"
                :description="nudge.description"
                :schedule="nudge.schedule"
                :schedule-config="nudge.scheduleConfig"
                :next-reminder="nudge.nextReminder"
                :active="nudge.active"
                :last-trigger-time="nudge.lastTriggerTime"
                @update:active="toggle(nudge.id, $event)"
                @edit="openEditForm(nudge)"
            />
            <NudgeCreateCard @click="openCreateForm" />
        </div>

        <NudgeFormContainer
            v-model:visible="formVisible"
            :edit-data="editingNudge"
        />
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

.nudge-list__title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.nudge-list__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--gap-md);
}
</style>
