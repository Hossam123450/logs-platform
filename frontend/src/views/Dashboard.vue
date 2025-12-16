<template>
  <div>
    <h1>Dashboard des Logs</h1>
    <LogFilters @filter-changed="applyFilters" />
    <LogTable :logs="filteredLogs" />
    <button @click="sendTestLog">Envoyer log test</button>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import axios from 'axios';
import LogFilters from '../components/LogFilters.vue';
import LogTable from '../components/LogTable.vue';

export default {
  components: { LogFilters, LogTable },
  setup() {
    const logs = ref([]);
    const filteredLogs = ref([]);

    // Injection correcte du logger
    const logger = inject('logger');

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

    // Fonction pour envoyer un log test
    const sendTestLog = () => {
      if (logger) {
        logger.error('Log test depuis frontend', { route: '/dashboard', meta: { test: true } });
      } else {
        console.warn('Logger non injecté !');
      }
    };

    fetchLogs();

    return { filteredLogs, applyFilters, sendTestLog };
  }
};
</script>
