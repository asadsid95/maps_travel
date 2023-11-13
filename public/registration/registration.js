const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // console.log(username);

  // client-side validation
  if (
    username.trim() === "" ||
    username.length < 2 ||
    password.trim() === "" ||
    password.length < 2
  ) {
    alert("username must not be empty or be greater than 2 characters");
    return;
  }
  // Prepare data for the backend
  const formData = {
    username: username,
    password: password,
  };

  // Make a POST request to the server for user registration
  try {
    const response = await fetch("http://localhost:3000/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    });

    console.log(response);

    if (response.ok) {
      // Registration successful
      window.location.href = "/public/login/login.html";
      alert("Registration successful");
    } else {
      // Registration failed
      const data = await response.json();
      alert(`Registration failed: ${data.error}`);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration. Please try again.");
  }
});
