<script setup lang="ts">
import type { ScheduleMode } from '@/types/nudge'
import AppButton from '@/components/button/index.vue'

interface Props {
    visible: boolean
    mode: 'add' | 'edit'
    title: string
    description: string
    scheduleMode: ScheduleMode
    intervalMinutes: number
    selectedDays: number[]
    times: string[]
    minuteOfHour: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'update:title': [value: string]
    'update:description': [value: string]
    'update:scheduleMode': [value: ScheduleMode]
    'update:intervalMinutes': [value: number]
    'update:selectedDays': [value: number[]]
    'update:times': [value: string[]]
    'update:minuteOfHour': [value: number]
    'submit': []
    'cancel': []
}>()

const scheduleModes: {
    value: ScheduleMode
    label: string
    desc: string
}[] = [
    {
        value: 'interval',
        label: '间隔循环',
        desc: '每隔固定时间提醒',
    },
    {
        value: 'fixed',
        label: '固定时间',
        desc: '每天的特定时间点',
    },
    {
        value: 'hourly',
        label: '整点提醒',
        desc: '每小时的第几分钟',
    },
]

const weekDays = [
    { value: 1, label: '一' },
    { value: 2, label: '二' },
    { value: 3, label: '三' },
    { value: 4, label: '四' },
    { value: 5, label: '五' },
    { value: 6, label: '六' },
    { value: 0, label: '日' },
]

function handleClose() {
    emit('update:visible', false)
    emit('cancel')
}

function handleSubmit() {
    emit('submit')
}

function toggleDay(day: number, selectedDays: number[]) {
    const newDays = selectedDays.includes(day)
        ? selectedDays.filter(d => d !== day)
        : [...selectedDays, day]
    emit('update:selectedDays', newDays)
}

function updateInterval(delta: number, current: number) {
    const newValue = Math.max(5, Math.min(120, current + delta))
    emit('update:intervalMinutes', newValue)
}

function updateMinuteOfHour(delta: number, current: number) {
    const newValue = Math.max(0, Math.min(59, current + delta))
    emit('update:minuteOfHour', newValue)
}

function handleMinuteInput(event: Event) {
    const input = event.target as HTMLInputElement
    const value = parseInt(input.value, 10)
    if (!isNaN(value)) {
        const clampedValue = Math.max(0, Math.min(59, value))
        emit('update:minuteOfHour', clampedValue)
    }
}

function addTime(times: string[]) {
    if (props.scheduleMode === 'fixed') {
        const now = new Date()
        const h = String(now.getHours()).padStart(2, '0')
        const m = String(now.getMinutes()).padStart(2, '0')
        emit('update:times', [...times, `${h}:${m}`])
    } else {
        emit('update:times', [...times, '09:00'])
    }
}

function removeTime(index: number, times: string[]) {
    const newTimes = times.filter((_, i) => i !== index)
    emit('update:times', newTimes)
}

