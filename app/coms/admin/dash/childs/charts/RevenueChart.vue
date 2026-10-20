<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Doanh thu (triệu VNĐ)',
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        }
    ]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    return `Doanh thu: ${context.raw} triệu VNĐ`
                }
            }
        }
    },
    scales: {
        y: {
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
            },
            border: {
                display: false
            }
        },
        x: {
            grid: {
                display: false
            },
            border: {
                display: false
            }
        }
    }
}
</script>

<template>
    <div style="height: 300px;">
        <Bar :data="data" :options="options" />
    </div>
</template>
