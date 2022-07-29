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
  // check if user exists
  const findUser = await fetch("/createUser");
  const userDetails = await findUser.json();
  let taken = false;
  userDetails.every((user) => {
    if (data.username === user.username) {
      console.log("username already taken");
      taken = true;
      return false;
    }
    console.log(user.username);
    return true;
  });

  if (taken === true) return;
  // POST
  const response = await fetch("/createUser", options);
  const json = await response.json();
  console.log(json);
});

loginBtn.addEventListener("click", async () => {
  const loginUsername = loginUsernameInput.value;
  const loginPassword = loginPasswordInput.value;

  // FETCH data
  const response = await fetch("/createUser");
  const users = await response.json();
  console.log(users);

  users.every((user) => {
    if (loginUsername === user.username) {
      console.log("user exists");
      if (loginPassword === user.password) {
        console.log("login granted");
        location.replace("./home");
      } else {
        console.log("wrong password");
      }
      return false;
    }
    return true;
  });
});
