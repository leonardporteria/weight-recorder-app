async function main() {
  const response = await fetch("/saveData");
  const user = await response.json();
  console.log(user);

  const res = await fetch("/insertRecord");
  const json = await res.json();
  console.log(json);
}
main();
const today = new Date();
const currentDate =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

const submitBtn = document.querySelector("#submit");

submitBtn.addEventListener("click", async () => {
  const weightEl = document.querySelector("#weight").value;
  const dateEl = document.querySelector("#date").value;
  console.log(weightEl);
  console.log(dateEl);
  console.log(currentDate);

  // METHOD
  const data = {
    date: dateEl,
    weight: weightEl,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // POST
  const response = await fetch("/insertRecord", options);
  const json = await response.json();
  console.log(json);
});
