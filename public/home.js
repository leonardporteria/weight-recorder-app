async function main() {
  const response = await fetch("/saveData");
  const user = await response.json();
  console.log(user);
}
main();
