<script setup lang="ts"></script>

<template>
    <button class="nudge-create-card">
        <div class="nudge-create-card__icon">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />
            </svg>
        </div>
        <span class="nudge-create-card__text">Create Custom Nudge</span>
    </button>
</template>

<style scoped lang="scss">
.nudge-create-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-base);
    min-height: 180px;
    background: transparent;
    border: 2px dashed var(--border-default);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
        border-color: var(--color-primary);
        background: var(--color-primary-ghost);

        .nudge-create-card__icon {
            background: var(--color-primary);
            color: var(--text-inverse);
        }

        .nudge-create-card__text {
            color: var(--color-primary);
        }
    }
}

.nudge-create-card__icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background: var(--bg-surface);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.nudge-create-card__text {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: color var(--transition-fast);
}
</style>
