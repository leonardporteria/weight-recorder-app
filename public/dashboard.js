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
    const dataWeight = document.createElement("p");
    const dataBMI = document.createElement("p");
    const dataEdit = document.createElement("div");
    const dataEditImg = document.createElement("img");
    const dataEditHeading = document.createElement("h1");
    const dataSave = document.createElement("div");
    const dataSaveImg = document.createElement("img");
    const dataSaveHeading = document.createElement("h1");

    // assign class names to elements
    weightData.classList.add("weight-data");
    dataDate.classList.add("weight-data-date");
    dataWeight.classList.add("weight-data-weight");
    dataWeight.classList.add(`weight-${userDate}`);
    dataBMI.classList.add("weight-data-bmi");
    dataEdit.classList.add("weight-data-edit");
    dataEdit.classList.add(`edit-${userDate}`);
    dataEditImg.classList.add("weight-data-edit-img");
    dataEditHeading.classList.add("weight-data-edit-heading");
    dataSave.classList.add("weight-data-save");
    dataSave.classList.add(`save-${userDate}`);
    dataSaveImg.classList.add("weight-data-save-img");
    dataSaveHeading.classList.add("weight-data-save-heading");

    // append sub parent elements
    dataEdit.appendChild(dataEditImg);
    dataEdit.appendChild(dataEditHeading);
    dataSave.appendChild(dataSaveImg);
    dataSave.appendChild(dataSaveHeading);

    // append whole row
    weightData.appendChild(dataDate);
    weightData.appendChild(dataWeight);
    weightData.appendChild(dataBMI);
    weightData.appendChild(dataEdit);
    weightData.appendChild(dataSave);

    // append new elements to parent
    weightDataParent.appendChild(weightData);

    // value change
    dataDate.textContent = userDate;
    dataWeight.textContent = `${userWeight}kg`;
    dataBMI.textContent = userBMI.toFixed(2);
    dataEditImg.src = "./assets/edit.png";
    dataEditHeading.textContent = `Update`;
    dataSaveImg.src = "./assets/save.png";
    dataSaveHeading.textContent = `Save`;
  });

  // ==================================================
  // UPDATE USER WEIGHT
  // ==================================================
  records.forEach((record) => {
    const dateRecorded = record.date;
    const userDate = dateRecorded.substring(0, 10);

    const weightElm = document.querySelector(`.weight-${userDate}`);
    const editBtn = document.querySelector(`.edit-${userDate}`);
    const saveBtn = document.querySelector(`.save-${userDate}`);

    let updatedWeight;

    editBtn.addEventListener("click", () => {
      console.log(userDate);
      console.log(updatedWeight);

      weightElm.innerHTML = `<input  type="number" class="details-weight-input" placeholder="Input New Height [cm]">`;
      const weightInput = document.querySelector(".details-weight-input");
      weightInput.style.width = "12rem";
      weightInput.style.padding = "0.25rem 1rem";
      weightInput.style.border = "1px solid #1d556f";
      weightInput.style.borderRadius = "0.5rem";
      weightInput.style.backgroundColor = "hsl(0, 0%, 97%)";
      weightInput.style.fontFamily = `"Rubik", sans-serif`;

      // save new weight
      weightInput.addEventListener("change", async (e) => {
        updatedWeight = e.target.value;
      });
    });

    saveBtn.addEventListener("click", async () => {
      console.log(updatedWeight);
      weightElm.innerHTML = `${updatedWeight}kg`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateRecorded,
          weight: updatedWeight,
          oldWeight: record.weight,
        }),
      };
      await fetch("/updateWeight", options);
    });
  });
}
generateRecords();

// ==================================================
// UPDATE USER HEIGHT
// ==================================================
const updateHeightBtn = document.querySelector(".edit-details");
const saveHeightBtn = document.querySelector(".save-details");
const userDetailsHeight = document.querySelector(".details-height");
let updatedHeight;

// edit btn
updateHeightBtn.addEventListener("click", async () => {
  userDetailsHeight.innerHTML = `<input  type="number" class="details-height-input" placeholder="Input New Height [cm]">`;
  const heightInput = document.querySelector(".details-height-input");
  heightInput.style.width = "12rem";
  heightInput.style.padding = "0.5rem 1rem";
  heightInput.style.border = "1px solid #1d556f";
  heightInput.style.borderRadius = "0.5rem";
  heightInput.style.backgroundColor = "hsl(0, 0%, 97%)";
  heightInput.style.fontFamily = `"Rubik", sans-serif`;

  // save new height
  heightInput.addEventListener("change", async (e) => {
    updatedHeight = e.target.value;
  });
});

// save btn
saveHeightBtn.addEventListener("click", async () => {
  userDetailsHeight.innerHTML = `Height: ${updatedHeight}cm`;

  // POST NEW HEIGHT
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ height: updatedHeight }),
  };
  await fetch("/updateHeight", options);
});
