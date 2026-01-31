<script setup lang="ts">
import Button from '@/components/button/index.vue'
import IconButton from './icon-button.vue'

const emit = defineEmits<{
    addTask: []
}>()
</script>

<template>
    <header class="app-header">
        <div class="app-header__left">
            <img
                src="/logo.png"
                alt="NudgeLoop"
                class="app-header__logo"
            />
            <span class="app-header__title">NudgeLoop</span>
        </div>
        <div class="app-header__right">
            <Button
                type="primary"
                @click="emit('addTask')"
            >
                <i-lucide-plus
                    width="16"
                    height="16"
                />
                Add Task
            </Button>
            <IconButton>
                <i-lucide-settings
                    width="20"
                    height="20"
                />
            </IconButton>
        </div>
    </header>
</template>

<style scoped lang="scss">
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-base) var(--gap-lg);
    background: var(--bg-deep);
    border-bottom: 1px solid var(--border-default);
}

.app-header__left {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.app-header__logo {
    --size: 45px;
    width: var(--size);
    height: var(--size);
}

.app-header__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.app-header__right {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}
</style>
