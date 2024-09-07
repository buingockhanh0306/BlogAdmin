<template>
  <div>
    <h1>Admin page</h1>
    <button @click="handleLogout">Logout</button>
    {{ result?.data }}
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      result: null,
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      this.result = await this.$axios.get("/users");
    },
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
