import { getField, updateField } from "vuex-map-fields";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "~/plugins/firebase";

export const state = () => ({
  listPosts: [],
  errorMessage: "",
  detailPost: null,
});

export const getters = {
  getField,
};
export const mutations = {
  updateField,
  SET_LIST_POSTS(state, payload) {
    state.listPosts = payload;
  },
  SET_DETAIL_POST(state, payload) {
    state.detailPost = payload;
  },
};

export const actions = {
  async getListPosts({ commit }, payload) {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    commit("SET_LIST_POSTS", posts);
  },

  async addPost({}, payload) {
    const {
      title,
      slug,
      categoryIds,
      content,
      author_id,
      image_url,
      description,
    } = payload;
    const res = await addDoc(collection(db, "posts"), {
      title,
      slug,
      categoryIds,
      content,
      author_id,
      image_url,
      description,
      votes: 0,
      is_active: true,
      createdAt: new Date(),
    });
    return res;
  },

  async updatePost({}, payload) {
    const {
      id,
      title,
      slug,
      content,
      categoryIds,
      is_active,
      image_url,
      description,
    } = payload;
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      slug,
      content,
      categoryIds,
      image_url,
      description,
      is_active,
      updatedAt: new Date(),
    });
  },

  async getDetailPost({ commit }, id) {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      commit("SET_DETAIL_POST", docSnap.data());
    }
  },
};
