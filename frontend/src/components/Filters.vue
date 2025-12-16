<template>
  <div class="filters">
    <input
      type="text"
      placeholder="Recherche (message, service...)"
      v-model="filters.search"
      @input="emitFilters"
    />

    <select v-model="filters.level" @change="emitFilters">
      <option value="">Tous les niveaux</option>
      <option value="debug">Debug</option>
      <option value="info">Info</option>
      <option value="warn">Warn</option>
      <option value="error">Error</option>
      <option value="fatal">Fatal</option>
    </select>

    <select v-model="filters.env" @change="emitFilters">
      <option value="">Tous les environnements</option>
      <option value="development">Development</option>
      <option value="staging">Staging</option>
      <option value="production">Production</option>
    </select>

    <input
      type="date"
      v-model="filters.from"
      @change="emitFilters"
    />

    <input
      type="date"
      v-model="filters.to"
      @change="emitFilters"
    />
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'Filters',
  emits: ['change'],
  setup(props, { emit }) {
    const filters = reactive({
      search: '',
      level: '',
      env: '',
      from: '',
      to: ''
    })

    const emitFilters = () => {
      emit('change', { ...filters })
    }

    return { filters, emitFilters }
  }
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

input, select {
  padding: 6px;
}
</style>
