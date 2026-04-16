self.addEventListener("message", async (event) => {
  const { command, data } = event.data;

  if (command === "initialize") {
    // TBD
  }

  if (command === "register") {
    // TBD
  }

  if (command === "unregister") {
    // TBD
  }

  console.log(command, data);
});
