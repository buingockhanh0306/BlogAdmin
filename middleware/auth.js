export default function ({ $axios, store, redirect }) {
  const token = localStorage.getItem("token");

  if (token) {
    $axios.setHeader("Authorization", `Bearer ${token}`);
  } else {
    redirect("/login");
  }
}
