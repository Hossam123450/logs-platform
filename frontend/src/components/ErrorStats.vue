<template>
  <div class="error-stats">
    <h3>Statistiques des Erreurs</h3>
    <div class="charts">
      <div class="chart">
        <h4>Top 5 des erreurs</h4>
        <BarChart :data="topErrorsData" />
      </div>
      <div class="chart">
        <h4>Évolution des erreurs (24h)</h4>
        <LineChart :data="errorEvolutionData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';

export default {
  components: { BarChart, LineChart },
  setup() {
    const topErrorsData = ref([]);
    const errorEvolutionData = ref([]);

    const fetchErrorStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/logs/stats');
        topErrorsData.value = response.data.topErrors;
        errorEvolutionData.value = response.data.errorEvolution;
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques des erreurs:', err);
      }
    };

    onMounted(() => {
      fetchErrorStats();
    });

    return { topErrorsData, errorEvolutionData };
  }
};
</script>

<style scoped>
.error-stats {
  margin-top: 20px;
}

.charts {
  display: flex;
  gap: 20px;
}

.chart {
  width: 48%;
}
</style>
