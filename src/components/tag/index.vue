<script setup lang="ts">
type TagType = 'success' | 'warning' | 'error' | 'info'

interface Props {
    type?: TagType
    showDot?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'info',
    showDot: true,
})
</script>

<template>
    <div
        class="tag"
        :class="[`tag-${type}`]"
    >
        <span
            v-if="showDot"
            class="tag-dot"
        ></span>
        <slot />
    </div>
</template>

<style scoped lang="scss">
.tag {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-base);
    font-size: 14px;
}

.tag-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
}

.tag-success {
    background: var(--color-success-ghost);
    color: var(--color-success);

    .tag-dot {
        background: var(--color-success);
    }
}

.tag-warning {
    background: var(--color-warning-ghost);
    color: var(--color-warning);

    .tag-dot {
        background: var(--color-warning);
    }
}

.tag-error {
    background: var(--color-error-ghost);
    color: var(--color-error);

    .tag-dot {
        background: var(--color-error);
    }
}

.tag-info {
    background: var(--color-info-ghost);
    color: var(--color-info);

    .tag-dot {
        background: var(--color-info);
    }
}
</style>
