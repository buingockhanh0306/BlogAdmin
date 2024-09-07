// middleware/auth.js
export default function ({ $auth, redirect }) {
  console.log($auth.loggedIn);

  if ($auth.loggedIn) {
    console.log("vao day 123");
    redirect("/admin");
  } else {
    redirect("/login");
  }
}
