<template>
  <div>
    <h1>Admin page</h1>
    <button @click="handleLogout">Logout</button>
    {{ $auth.user }}
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
  mounted() {},
  methods: {
    async handleLogout() {
      await this.$auth.logout();
      this.$auth.reset();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
