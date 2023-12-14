async function handleSubmit(event) {
  // send to backend to check if user exists
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // client side validation
  if (!username || username.length < 2 || !password || password.length < 2) {
    alert("username or password is empty");
  }

  const token = localStorage.getItem("accessToken");
  console.log(token);

  // check for jwt token already present; Yes -> make request to GET'/'???
  // if (token !== undefined) { TODO check against null
  //   console.log("you have a token");

  //   // window.location.href = "/";
  //   // await fetch("http://localhost:3000/", {
  //   //   method: "GET",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //   },
  //   // });
  // } else {
  // console.log("you have no token");
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);
    const readable_res = await response.json();
    console.log(readable_res);
    // placing token in local storage
    localStorage.setItem("accessToken", readable_res.token);

    if (response.ok) {
      // login successful
      // window.location.href = "/"; //TODO uncomment for prod
      // alert("login successful");
    } else {
      // login failed
      const data = await response.json();
      alert(`login failed: ${data.error}`);
    }
  } catch (err) {
    console.log("[FE_ERROR]:", err);
    return err;
  }
  // }

  // let getToken = localStorage.getItem("accessToken");

  // try {
  //   const protected_route = await fetch("http://localhost:3000/protected", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${getToken}`,
  //     },
  //   });

  //   const readable_res = await protected_route.json();
  //   console.log(readable_res);
  // } catch (err) {
  //   console.log(err);
  // }

  // send to backend
}

// get values from all fields and store in dict via attaching event listener on the form when it is submitted
let signInForm = document.getElementById("loginForm");
signInForm.addEventListener("submit", handleSubmit);
