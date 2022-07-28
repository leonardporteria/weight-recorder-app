const signupUsernameInput = document.querySelector("#signup-username");
const signupPasswordInput = document.querySelector("#signup-password");
const signupBtn = document.querySelector("#signup-btn");
const loginUsernameInput = document.querySelector("#login-username");
const loginPasswordInput = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-btn");

signupBtn.addEventListener("click", async () => {
  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;
  const timestamp = Date.now();
  // content
  const data = {
    timestamp,
    username,
    password,
  };
  console.log(data);
  // POST config
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // POST
  const response = await fetch("/createUser", options);
  const json = await response.json();
  console.log(json);
});

loginBtn.addEventListener("click", async () => {
  const loginUsername = loginUsernameInput.value;
  const loginPassword = loginPasswordInput.value;
  const timestamp = Date.now();
  // content
  const data = {
    timestamp,
    loginUsername,
    loginPassword,
  };
  console.log(data);
  // POST config
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // POST
  const response = await fetch("/createUser", options);
  const json = await response.json();
  console.log(json);
});