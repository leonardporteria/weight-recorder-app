async function main() {
  const response = await fetch("/createUser");
  const users = await response.json();
  console.log(users);
}

main();
console.log("ENDzz");
