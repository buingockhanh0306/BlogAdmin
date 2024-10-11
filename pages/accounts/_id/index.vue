<template>
  <UserDetail />
</template>

<script>
export default {
  name: "UserDetailPage",
  middleware: "auth",
};
</script>

<style lang="scss" scoped></style>
