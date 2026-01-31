<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/app-header.vue'
import NudgeList from './components/nudge-list.vue'

const nudgeListRef = ref<InstanceType<typeof NudgeList> | null>(null)

function handleAddTask() {
    nudgeListRef.value?.openCreateForm()
}
</script>

<template>
    <div class="home">
        <AppHeader @add-task="handleAddTask" />
        <main class="home__main">
            <NudgeList ref="nudgeListRef" />
        </main>
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
