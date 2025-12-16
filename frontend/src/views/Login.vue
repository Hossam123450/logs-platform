<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const login = async () => {
      error.value = '';
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: email.value,
          password: password.value
        });

        // Stocker le token JWT et rôle
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Redirection vers le dashboard
        router.push('/');
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur de connexion';
      }
    };

    return { email, password, login, error };
  }
};
</script>

<style>
.login-container {
  max-width: 400px;
  margin: 50px auto;
}
.error {
  color: red;
}
</style>
