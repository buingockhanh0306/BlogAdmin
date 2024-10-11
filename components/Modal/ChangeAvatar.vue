<template>
  <a-modal
    v-model="isShow"
    title="Thay đổi ảnh đại diện"
    ok-text="Xác nhận"
    cancel-text="Huỷ"
    @ok="handleOk"
    @cancel="cancel"
    class="modal-avatar"
  >
    <a-form-model ref="ruleForm" :value="imageData">
      <div class="upload-form">
        <div class="layout-cropper">
          <vue-cropper
            ref="cropper"
            v-if="imageData"
            :autoCrop="true"
            :guides="false"
            :center="true"
            :cropBoxResizable="false"
            :aspect-ratio="1"
            :src="imageData"
            :drag-mode="'move'"
            :viewMode="1"
            @ready="onCropperReady"
            alt="Source Image"
          >
          </vue-cropper>
          <div
            v-else
            :class="{ 'no-img': true, 'border-error-file': messageError }"
            :draggable="true"
            @click="$refs.fileInput.click()"
            @dragover.prevent
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileUpload($event, true)"
            @dragenter.prevent="isDragging = true"
          >
            <a-icon
              :class="{ 'icon-upload': true, 'text-red': messageError }"
              type="inbox"
            />
            <p class="text">
              Nhấp chuột hoặc kéo tập tin vào khu vực này để tải lên
            </p>
          </div>
        </div>
        <div
          v-if="messageError || fileName"
          :class="{
            'error-message': true,
            'text-red': messageError,
            'text-blue': fileName && !messageError,
          }"
        >
          <a-icon
            :type="
              messageError ? 'exclamation-circle' : fileName ? 'paper-clip' : ''
            "
          />
          <span class="text-message">{{ messageError || fileName }}</span>
        </div>
        <div class="under-avatar">
          <a-button
            type="link"
            :class="imageData ? 'text-disable' : 'text-blue'"
            @click="$refs.fileInput.click()"
          >
            Tải ảnh lên
          </a-button>
          <a-button
            :class="imageData ? 'text-red' : 'text-disable'"
            type="link"
            @click="handleDeleteImage"
          >
            Xoá ảnh
          </a-button>
        </div>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload($event, false)"
          style="display: none"
        />
      </div>
    </a-form-model>
  </a-modal>
</template>

<script>
import VueCropper from "vue-cropperjs";
import { mapActions } from "vuex";
import "cropperjs/dist/cropper.css";
export default {
  name: "ModalChangeAvatar",
  components: { VueCropper },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      urlImage: process.env.urlImage,
      imageData: "",
      isDragging: false,
      messageError: "",
      fileName: "",
      payloadData: null,
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
      const lastName = this.$auth.$state.user?.displayName?.split(" ");
      return lastName?.pop()[0];
    },
  },
  mounted() {
    this.imageData = this.$auth.$state.user?.avatar
      ? `${this.urlImage}/${this.$auth.$state.user?.avatar}`
      : "";
  },
  methods: {
    ...mapActions("users", ["uploadAvatar", "deleteAvatar"]),
    cancel() {
      this.messageError = "";
      this.$refs.fileInput.value = null;
      this.$emit("handleCancel");
    },
    async handleDeleteImage() {
      const res = await this.deleteAvatar(this.$route.params.id);
      if (res.status === "success") {
        this.imageData = "";
        this.fileName = "";
        await this.$auth.fetchUser();
        this.$notification["success"]({
          message: "Thông báo",
          description: "Đã xoá ảnh đại diện.",
        });
      }
    },
    disableCropResize(event) {
      if (event.action === "crop") {
        event.preventDefault();
      }
    },
    onCropperReady() {
      this.setCropBoxToCenter();
      this.roundCropBoxEdges();
    },
    setCropBoxToCenter() {
      const cropperInstance = this.$refs.cropper;
      const element = document.querySelector(".layout-cropper");
      const styles = window.getComputedStyle(element);
      const cropBoxSize = { width: 250, height: 250 };
      cropperInstance.setCropBoxData({
        left: (parseInt(styles.width) - cropBoxSize.width) / 2,
        top: (parseInt(styles.height) - cropBoxSize.height) / 2,
        width: cropBoxSize.width,
        height: cropBoxSize.height,
      });
    },
    roundCropBoxEdges() {
      const viewBox = document.querySelector(".cropper-view-box");
      const cropperFace = document.querySelector(".cropper-face");
      if (viewBox) {
        viewBox.style.borderRadius = "50%";
      }
      if (cropperFace) {
        cropperFace.style.borderRadius = "50%";
      }
    },
    handleFileUpload(e, isDrag) {
      this.isDragging = false;
      const file = isDrag ? e.dataTransfer.files[0] : e.target.files[0];
      this.fileName = file.name;
      if (file.type.indexOf("image/") === -1) {
        this.messageError = "Sai định dạng file tải lên.";
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
          this.messageError = "";
        };
        reader.readAsDataURL(file);
        this.$refs.fileInput.value = null;
      }
    },
    async handleOk() {
      if (this.$refs.cropper) {
        await this.$refs.cropper.getCroppedCanvas().toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("image", blob, this.fileName);
          const res = await this.uploadAvatar({
            id: this.$route.params.id,
            formData,
          });
          if (res.status === "success") {
            await this.$auth.fetchUser();
            this.$notification["success"]({
              message: "Thông báo",
              description: "Cập nhật ảnh đại diện thành công!",
            });
          }
        }, "image/jpeg");
      }
      this.cancel();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/variables";
.upload-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  .error-message {
    margin-top: 8px;
    align-self: flex-start;
    .text-message {
      margin-left: 4px;
    }
  }
  .under-avatar {
    margin: 20px;
  }
}
.layout-cropper {
  height: 300px;
  max-height: 300px;
  overflow: hidden;
  border-radius: 4px;
  .no-img {
    width: 472px;
    height: 300px;
    border: 2px dashed $blue-color;
    border-spacing: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    .icon-upload {
      color: $blue-color;
      font-size: 48px;
    }
    .text {
      margin: 10px 0;
      color: $gray-color;
      font-size: 16px;
    }
  }
}
</style>
