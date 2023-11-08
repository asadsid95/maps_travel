const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;

  // client-side validation
  if (name.trim() === "" || name.length < 2) {
    alert("username must not be empty or be greater than 2 characters");
    return;
  }

  //   const visitedCountries = document
  //     .getElementById("visitedCountries")
  //     .value.split(",");

  // Make a POST request to the server for user registration
  const response = await fetch("http://localhost:3000/registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (response.status !== 200) {
    // Registration successful
    window.location.href = "/public/index.html";
    console.log("Registration successful");
  } else {
    // Registration failed
    console.error(`Registration failed, ${name} already exists as users`);
  }
});
