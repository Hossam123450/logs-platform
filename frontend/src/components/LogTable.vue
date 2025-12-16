<template>
  <div>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('timestamp')">Timestamp</th>
          <th @click="sortBy('level')">Level</th>
          <th>Message</th>
          <th>Env</th>
          <th>Route</th>
          <th>Status</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in paginatedLogs" :key="log.id">
          <td>{{ log.timestamp }}</td>
          <td>{{ log.level }}</td>
          <td>{{ log.message }}</td>
          <td>{{ log.env }}</td>
          <td>{{ log.route || '-' }}</td>
          <td>{{ log.statusCode || '-' }}</td>
          <td>{{ log.userId || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination simple -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    logs: { type: Array, required: true },
    perPage: { type: Number, default: 10 }
  },
  setup(props) {
    const currentPage = ref(1);
    const sortKey = ref('timestamp');
    const sortAsc = ref(false);

    const sortedLogs = computed(() => {
      return [...props.logs].sort((a, b) => {
        if (sortKey.value === 'timestamp') {
          return sortAsc.value
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
        }
        if (sortKey.value === 'level') {
          const order = ['debug', 'info', 'warn', 'error', 'fatal'];
          return sortAsc.value
            ? order.indexOf(a.level) - order.indexOf(b.level)
            : order.indexOf(b.level) - order.indexOf(a.level);
        }
        return 0;
      });
    });

    const totalPages = computed(() =>
      Math.ceil(sortedLogs.value.length / props.perPage)
    );

    const paginatedLogs = computed(() => {
      const start = (currentPage.value - 1) * props.perPage;
      return sortedLogs.value.slice(start, start + props.perPage);
    });

    const sortBy = (key) => {
      if (sortKey.value === key) sortAsc.value = !sortAsc.value;
      else {
        sortKey.value = key;
        sortAsc.value = true;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    watch(props.logs, () => {
      currentPage.value = 1;
    });

    return { paginatedLogs, currentPage, totalPages, sortBy, prevPage, nextPage };
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  cursor: pointer;
  background-color: #f0f0f0;
}
th, td {
  border: 1px solid #ccc;
  padding: 5px 10px;
}
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
