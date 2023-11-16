async function handleSubmit(event) {
  // send to backend to check if user exists
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // client side validation
  if (!username || username.length < 2 || !password || password.length < 2) {
    alert("username or password is empty");
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const readable_res = await response.json();

    console.log(readable_res.token);

    // placing token in local storage
    localStorage.setItem("accessToken", readable_res.token);

    // window.location.href = "/public/index.html";
    // alert("Authentication successful");
  } catch (err) {
    console.log("[FE_ERROR]:", err);
    return err;
  }

  let getToken = localStorage.getItem("accessToken");

  try {
    const protected_route = await fetch("http://localhost:3000/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken}`,
      },
    });

    const readable_res = await protected_route.json();
    console.log(readable_res);
  } catch (err) {
    console.log(err);
  }

  // send to backend
}

// get values from all fields and store in dict via attaching event listener on the form when it is submitted
let signInForm = document.getElementById("loginForm");
signInForm.addEventListener("submit", handleSubmit);