<template>
  <div class="form">
    <h1>Signup</h1>
    <input v-model="data.username" type="text" placeholder="username" />
    <input v-model="data.password" type="text" placeholder="password" />
    <input v-model="data.displayName" type="text" placeholder="Display Name" />
    <div>
      <input type="radio" value="1" v-model="data.role" />Admin
      <input type="radio" value="0" v-model="data.role" />User
    </div>
    <button @click="handleSignup">Signup</button>

    <button @click="$router.push('/login')">Login</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        username: "",
        password: "",
        displayName: "",
        role: 0,
      },
    };
  },
  methods: {
    async handleSignup() {
      try {
        const res = await this.$axios.post("/users/create-user", this.data);
        console.log(res);
        if (res.data.status === "success") {
        }
      } catch (error) {
        console.log(error.response);
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
input[type="text"] {
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
