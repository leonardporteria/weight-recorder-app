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
async function load() {
  // save user who logged in
  const response = await fetch("/saveData");
  const user = await response.json();

  // setup user details
  document.title = `Weigth Recorder | ${user.username}`;
  document.querySelector(".user").textContent = user.username;

  // get the weight and date record of user
  const res = await fetch("/record");
  const json = await res.json();
  console.table(json);
  sortRecord(json);
  return json;
}
load();

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
  const records = await load();
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
  console.table(date);
  console.table(weight);

  return { date, weight };
}

// ==================================================
// DATE INPUT EVENT LISTENER
// ==================================================
dateInputElement.addEventListener("change", async (e) => {
  const userData = await load();

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
});

// ==================================================
// CHART JS CANVAS
// ==================================================
async function generateCurrentWeek() {
  const { date, weight } = await splitRecords();

  const ctx = document.getElementById("chart-current-week").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = document.body.querySelector(
    ".stats-current-week"
  ).innerHeight;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "Label ng chart",
          data: weight,
          fill: false,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "kg";
            },
          },
        },
      },
    },
  });
}
async function generateCurrentMonth() {
  const { date, weight } = await splitRecords();

  const ctx = document.getElementById("chart-current-month").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = window.innerHeight;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "Label ng chart",
          data: weight,
          fill: false,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "kg";
            },
          },
        },
      },
    },
  });
}
async function generatePastMonth() {
  const { date, weight } = await splitRecords();

  const ctx = document.getElementById("chart-past-month").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = window.innerHeight;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "Label ng chart",
          data: weight,
          fill: false,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "kg";
            },
          },
        },
      },
    },
  });
}
async function generateThreeMonth() {
  const { date, weight } = await splitRecords();

  const ctx = document.getElementById("chart-three-month").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = window.innerHeight;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "Label ng chart",
          data: weight,
          fill: false,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "kg";
            },
          },
        },
      },
    },
  });
}
async function generateSixMonth() {
  const { date, weight } = await splitRecords();

  const ctx = document.getElementById("chart-six-month").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = window.innerHeight;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "Label ng chart",
          data: weight,
          fill: false,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value, index, ticks) {
              return value + "kg";
            },
          },
        },
      },
    },
  });
}

generateCurrentWeek();
generateCurrentMonth();
generatePastMonth();
generateThreeMonth();
generateSixMonth();
