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
    console.log(response);
  } catch (err) {
    console.log(err);
    return err;
  }

  // send to backend
}

// get values from all fields and store in dict via attaching event listener on the form when it is submitted
let signInForm = document.getElementById("loginForm");
signInForm.addEventListener("submit", handleSubmit);
