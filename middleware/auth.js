// middleware/authenticated.js
export default async function ({ $auth, redirect }) {
  if (!$auth.loggedIn) {
    return redirect("/login");
  }
}
