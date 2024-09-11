<template>
  <a-modal
    v-model="isShow"
    title="Thay đổi ảnh đại diện"
    ok-text="Xác nhận"
    cancel-text="Huỷ"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-form-model ref="ruleForm" :model="form">
      <div class="upload-form">
        <a-avatar
          :size="128"
          style="color: #f56a00; background-color: #fde3cf; font-size: 52px"
        >
          {{ textAvatar }}
        </a-avatar>
        <!-- <a-avatar
                  :size="128"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                /> -->

        <div class="under-avatar">
          <a-button
            class="text-red"
            type="link"
            @click="isShowModalChangeAvatar = true"
          >
            Xoá ảnh
          </a-button>
          <a-button type="link" @click="$refs.fileInput.click()">
            Tải ảnh lên
          </a-button>
        </div>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          style="display: none"
        />
      </div>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "ModalChangeAvatar",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        image: "",
      },
    };
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
    textAvatar() {
      const lastName = this.$auth.$state.user.displayName.split(" ");
      return lastName.pop()[0];
    },
  },
  methods: {
    handleOk() {},
    cancel() {
      this.$emit("handleCancel");
    },
    handleFileUpload() {},
  },
};
</script>

<style lang="scss" scoped>
.upload-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .under-avatar {
    margin: 20px;
    .text-red {
      color: red;
    }
  }
}
</style>
