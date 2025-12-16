<template>
  <div class="stats">
    <div class="chart">
      <h3>Évolution des logs</h3>
      <canvas ref="timelineChart"></canvas>
    </div>

    <div class="chart">
      <h3>Top erreurs</h3>
      <canvas ref="errorsChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
)

export default {
  name: 'StatsCharts',
  setup() {
    const timelineChart = ref(null)
    const errorsChart = ref(null)

    const fetchStats = async () => {
      const res = await fetch('http://localhost:3000/stats')
      return res.json()
    }

    const renderCharts = (stats) => {
      // 📈 Timeline
      new Chart(timelineChart.value, {
        type: 'line',
        data: {
          labels: stats.timeline.map(i => i.date),
          datasets: [{
            label: 'Logs',
            data: stats.timeline.map(i => i.count),
            borderColor: '#42a5f5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            tension: 0.3
          }]
        }
      })

      // 🧨 Top erreurs
      new Chart(errorsChart.value, {
        type: 'bar',
        data: {
          labels: stats.topErrors.map(e => e.message),
          datasets: [{
            label: 'Occurrences',
            data: stats.topErrors.map(e => e.count),
            backgroundColor: '#ef5350'
          }]
        },
        options: {
          indexAxis: 'y'
        }
      })
    }

    onMounted(async () => {
      const stats = await fetchStats()
      renderCharts(stats)
    })

    return { timelineChart, errorsChart }
  }
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}
</style>
