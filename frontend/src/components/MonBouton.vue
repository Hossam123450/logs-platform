<template>
  <button @click="handleClick">Cliquez-moi</button>
</template>

<script>
export default {
  name: 'MonBouton',
  setup(_, { inject }) {
    // Récupère le logger fourni globalement dans main.js
    const logger = inject('logger')

    const handleClick = () => {
      // Envoi manuel d’un log
      logger.info('Bouton cliqué', { 
        event: 'CLICK_BUTTON', 
        route: window.location.pathname 
      })
    }

    return { handleClick }
  }
}
</script>
