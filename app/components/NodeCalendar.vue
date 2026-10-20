<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    date?: string;
    showTwoDays?: boolean;
    date2?: string;
    calendarStyle?: string;
    textColor?: string;
    backgroundColor?: string;
    themeColor?: string;
    fontSize?: number;
    fontFamily?: string;
    opacity?: number;
}>();

const computedStyle = computed(() => props.calendarStyle || 'style1');

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const calendarData = computed(() => {
    // If date is not provided, use the first day of current month as fallback focus
    const now = new Date();
    let focusDate = new Date();

    if (props.date) {
        focusDate = new Date(props.date);
    } else {
        focusDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const year = focusDate.getFullYear();
    const month = focusDate.getMonth();

    // First day of this month
    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // 0 for Mon, 6 for Sun
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const lastDay = new Date(year, month + 1, 0).getDate();

    const selectedDays: number[] = [];
    if (props.date) {
        const d1 = new Date(props.date);
        if (d1.getMonth() === month && d1.getFullYear() === year) {
            selectedDays.push(d1.getDate());
        }
    }
    if (props.showTwoDays && props.date2) {
        const d2 = new Date(props.date2);
        if (d2.getMonth() === month && d2.getFullYear() === year) {
            selectedDays.push(d2.getDate());
        }
    }

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ day: '', id: `prev-${i}` });
    }
    for (let i = 1; i <= lastDay; i++) {
        days.push({ day: i, id: i, isSelected: selectedDays.includes(i) });
    }

    return {
        monthStr: `${month + 1}.${year}`,
        monthOnly: `${month + 1}`,
        yearStr: `${year}`,
        days
    };
});

// Converts a hex color to an rgba with opacity for watermark
const getWatermarkColor = (hexToRgba?: string) => {
    if (!hexToRgba || hexToRgba === 'transparent') return 'rgba(0,0,0,0.1)';
    let c = hexToRgba.replace('#', '');
    if (c.length === 3) {
        c = c.charAt(0) + c.charAt(0) + c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2);
    }
    if (c.length !== 6) return 'rgba(0,0,0,0.1)';
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
}

</script>

<template>
    <div class="calendar-wrapper" :style="{ opacity: opacity ?? 1 }">
        <div class="calendar-container" :class="`calendar-${computedStyle}`" :style="{
            backgroundColor: backgroundColor || '#ffffff',
            fontFamily: fontFamily || 'Roboto',
            fontSize: `${fontSize || 16}px`,
            borderColor: computedStyle === 'style3' ? (themeColor || '#d0021b') : 'transparent',
            borderWidth: computedStyle === 'style3' ? '2px' : '0px',
            borderStyle: 'solid'
        }">
            <!-- Spine rings for style3 -->
            <template v-if="computedStyle === 'style3'">
                <div class="spine-ring spine-ring-top" :style="{ backgroundColor: themeColor || '#d0021b' }"></div>
                <div class="spine-ring spine-ring-bottom" :style="{ backgroundColor: themeColor || '#d0021b' }"></div>
            </template>

            <!-- Header -->
            <div v-if="computedStyle === 'style2'" class="calendar-header-style2"
                :style="{ backgroundColor: themeColor || '#d0021b' }">
                <span class="month-year">{{ calendarData.monthStr }}</span>
            </div>

            <div v-if="computedStyle === 'style3'" class="calendar-header-style3">
                <span class="month-text" :style="{ color: themeColor || '#d0021b' }">{{ calendarData.monthOnly }}</span>
                <span class="year-text" :style="{ color: themeColor || '#d0021b' }">{{ calendarData.yearStr }}</span>
            </div>

            <!-- Body -->
            <div class="calendar-body"
                :class="{ 'pt-0': computedStyle === 'style1', 'style3-body': computedStyle === 'style3' }">
                <!-- Watermark -->
                <div v-if="computedStyle === 'style2'" class="watermark"
                    :style="{ color: getWatermarkColor(themeColor || '#d0021b') }">
                    {{ calendarData.yearStr }}
                </div>

                <!-- Days of Week -->
                <div v-if="computedStyle !== 'style1'" class="days-header"
                    :class="{ 'style3-days-header': computedStyle === 'style3' }">
                    <div v-if="computedStyle === 'style3'" class="days-bg-pill"
                        :style="{ backgroundColor: themeColor || '#d0021b', opacity: 0.4 }"></div>
                    <div v-for="day in daysOfWeek" :key="day" class="day-name"
                        :style="{ color: computedStyle === 'style3' ? '#000000' : (textColor || '#666') }">
                        {{ day }}
                    </div>
                </div>

                <!-- Dates Grid -->
                <div class="dates-grid" :style="{ marginTop: computedStyle === 'style1' ? '20px' : '0' }">
                    <div v-for="date in calendarData.days" :key="date.id" class="date-cell">
                        <div class="date-content"
                            :style="{ color: date.isSelected ? '#ffffff' : (textColor || '#666') }">
                            <span v-if="date.day">{{ date.day }}</span>
                            <!-- Heart Highlight -->
                            <div v-if="date.isSelected" class="heart-shape"
                                :style="{ backgroundColor: themeColor || '#d0021b' }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

.calendar-wrapper {
    display: block;
    width: 100%;
    height: 100%;
}

.calendar-container {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}

.calendar-style1 {
    box-shadow: none !important;
    background-color: transparent !important;
}

.calendar-style3 {
    overflow: visible !important;
    border-radius: 4px;
    box-shadow: none;
}

.calendar-style2 {
    overflow: hidden;
}

/* Spine Rings for Style 3 */
.spine-ring {
    position: absolute;
    left: -6px;
    width: 10px;
    height: 30px;
    border-radius: 10px;
    z-index: 5;
}

.spine-ring-top {
    top: 50px;
}

.spine-ring-bottom {
    bottom: 50px;
}

.calendar-header-style2 {
    color: white;
    padding: 10px 15px;
    font-size: 1.5em;
    font-weight: 500;
    text-align: center;
}

.calendar-header-style3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 5px 20px;
    font-size: 1.5em;
}

/* Style 3 header text elements */
.month-text,
.year-text {
    font-weight: normal;
}

.calendar-body {
    position: relative;
    padding: 15px 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.style3-body {
    padding-top: 5px;
}

.pt-0 {
    padding-top: 15px !important;
}

.watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5em;
    font-weight: bold;
    z-index: 0;
    pointer-events: none;
    line-height: 1;
}

.days-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
}

.style3-days-header {
    margin: 10px 5px 20px 5px;
    padding: 6px 0;
}

.days-bg-pill {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    z-index: 0;
}

.day-name {
    text-align: center;
    font-size: 0.85em;
    font-weight: 500;
    position: relative;
    z-index: 1;
}

.dates-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex-grow: 1;
    position: relative;
    z-index: 1;
}

.date-cell {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.date-content {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 40px;
    max-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    z-index: 2;
}

.date-content span {
    position: relative;
    z-index: 3;
}

.date-content.is-selected {
    font-weight: bold;
}

.heart-shape {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 110%;
    z-index: 1;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center / contain;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center / contain;
    opacity: 0.8;
}
</style>
