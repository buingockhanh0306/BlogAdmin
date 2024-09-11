// middleware/auth.js
export default function ({ $auth, redirect }) {
  if ($auth.loggedIn) {
    redirect("/");
  } else {
    redirect("/login");
  }
}
