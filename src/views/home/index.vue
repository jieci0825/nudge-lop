<script setup lang="ts">
import AppHeader from './components/app-header.vue'
import NudgeList from './components/nudge-list.vue'
</script>

<template>
    <div class="home">
        <AppHeader />
        <main class="home__main">
            <NudgeList />
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
