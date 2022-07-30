async function test() {
  const response = await fetch("/saveData");
  const users = await response.json();
  console.log(users);
}
test();