function updateTime(index: number, value: string, times: string[]) {
    const newTimes = [...times]
    newTimes[index] = value
    emit('update:times', newTimes)
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="visible"
                class="modal-overlay"
                @click.self="handleClose"
            >
                <div class="modal">
                    <header class="modal__header">
                        <h2 class="modal__title">
                            {{ mode === 'add' ? '新增提醒' : '编辑提醒' }}
                        </h2>
                        <button
                            class="modal__close"
                            @click="handleClose"
                        >
                            <i-lucide-x
                                width="20"
                                height="20"
                            />
                        </button>
                    </header>

                    <div class="modal__body">
                        <!-- 标题 -->
                        <div class="form-field">
                            <label class="form-field__label">提醒标题</label>
                            <input
                                class="form-field__input"
                                type="text"
                                placeholder="例如：站起来走走"
                                :value="title"
                                @input="
                                    emit(
                                        'update:title',
                                        ($event.target as HTMLInputElement)
                                            .value
                                    )
                                "
                            />
                        </div>

                        <!-- 描述 -->
                        <div class="form-field">
                            <label class="form-field__label"
                                >提醒内容（可选）</label
                            >
                            <textarea
                                class="form-field__textarea"
                                placeholder="详细的提醒内容..."
                                rows="3"
                                :value="description"
                                @input="
                                    emit(
                                        'update:description',
                                        ($event.target as HTMLTextAreaElement)
                                            .value
                                    )
                                "
                            />
                        </div>

                        <!-- 调度设置 -->
                        <div class="schedule-section">
                            <h3 class="schedule-section__title">调度设置</h3>

                            <!-- 提醒模式 -->
                            <div class="form-field">
                                <label class="form-field__label"
                                    >提醒模式</label
                                >
                                <div class="mode-selector">
                                    <button
                                        v-for="m in scheduleModes"
                                        :key="m.value"
                                        class="mode-btn"
                                        :class="{
                                            'mode-btn--active':
                                                scheduleMode === m.value,
                                        }"
                                        @click="
                                            emit('update:scheduleMode', m.value)
                                        "
                                    >
                                        <i-lucide-refresh-cw
                                            v-if="m.value === 'interval'"
                                            width="20"
                                            height="20"
                                        />
                                        <i-lucide-clock
                                            v-else-if="m.value === 'fixed'"
                                            width="20"
                                            height="20"
                                        />
                                        <i-lucide-calendar
                                            v-else
                                            width="20"
                                            height="20"
                                        />
                                        <span>{{ m.label }}</span>
                                    </button>
                                </div>
                                <p class="form-field__hint">
                                    {{
                                        scheduleModes.find(
                                            m => m.value === scheduleMode
                                        )?.desc
                                    }}
                                </p>
                            </div>

                            <!-- 间隔循环设置 -->
                            <template v-if="scheduleMode === 'interval'">
                                <div class="form-field">
                                    <label class="form-field__label"
                                        >提醒间隔</label
                                    >
                                    <div class="number-stepper">
                                        <button
                                            class="number-stepper__btn"
                                            @click="
                                                updateInterval(
                                                    -5,
                                                    intervalMinutes
                                                )
                                            "
                                        >
                                            <i-lucide-minus
                                                width="20"
                                                height="20"
                                            />
                                        </button>
                                        <div class="number-stepper__value">
                                            <span
                                                class="number-stepper__number"
                                                >{{ intervalMinutes }}</span
                                            >
                                            <span class="number-stepper__unit"
                                                >分钟</span
                                            >
                                        </div>
                                        <button
                                            class="number-stepper__btn"
                                            @click="
                                                updateInterval(
                                                    5,
                                                    intervalMinutes
                                                )
                                            "
                                        >
                                            <i-lucide-plus
                                                width="20"
                                                height="20"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </template>

                            <!-- 固定时间设置 -->
                            <template v-if="scheduleMode === 'fixed'">
                                <div class="form-field">
                                    <label class="form-field__label"
                                        >选择日期</label
                                    >
                                    <div class="day-selector">
                                        <button
                                            v-for="day in weekDays"
                                            :key="day.value"
                                            class="day-btn"
                                            :class="{
                                                'day-btn--active':
                                                    selectedDays.includes(
                                                        day.value
                                                    ),
                                            }"
                                            @click="
                                                toggleDay(
                                                    day.value,
                                                    selectedDays
                                                )
                                            "
                                        >
                                            {{ day.label }}
                                        </button>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <div class="form-field__header">
                                        <label class="form-field__label"
                                            >时间点</label
                                        >
                                        <button
                                            class="add-time-btn"
                                            @click="addTime(times)"
                                        >
                                            + 添加时间
                                        </button>
                                    </div>
                                    <div class="time-list">
                                        <div
                                            v-for="(time, index) in times"
                                            :key="index"
                                            class="time-item"
                                        >
                                            <input
                                                type="time"
                                                class="time-item__input"
                                                :value="time"
                                                @input="
                                                    updateTime(
                                                        index,
                                                        (
                                                            $event.target as HTMLInputElement
                                                        ).value,
                                                        times
                                                    )
                                                "
                                            />
                                            <button
                                                class="time-item__remove"
                                                @click="
                                                    removeTime(index, times)
                                                "
                                            >
                                                <i-lucide-x
                                                    width="16"
                                                    height="16"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- 整点提醒设置 -->
                            <template v-if="scheduleMode === 'hourly'">
                                <div class="form-field">
                                    <label class="form-field__label"
                                        >选择日期</label
                                    >
                                    <div class="day-selector">
                                        <button
                                            v-for="day in weekDays"
                                            :key="day.value"
                                            class="day-btn"
                                            :class="{
                                                'day-btn--active':
                                                    selectedDays.includes(
                                                        day.value
                                                    ),
                                            }"
                                            @click="
                                                toggleDay(
                                                    day.value,
                                                    selectedDays
                                                )
                                            "
                                        >
                                            {{ day.label }}
                                        </button>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <label class="form-field__label"
                                        >每小时的第几分钟</label
                                    >
                                    <div class="number-stepper">
                                        <button
                                            class="number-stepper__btn"
                                            @click="
                                                updateMinuteOfHour(
                                                    -1,
                                                    minuteOfHour
                                                )
                                            "
                                        >
                                            <i-lucide-minus
                                                width="20"
                                                height="20"
                                            />
                                        </button>
                                        <div class="number-stepper__value">
                                            <input
                                                type="number"
                                                class="number-stepper__input"
                                                :value="minuteOfHour"
                                                min="0"
                                                max="59"
                                                @input="handleMinuteInput"
                                                @blur="handleMinuteInput"
                                            />
                                            <span class="number-stepper__unit"
                                                >分</span
                                            >
                                        </div>
                                        <button
                                            class="number-stepper__btn"
                                            @click="
                                                updateMinuteOfHour(
                                                    1,
                                                    minuteOfHour
                                                )
                                            "
                                        >
                                            <i-lucide-plus
                                                width="20"
                                                height="20"
                                            />
                                        </button>
                                    </div>
                                    <p class="form-field__hint">
                                        将在每小时的第
                                        {{ minuteOfHour }} 分钟提醒
                                    </p>
                                </div>
                            </template>
                        </div>
                    </div>

                    <footer class="modal__footer">
                        <button
                            class="modal__cancel-btn"
                            @click="handleClose"
                        >
                            取消
                        </button>
                        <AppButton
                            type="primary"
                            @click="handleSubmit"
                        >
                            {{ mode === 'add' ? '添加' : '保存' }}
                        </AppButton>
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--gap-md);
}

