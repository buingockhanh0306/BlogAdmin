<template>
  <LoginForm />
</template>

<script>
export default {
  layout: 'authLayout',
  async asyncData({ $auth, redirect }) {
    if ($auth.loggedIn) {
      return redirect("/");
    }
  },
};
</script>

<style lang="scss" scoped></style>
