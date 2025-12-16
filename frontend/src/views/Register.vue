<template>
  <div class="register-container">
    <h2>Inscription</h2>
    <form @submit.prevent="register">
      <div>
        <label>Nom</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Rôle</label>
        <select v-model="role">
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">S’inscrire</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('viewer');
    const error = ref('');
    const success = ref('');

    const register = async () => {
      error.value = '';
      success.value = '';
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          role: role.value
        });

        success.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de l’inscription';
      }
    };

    return { name, email, password, role, register, error, success };
  }
};
</script>

<style>
.register-container {
  max-width: 400px;
  margin: 50px auto;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
