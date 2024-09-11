<template>
  <LoginForm />
</template>

<script>
export default {
  async asyncData({ $auth, redirect }) {
    if ($auth.loggedIn) {
      return redirect("/");
    }
  },
};
</script>

<style lang="scss" scoped></style>
