<template>
  <div>
    <h2>Logs</h2>

    <Filters @change="applyFilters" />

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Niveau</th>
          <th>Message</th>
          <th>Route</th>
          <th>Service</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ log.timestamp }}</td>
          <td>{{ log.level }}</td>
          <td>{{ log.message }}</td>
          <td>{{ log.route }}</td>
          <td>{{ log.service }}</td>
          <td>
            <button @click="selectedLog = log">Détails</button>
          </td>
        </tr>
      </tbody>
    </table>

    <pre v-if="selectedLog">{{ selectedLog }}</pre>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Filters from '@/components/Filters.vue'

export default {
  components: { Filters },
  setup() {
    const logs = ref([])
    const selectedLog = ref(null)

    const fetchLogs = async (filters = {}) => {
      const query = new URLSearchParams(filters).toString()
      const res = await fetch(`http://localhost:3000/logs?${query}`)
      logs.value = await res.json()
    }

    const applyFilters = (filters) => {
      fetchLogs(filters)
    }

    onMounted(() => fetchLogs())

    return { logs, selectedLog, applyFilters }
  }
}
</script>
