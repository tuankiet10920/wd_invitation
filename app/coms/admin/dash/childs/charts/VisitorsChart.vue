<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Người truy cập',
            backgroundColor: 'rgba(16, 185, 129, 0.1)', // Success color subtle
            borderColor: '#10b981', // Success color
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#10b981',
            fill: true,
            tension: 0.4, // Smooth curve
            data: [65, 59, 80, 81, 56, 55, 40, 70, 90, 100, 85, 95]
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
            backgroundColor: '#fff',
            titleColor: '#1e293b',
            bodyColor: '#1e293b',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
                label: (context: any) => {
                    return `Lượt truy cập: ${context.raw}`
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
            },
            beginAtZero: true
        },
        x: {
            grid: {
                display: false
            },
            border: {
                display: false
            }
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    }
}
</script>

<template>
    <div style="height: 300px;">
        <Line :data="data" :options="options as any" />
    </div>
</template>
