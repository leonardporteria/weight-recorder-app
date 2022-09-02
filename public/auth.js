// ==================================================
// GLOBAL VARIABLES
// ==================================================
const signupUsernameInput = document.querySelector("#signup-username");
const signupBirthdateInput = document.querySelector("#signup-birthdate");
const signupHeightInput = document.querySelector("#signup-height");
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
  const birthdate = signupBirthdateInput.value;
  const height = signupHeightInput.value;
  const timestamp = Date.now();
  let hasTaken = false;

  if (!username && !password) return;

  // DATABASE BOILERPLATE
  const data = {
    timestamp,
    username,
    password,
    record: [],
    birthdate,
    height,
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

  if (!loginUsername || !loginPassword) {
    console.log("provide input");
    alertOn("Please Provide Complete Input");
    return;
  }

  // FETCH user details
  const response = await fetch("/createUser");
  const users = await response.json();

  // CHECK FOR USER EXISTENCE
  let userExists = false;
  let user;
  users.forEach((userData) => {
    if (loginUsername === userData.username) {
      userExists = true;
      user = userData;
      return;
    }
  });

  if (!userExists) {
    console.log("no user");
    alertOn(`The user '${loginUsername}' does not exist`);
    return;
  }

  // USER AUTHENTICATION
  if (user.password !== loginPassword) {
    console.log("wrong pass");
    alertOn("Wrong Password");
    return;
  }

  data.username = loginUsername;
  data.password = loginPassword;

  // POST request to store data in server
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  await fetch("/saveData", options);

  location.replace("./home");
});

// ==================================================
// DOM MODIFICATION [overlay]
// ==================================================
const overlay = document.querySelector(".overlay");
const notif = document.querySelector(".notif");
const alertContent = document.querySelector(".notif p");
const clearAlert = document.querySelector(".clear-alert");

const alertOn = (content = "Alert!") => {
  overlay.classList.add("overlay-on");
  overlay.classList.remove("overlay-off");
  notif.classList.add("notif-on");
  notif.classList.remove("notif-off");

  alertContent.textContent = content;
};
const alertOff = () => {
  overlay.classList.add("overlay-off");
  overlay.classList.remove("overlay-on");
  notif.classList.add("notif-off");
  notif.classList.remove("notif-on");
};

clearAlert.addEventListener("click", () => {
  alertOff();
});
