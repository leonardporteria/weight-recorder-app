// ==================================================
// GLOBAL VARIABLES
// ==================================================
const signupUsernameInput = document.querySelector("#signup-username");
const signupPasswordInput = document.querySelector("#signup-password");
const signupBtn = document.querySelector("#signup-btn");
const loginUsernameInput = document.querySelector("#login-username");
const loginPasswordInput = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-btn");

// ==================================================
// SIGNUP EVENT LISTENER
// ==================================================
signupBtn.addEventListener("click", async () => {
  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;
  const timestamp = Date.now();
  let hasTaken = false;

  if (!username && !password) return;

  // DATABASE BOILERPLATE
  const data = {
    timestamp,
    username,
    password,
    record: [],
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // check if username exists
  const findUser = await fetch("/createUser");
  const users = await findUser.json();
  users.every((user) => {
    if (data.username === user.username) {
      console.log("username already taken");
      hasTaken = true;
      return false;
    }
    return true;
  });

  if (hasTaken === true) return;

  // POST
  const response = await fetch("/createUser", options);
  const json = await response.json();
  console.log(json);
});

// ==================================================
// LOGIN EVENT LISTENER
// ==================================================
loginBtn.addEventListener("click", async () => {
  const loginUsername = loginUsernameInput.value;
  const loginPassword = loginPasswordInput.value;
  const data = {
    username: "",
    password: "",
  };

  if (!loginUsername || !loginPassword) return;

  // FETCH user details
  const response = await fetch("/createUser");
  const users = await response.json();
  users.every((user) => {
    if (loginUsername === user.username) {
      console.log("user exists");
      if (loginPassword === user.password) {
        console.log("login granted");
        data.username = loginUsername;
        data.password = loginPassword;
        location.replace("./home");
      } else console.log("wrong password");
      return false;
    }
    return true;
  });

  // POST request to store data in server
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  await fetch("/saveData", options);
});
