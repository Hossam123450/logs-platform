<template>
  <div>
    <h2>Logs</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Message</th>
          <th>Route</th>
          <th>Service</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ log.timestamp }}</td>
          <td>{{ log.level }}</td>
          <td>{{ log.message }}</td>
          <td>{{ log.route }}</td>
          <td>{{ log.service }}</td>
          <td><button @click="showDetails(log)">Détails</button></td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedLog">
      <h3>Détails du log</h3>
      <pre>{{ selectedLog }}</pre>
      <button @click="selectedLog = null">Fermer</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const logs = ref([])
    const selectedLog = ref(null)

    const fetchLogs = async () => {
      const res = await fetch('http://localhost:3000/logs')
      logs.value = await res.json()
    }

    const showDetails = (log) => {
      selectedLog.value = log
    }

    onMounted(() => {
      fetchLogs()
    })

    return { logs, selectedLog, showDetails }
  }
}
</script>
