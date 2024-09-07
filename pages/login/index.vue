<template>
  <LoginForm />
</template>

<script>
import LoginForm from "~/components/LoginForm";
export default {
  components: [LoginForm],
  async asyncData({ $auth, redirect }) {
    if ($auth.loggedIn) {
      return redirect("/admin");
    }
  },
};
</script>

<style lang="scss" scoped></style>
