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

  // get the weight and date record of user
  const res = await fetch("/record");
  const json = await res.json();
  console.table(json);
  sortRecord(json);
}
load();

// ==================================================
// HELPER FUNCTIONS
// ==================================================
async function sortRecord(records) {
  console.table(records);

  sortByDate(records);
  console.table(records);
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
