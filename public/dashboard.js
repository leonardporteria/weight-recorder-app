import { loadWeightData } from "./chart.js";

// ==================================================
// CHECK USER EXISTENCE
// ==================================================
async function hasUser() {
  // fetch user
  const response = await fetch("/saveData");
  const user = await response.json();
  console.log("HAS USER");
  console.log(user);

  if (Object.keys(user).length === 0) {
    console.log("mt");
    location.replace("./404");
  }
}
hasUser();

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

  // change site title to username
  document.title = `Dashboard | ${user.username}`;

  // calculate details
  const recordLength = Object.keys(record).length;
  let latestWeight = 0;
  if (recordLength !== 0) {
    latestWeight = record[recordLength - 1].weight;
  }

  // calculate age from string
  let dob = new Date(user.birthdate);
  let monthDiff = Date.now() - dob.getTime();
  let ageFullDay = new Date(monthDiff);
  let year = ageFullDay.getUTCFullYear();
  let age = Math.abs(year - 1970);

  // setup user details
  userUsername.textContent = user.username;
  userDetailsUsername.textContent = `Welcome to Dashboard, ${user.username}!`;
  userDetailsAge.textContent = `Age: ${age}yrs old`;
  userDetailsDOB.textContent = `Birthdate: ${user.birthdate}`;
  userDetailsHeight.textContent = `Height: ${user.height}cm`;
}

setTimeout(setup, 100);

// ==================================================
// CREATE DOM AND APPEND TO HTML
// ==================================================
async function generateRecords() {
  // load weight data
  const records = await loadWeightData();
  const response = await fetch("/saveData");
  const user = await response.json();
  const userHeight = user.height;

  records.forEach((record) => {
    // DATA CALCULATION
    const userWeight = record.weight;
    const userBMI = userWeight / Math.pow(userHeight / 100, 2);
    const dateRecorded = record.date;
    const userDate = dateRecorded.substring(0, 10);

    // DOM MANIPULATION
    // parent element
    const weightDataParent = document.querySelector(".weight");

    // create html elements
    const weightData = document.createElement("div");
    const dataDate = document.createElement("p");
    const dataWeigt = document.createElement("p");
    const dataBMI = document.createElement("p");
    const dataEdit = document.createElement("div");
    const dataEditImg = document.createElement("img");
    const dataEditHeading = document.createElement("h1");
    const dataSave = document.createElement("div");
    const dataSaveImg = document.createElement("img");
    const dataSaveHeading = document.createElement("h1");

    // assign class names to elements
    weightData.classList.add("weight-data");
    weightData.classList.add(`${userDate}`);
    dataDate.classList.add("weight-data-date");
    dataWeigt.classList.add("weight-data-weight");
    dataBMI.classList.add("weight-data-bmi");
    dataEdit.classList.add("weight-data-edit");
    dataEditImg.classList.add("weight-data-edit-img");
    dataEditHeading.classList.add("weight-data-edit-heading");
    dataSave.classList.add("weight-data-save");
    dataSaveImg.classList.add("weight-data-save-img");
    dataSaveHeading.classList.add("weight-data-save-heading");

    // append sub parent elements
    dataEdit.appendChild(dataEditImg);
    dataEdit.appendChild(dataEditHeading);
    dataSave.appendChild(dataSaveImg);
    dataSave.appendChild(dataSaveHeading);

    // append whole row
    weightData.appendChild(dataDate);
    weightData.appendChild(dataWeigt);
    weightData.appendChild(dataBMI);
    weightData.appendChild(dataEdit);
    weightData.appendChild(dataSave);

    // append new elements to parent
    weightDataParent.appendChild(weightData);

    // value change
    dataDate.textContent = userDate;
    dataWeigt.textContent = `${userWeight}kg`;
    dataBMI.textContent = userBMI.toFixed(2);
    dataEditImg.src = "./assets/edit.png";
    dataEditHeading.textContent = `Update`;
    dataSaveImg.src = "./assets/save.png";
    dataSaveHeading.textContent = `Save`;
  });
}
generateRecords();