.modal {
    background: var(--bg-elevated);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
}

.modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-md);
    border-bottom: 1px solid var(--border-default);
}

.modal__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.modal__close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);

    &:hover {
        background: var(--bg-surface);
        color: var(--text-primary);
    }
}

.modal__body {
    flex: 1;
    overflow-y: auto;
    padding: var(--gap-md);
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.modal__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    border-top: 1px solid var(--border-default);
}

.modal__cancel-btn {
    padding: var(--gap-sm) var(--gap-md);
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: var(--radius-base);
    transition: all var(--transition-fast);

    &:hover {
        color: var(--text-primary);
        background: var(--bg-surface);
    }
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.form-field__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.form-field__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.form-field__hint {
    font-size: 13px;
    color: var(--text-tertiary);
}

.form-field__input,
.form-field__textarea {
    background: var(--bg-base);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: var(--gap-sm) var(--gap-base);
    color: var(--text-primary);
    font-size: 14px;
    transition: border-color var(--transition-fast);

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:focus {
        outline: none;
        border-color: var(--border-focus);
    }
}

.form-field__textarea {
    resize: vertical;
    min-height: 80px;
}

.schedule-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.schedule-section__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.mode-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-sm);
}

.mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--gap-base);
    background: transparent;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
        border-color: var(--border-hover);
        color: var(--text-primary);
    }

    &--active {
        border-color: var(--color-primary);
        background: var(--color-primary-ghost);
        color: var(--color-primary);
    }

    span {
        font-size: 13px;
    }
}

.day-selector {
    display: flex;
    gap: var(--gap-xs);
}

.day-btn {
    flex: 1;
    padding: var(--gap-sm);
    background: var(--bg-base);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
        transform: scale(1.05);
    }

    &--active {
        border-color: var(--color-primary);
        background: var(--color-primary);
        color: var(--text-inverse);
    }
}

.number-stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-lg);
    background: var(--bg-base);
    border-radius: var(--radius-lg);
    padding: var(--gap-md);
}

.number-stepper__btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color var(--transition-fast);

    &:hover {
        color: var(--text-primary);
    }
}

.number-stepper__value {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
}

.number-stepper__input {
    width: 80px;
    font-size: 48px;
    font-weight: 600;
    color: var(--color-primary);
    background: transparent;
    border: none;
    text-align: center;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }

    &:focus {
        outline: none;
    }
}

.number-stepper__unit {
    font-size: 18px;
    color: var(--text-secondary);
}

.add-time-btn {
    background: transparent;
    border: none;
    color: var(--color-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);

    &:hover {
        opacity: 0.8;
    }
}

.time-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.time-item {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.time-item__input {
    flex: 1;
    background: var(--bg-base);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: var(--gap-sm) var(--gap-base);
    color: var(--text-primary);
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: var(--border-focus);
    }

    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
}

.time-item__remove {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);

    &:hover {
        background: var(--color-error-ghost);
        color: var(--color-error);
    }
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
    transition: opacity var(--transition-base);

    .modal {
        transition: transform var(--transition-base);
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .modal {
        transform: scale(0.95) translateY(10px);
    }
}
</style>
