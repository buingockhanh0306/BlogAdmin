<template>
  <UserDetail />
</template>

<script>
export default {
  name: "UserDetailPage",
  layout: "adminLayout",
  middleware: "auth",
};
</script>

<style lang="scss" scoped></style>
