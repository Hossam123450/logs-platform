<template>
  <div>
    <h2>Alertes</h2>
    <ul>
      <li v-for="alert in alerts" :key="alert.id">
        {{ alert.level }} - {{ alert.message }} ({{ alert.occurrences }})
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const alerts = ref([])

    const fetchAlerts = async () => {
      const res = await fetch('http://localhost:3000/alerts')
      alerts.value = await res.json()
    }

    onMounted(() => fetchAlerts())

    return { alerts }
  }
}
</script>
