import { getField, updateField } from "vuex-map-fields";
export const state = () => ({
  listUsers: [],
  errorMessage: "",
});

export const getters = {
  getField,
};
export const mutations = {
  updateField,
  SET_LIST_USERS(state, payload) {
    state.listUsers = payload;
  },
};

export const actions = {
  async getListUsers({ commit }, payload) {
    const result = await this.$axios.get("/users");
    commit("SET_LIST_USERS", result.data);
  },
  async addUser({}, payload) {
    const result = await this.$axios.post(`/users/create-user`, payload);
    return result.data;
  },
  async activeUser({}, payload) {
    const result = await this.$axios.put(`/users/active-user/${payload.id}`, {
      is_active: payload.is_active,
    });
    return result.data;
  },
  async changePassword({}, payload) {
    const result = await this.$axios.put(
      `/users/change-password/${payload.id}`,
      {
        password: payload.password,
        newPassword: payload.newPassword,
      }
    );
    return result.data;
  },
  async updateUser({}, payload) {
    const result = await this.$axios.put(`/users/update-user/${payload.id}`, {
      username: payload.username,
      displayName: payload.displayName,
    });
    return result.data;
  },
  async uploadAvatar({}, payload) {
    const result = await this.$axios.put(
      `/upload/avatar/${payload.id}`,
      payload.formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result.data;
  },
};
