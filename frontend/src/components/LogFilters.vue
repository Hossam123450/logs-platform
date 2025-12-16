<template>
  <div class="log-filters">
    <label>
      Date de début :
      <input type="date" v-model="startDate" />
    </label>
    <label>
      Date de fin :
      <input type="date" v-model="endDate" />
    </label>
    <label>
      Niveau :
      <select v-model="level">
        <option value="">Tous</option>
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
        <option value="fatal">Fatal</option>
      </select>
    </label>
    <label>
      Environnement :
      <select v-model="env">
        <option value="">Tous</option>
        <option value="development">Dev</option>
        <option value="production">Prod</option>
      </select>
    </label>
    <label>
      Recherche :
      <input type="text" v-model="query" placeholder="Message, stack, meta..." />
    </label>
    <button @click="$emit('filter-changed', filters)">Filtrer</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  emits: ['filter-changed'],
  setup() {
    const startDate = ref('');
    const endDate = ref('');
    const level = ref('');
    const env = ref('');
    const query = ref('');

    const filters = computed(() => ({
      startDate: startDate.value,
      endDate: endDate.value,
      level: level.value,
      env: env.value,
      query: query.value
    }));

    return { startDate, endDate, level, env, query, filters };
  }
};
</script>

<style>
.log-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.log-filters label {
  display: flex;
  flex-direction: column;
}
</style>
