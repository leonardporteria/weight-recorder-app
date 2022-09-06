import {
  generateCurrentWeek,
  generateCurrentMonth,
  generatePastMonth,
  generateThreeMonth,
  generateSixMonth,
} from "./chart.js";
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
// FETCH ALL DATA FROM SERVER
// ==================================================
export default async function loadWeightData() {
  // save user who logged in
  const response = await fetch("/saveData");
  const user = await response.json();

  // get the weight and date record of user
  const res = await fetch("/record");
  const json = await res.json();

  sortRecord(json);
  return json;
}
loadWeightData();

export async function setup() {
  // fetch user
  const response = await fetch("/saveData");
  const user = await response.json();

  console.log(user);

  // DOM variables
  const userUsername = document.querySelector(".user");
  const userDetailsAge = document.querySelector(".details-age");
  const userDetailsHeight = document.querySelector(".details-height");
  const userDetailsWeight = document.querySelector(".details-weight");
  const userDetailsBMI = document.querySelector(".details-bmi");

  // change site title to username
  document.title = `Weigth Recorder | ${user.username}`;

  // calculate details
  const recordLength = Object.keys(user.record).length;
  let latestWeight = 0;
  if (recordLength !== 0) {
    latestWeight = user.record[recordLength - 1].weight;
  }

  //calculate bmi [weight / height[m]^2]
  const BMI = latestWeight / Math.pow(user.height / 100, 2);

  // TODO: calculate age from string
  var dob = new Date(user.birthdate);
  var monthDiff = Date.now() - dob.getTime();
  var ageFullDay = new Date(monthDiff);
  var year = ageFullDay.getUTCFullYear();
  var age = Math.abs(year - 1970);

  // setup user details
  userUsername.textContent = user.username;
  userDetailsAge.textContent = `${user.birthdate} dob || age ${age}yrs old`;
  userDetailsHeight.textContent = `height ${user.height}cm`;
  userDetailsWeight.textContent = `latest weight ${latestWeight}kg`;
  userDetailsBMI.textContent = `latest bmi ${BMI.toFixed(2)}`;
}

setup();

// ==================================================
// HELPER FUNCTIONS
// ==================================================
async function sortRecord(records) {
  sortByDate(records);
}

const sortByDate = (array) => {
  const sorter = (a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  };
  array.sort(sorter);
};

async function hasRecorded(records, userDate) {
  let hasData = records.some((record) => {
    const trimDate = record.date.substring(0, 10);
    if (trimDate === userDate) return true;
  });

  return hasData;
}

async function splitRecords() {
  const records = await loadWeightData();
  let date = [];
  let weight = [];
  // date
  records.forEach((record) => {
    // substring(start, end) {(5,10), (8,10)}
    const trimRecord = record.date.substring(0, 10);
    date.push(trimRecord);
  });
  // weight
  records.forEach((record) => {
    weight.push(record.weight);
  });
  console.log("test");
  return { date, weight };
}

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

  // update setup info onclick
  await setup();

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
});

// ==================================================
// FRONT-END DOM
// ==================================================
generateCurrentWeek();
generateCurrentMonth();
generatePastMonth();
generateThreeMonth();
generateSixMonth();
