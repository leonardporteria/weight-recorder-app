import { loadWeightData, hasRecorded } from "./chart.js";
import { ChartGenerator } from "./chart.js";

// ==================================================
// GLOBAL VARIABLES
// ==================================================
const today = new Date();
const currentDate = `${today.getFullYear()}-${
  today.getMonth() + 1
}-${today.getDate()}`;
const submitBtn = document.querySelector("#submit");
const dateInputElement = document.querySelector("#date");

// ==================================================
// SETUP INITIAL DATA OF USER
// ==================================================
// global variable for weight data [used for dynamic changes in frontend]
let weightData;
async function saveWeightData() {
  weightData = await loadWeightData();
}
saveWeightData();

async function setup() {
  // fetch user
  const response = await fetch("/saveData");
  const user = await response.json();
  const record = weightData;

  // DOM variables
  const userUsername = document.querySelector(".user");
  const userDetailsUsername = document.querySelector(".details-username");
  const userDetailsAge = document.querySelector(".details-age");
  const userDetailsDOB = document.querySelector(".details-dob");
  const userDetailsHeight = document.querySelector(".details-height");
  const userDetailsWeight = document.querySelector(".details-weight");
  const userDetailsBMI = document.querySelector(".details-bmi");

  // change site title to username
  document.title = `Weigth Recorder | ${user.username}`;

  // calculate details
  const recordLength = Object.keys(record).length;
  let latestWeight = 0;
  if (recordLength !== 0) {
    latestWeight = record[recordLength - 1].weight;
  }

  //calculate bmi [weight / height[m]^2]
  const BMI = latestWeight / Math.pow(user.height / 100, 2);

  // calculate age from string
  let dob = new Date(user.birthdate);
  let monthDiff = Date.now() - dob.getTime();
  let ageFullDay = new Date(monthDiff);
  let year = ageFullDay.getUTCFullYear();
  let age = Math.abs(year - 1970);

  // setup user details
  userUsername.textContent = user.username;
  userDetailsUsername.textContent = `Welcome back, ${user.username}!`;
  userDetailsAge.textContent = `You are ${age}yrs old today.`;
  userDetailsDOB.textContent = `You are born on ${user.birthdate}`;
  userDetailsHeight.textContent = `Your latest height is ${user.height}cm.`;
  userDetailsWeight.textContent = `Your latest weight is ${latestWeight}kg.`;
  userDetailsBMI.textContent = `Your latest BMI is ${BMI.toFixed(2)}.`;
}

setTimeout(setup, 100);

// ==================================================
// CHART JS OBJECT
// ==================================================
const myChart = new ChartGenerator();

myChart.generateCurrentWeek();
myChart.generateCurrentMonth();
myChart.generatePastMonth();
myChart.generateAllTime();

// ==================================================
// DATE INPUT EVENT LISTENER
// ==================================================
dateInputElement.addEventListener("change", async (e) => {
  const userData = await loadWeightData();

  console.log(e.target.value);

  const hasData = await hasRecorded(userData, e.target.value);
  if (hasData) {
    console.log("you already has data for that day");
    // TODO: DISABLE SUBMIT BTN
  }
});

// ==================================================
// SUBMIT EVENT LISTENER
// ==================================================
submitBtn.addEventListener("click", async () => {
  const weight = document.querySelector("#weight").value;
  const date = document.querySelector("#date").value;
  if (!weight || !date) return;

  // METHOD
  const data = {
    date: new Date(date),
    weight: weight,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // POST
  const response = await fetch("/record", options);
  const json = await response.json();
  console.log(json);

  // push latest data
  weightData.push(data);

  // update new user details
  setup();

  // destroy chart
  myChart.destroyCurrentWeek();
  myChart.destroyCurrentMonth();
  myChart.destroyPastMonth();
  myChart.destroyAllTime();
  // regenerate chart
  myChart.generateCurrentWeek();
  myChart.generateCurrentMonth();
  myChart.generatePastMonth();
  myChart.generateAllTime();
});
