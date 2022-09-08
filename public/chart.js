// ==================================================
// HELPER FUNCTIONS
// ==================================================
export async function loadWeightData() {
  // save user who logged in
  const response = await fetch("/saveData");
  const user = await response.json();

  // get the weight and date record of user
  const res = await fetch("/record");
  const json = await res.json();

  sortRecord(json);
  return json;
}

export async function sortRecord(records) {
  sortByDate(records);
}
const sortByDate = (array) => {
  const sorter = (a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  };
  array.sort(sorter);
};

export async function hasRecorded(records, userDate) {
  let hasData = records.some((record) => {
    const trimDate = record.date.substring(0, 10);
    if (trimDate === userDate) return true;
  });

  return hasData;
}

export async function splitRecords() {
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

  return { date, weight };
}

// ==================================================
// SORT RECORD BY YEAR / MONTH / WEEK
// ==================================================
const currentDate = new Date();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
const nameOfMonth = new Date().toLocaleString("default", { month: "long" });

class DateSorter {
  constructor() {}

  async saveCurrentMonth() {
    const records = await loadWeightData();
    let currentMonthData = [];

    const currentMonth = `${year}-${month < 10 ? `0${month}` : month}`;

    // trim date to smaller substring
    records.forEach((record) => {
      const trimDate = record.date.substring(0, 7);
      // data for current month
      const data = {
        date: record.date,
        weight: record.weight,
      };
      // save data if same to current month
      if (trimDate === currentMonth) {
        currentMonthData.push(data);
      }
    });

    // separate date and weight
    let date = [];
    let weight = [];

    currentMonthData.forEach((currData) => {
      date.push(currData.date.substring(5, 10));
      weight.push(currData.weight);
    });

    return { date, weight };
  }

  async savePastMonth() {
    const records = await loadWeightData();
    const pastMonth = currentDate.getMonth();
    let currentMonthData = [];

    const currentMonth = `${year}-${
      pastMonth < 10 ? `0${pastMonth}` : pastMonth
    }`;

    // trim date to smaller substring
    records.forEach((record) => {
      const trimDate = record.date.substring(0, 7);
      // data for current month
      const data = {
        date: record.date,
        weight: record.weight,
      };
      // save data if same to current month
      if (trimDate === currentMonth) {
        currentMonthData.push(data);
      }
    });

    // separate date and weight
    let date = [];
    let weight = [];

    currentMonthData.forEach((currData) => {
      date.push(currData.date.substring(5, 10));
      weight.push(currData.weight);
    });

    return { date, weight };
  }
}

// ==================================================
// CHART JS CANVAS
// ==================================================
export class ChartGenerator {
  constructor() {
    this.currentWeek;
    this.currentMonth;
    this.pastMonth;
    this.allTime;
  }

  // ==================================================
  // CHART JS GENERATE CANVAS
  // ==================================================
  async generateCurrentWeek() {
    const { date, weight } = await splitRecords();

    const dateRecord = date.slice(-7);
    const weightRecord = weight.slice(-7);

    const ctx = document.getElementById("chart-current-week").getContext("2d");
    ctx.canvas.width = document.body.offsetWidth;
    ctx.canvas.height = document.body.querySelector(
      ".stats-current-week"
    ).innerHeight;

    this.currentWeek = new Chart(ctx, {
      type: "line",
      data: {
        labels: dateRecord,
        datasets: [
          {
            label: "LAST 7 RECORDS",
            data: weightRecord,
            fill: false,
            backgroundColor: "rgba(50, 0, 0, 0.1)",
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
  async generateCurrentMonth() {
    const myDate = new DateSorter();
    const { date, weight } = await myDate.saveCurrentMonth();

    const ctx = document.getElementById("chart-current-month").getContext("2d");
    ctx.canvas.width = document.body.offsetWidth;
    ctx.canvas.height = window.innerHeight;

    this.currentMonth = new Chart(ctx, {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: `RECORD FOR THE MONTH OF ${nameOfMonth.toUpperCase()}`,
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
  async generatePastMonth() {
    const current = new Date();
    current.setMonth(current.getMonth() - 1);
    const previousMonth = current.toLocaleString("default", { month: "long" });

    const myDate = new DateSorter();
    const { date, weight } = await myDate.savePastMonth();

    const ctx = document.getElementById("chart-past-month").getContext("2d");
    ctx.canvas.width = document.body.offsetWidth;
    ctx.canvas.height = window.innerHeight;

    this.pastMonth = new Chart(ctx, {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: `RECORD FOR THE MONTH OF ${previousMonth.toUpperCase()}`,
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
  async generateAllTime() {
    const { date, weight } = await splitRecords();

    const ctx = document.getElementById("chart-all-time").getContext("2d");
    ctx.canvas.width = document.body.offsetWidth;
    ctx.canvas.height = window.innerHeight;

    this.allTime = new Chart(ctx, {
      type: "bar",
      data: {
        labels: date,
        datasets: [
          {
            label: "ALL TIME WEIGHT",
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

  // ==================================================
  // CHART JS DESTROY CANVAS
  // ==================================================
  destroyCurrentWeek() {
    this.currentWeek.destroy();
  }
  destroyCurrentMonth() {
    this.currentMonth.destroy();
  }
  destroyPastMonth() {
    this.pastMonth.destroy();
  }
  destroyAllTime() {
    this.allTime.destroy();
  }
}

// ==================================================
// DEBUG
// ==================================================
const myDate = new DateSorter();
myDate.saveCurrentMonth();
myDate.savePastMonth();
