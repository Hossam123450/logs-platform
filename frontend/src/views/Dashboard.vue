<template>
  <div>
    <h1>Dashboard des Logs</h1>
    <LogFilters @filter-changed="applyFilters" />
    <LogTable :logs="filteredLogs" />
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import LogFilters from './LogFilters.vue';
import LogTable from './LogTable.vue';

export default {
  components: { LogFilters, LogTable },
  setup() {
    const logs = ref([]);
    const filteredLogs = ref([]);

    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/logs');
        logs.value = response.data;
        filteredLogs.value = logs.value;
      } catch (err) {
        console.error('Erreur récupération logs', err);
      }
    };

    const applyFilters = (filters) => {
      filteredLogs.value = logs.value.filter(log => {
        const dateCheck =
          (!filters.startDate || new Date(log.timestamp) >= new Date(filters.startDate)) &&
          (!filters.endDate || new Date(log.timestamp) <= new Date(filters.endDate));
        const levelCheck = !filters.level || log.level === filters.level;
        const envCheck = !filters.env || log.env === filters.env;
        const queryCheck =
          !filters.query ||
          log.message.toLowerCase().includes(filters.query.toLowerCase()) ||
          (log.meta && JSON.stringify(log.meta).toLowerCase().includes(filters.query.toLowerCase()));

        return dateCheck && levelCheck && envCheck && queryCheck;
      });
    };

    fetchLogs();

    return { filteredLogs, applyFilters };
  }
};
</script>
