<template>
  <div class="form">
    <h1>Login</h1>
    <input v-model="data.email" type="text" placeholder="email" />
    <input v-model="data.password" type="text" placeholder="password" />
    <button @click="handleLogin">Login</button>
    <button @click="$router.push('/signup')">Signup</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      const result = await this.$axios.post("/login", this.data);
      const token = result.data.token;
      if (token) {
        localStorage.setItem("token", result.data.token);
        this.$router.push("/admin");
      }
    },
  },
};
</script>

<style>
.form {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4;
}
input {
  width: 400px;
  height: 30px;
  border: 1px solid cadetblue;
  margin: 10px;
}
button {
  padding: 10px 20px;
  color: #fff;
  background: green;
  cursor: pointer;
  margin: 10px;
}
</style>
