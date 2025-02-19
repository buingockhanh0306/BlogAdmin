import { getField, updateField } from "vuex-map-fields";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "~/plugins/firebase";

export const state = () => ({
  listCategories: [],
  errorMessage: "",
});

export const getters = {
  getField,
};
export const mutations = {
  updateField,
  SET_LIST_CATEGORIES(state, payload) {
    state.listCategories = payload;
  },
};

export const actions = {
  async getListCategories({ commit }, isGetActive = true) {
    const getActive = query(
      collection(db, "categories"),
      where("is_active", "==", true)
    );
    const getAll = collection(db, "categories");

    const querySnapshot = await getDocs(isGetActive ? getActive : getAll);
    const categories = [];

    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    commit("SET_LIST_CATEGORIES", categories);
  },

  async addCategory({}, payload) {
    const { name, slug, description, tag_color } = payload;
    const res = await addDoc(collection(db, "categories"), {
      name,
      slug,
      tag_color,
      description,
      is_active: true,
      createdAt: new Date(),
    });
    return res;
  },

  async updateCategory({}, payload) {
    const { id, name, slug, description, tag_color, is_active } = payload;
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, {
      name,
      slug,
      description,
      tag_color,
      is_active,
      updatedAt: new Date(),
    });
  },
};
