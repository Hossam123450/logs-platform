<template>
  <div class="grouped-errors">
    <h3>Erreurs Regroupées</h3>
    <table>
      <thead>
        <tr>
          <th>Message</th>
          <th>Occurrences</th>
          <th>Dernière Occurrence</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="error in groupedErrors" :key="error.id">
          <td>{{ error.message }}</td>
          <td>{{ error.count }}</td>
          <td>{{ error.lastOccurrence }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const groupedErrors = ref([]);

    // Fonction pour récupérer et regrouper les erreurs
    const fetchGroupedErrors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/logs/grouped-errors');
        groupedErrors.value = response.data;
      } catch (err) {
        console.error('Erreur de récupération des erreurs groupées:', err);
      }
    };

    onMounted(() => {
      fetchGroupedErrors();
    });

    return {
      groupedErrors
    };
  }
};
</script>

<style scoped>
.grouped-errors {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
}

th {
  background-color: #f4f4f4;
}
</style>
