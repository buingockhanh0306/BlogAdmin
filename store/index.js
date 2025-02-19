import { getField, updateField } from "vuex-map-fields";
export const state = () => ({
  authUser: null,
});

export const getters = {
  getField,
};
export const mutations = {
  updateField,
  SET_AUTH_USER(state, user) {
    state.authUser = user;
  },
};

export const actions = {};
