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
  const userDetailsAge = document.querySelector(".details-age");
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

  // TODO: calculate age from string
  let dob = new Date(user.birthdate);
  let monthDiff = Date.now() - dob.getTime();
  let ageFullDay = new Date(monthDiff);
  let year = ageFullDay.getUTCFullYear();
  let age = Math.abs(year - 1970);

  // setup user details
  userUsername.textContent = user.username;
  userDetailsAge.textContent = `${user.birthdate} dob || age ${age}yrs old`;
  userDetailsHeight.textContent = `height ${user.height}cm`;
  userDetailsWeight.textContent = `latest weight ${latestWeight}kg`;
  userDetailsBMI.textContent = `latest bmi ${BMI.toFixed(2)}`;
}

setTimeout(setup, 500);

// ==================================================
// CHART JS OBJECT
// ==================================================
const myChart = new ChartGenerator();

myChart.generateCurrentWeek();
myChart.generateCurrentMonth();
myChart.generatePastMonth();
myChart.generateThreeMonth();
myChart.generateSixMonth();

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
  myChart.destroyThreeMonth();
  myChart.destroySixMonth();
  // regenerate chart
  myChart.generateCurrentWeek();
  myChart.generateCurrentMonth();
  myChart.generatePastMonth();
  myChart.generateThreeMonth();
  myChart.generateSixMonth();
});

// ==================================================
// DEBUG
// ==================================================
const debugButton = document.querySelector("#clickme");
debugButton.addEventListener("click", async () => {
  console.log("DEBUG");
  await setup();
  console.log(weightData);
});
