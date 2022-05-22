const weightEl = document.getElementById("weight");
const dateEl = document.getElementById("date");

let weight, date;
weightEl.addEventListener("input", (e) => (weight = e.target.value));
dateEl.addEventListener("input", (e) => (date = e.target.value));

// LOAD DATABASE
async function loadDatabase() {
  const res = await fetch("/api");
  const json = await res.json();
  console.log(json);
  return json;
}

// POST
const button = document.getElementById("submit");
button.addEventListener("click", async () => {
  const timestamp = Date.now();
  // content
  const data = { timestamp, weight, date };
  // POST config
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // POST
  const response = await fetch("/api", options);
  const json = await response.json();
  console.log(json);
});

async function generateCHart() {
  const data = await loadDatabase();
  let dateLabel = [];
  let weightArr = [];
  data.forEach((elm) => {
    dateLabel.push(elm.date);
    weightArr.push(elm.weight);
  });
  console.log(dateLabel);
  console.log(weightArr);

  const ctx = document.getElementById("chart").getContext("2d");
  ctx.canvas.width = document.body.offsetWidth;
  ctx.canvas.height = window.innerHeight;
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dateLabel,
      datasets: [
        {
          label: "Label ng chart",
          data: weightArr,
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
          beginAtZero: false,
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

generateCHart();
