self.addEventListener("message", async (event) => {
  const { command, data } = event.data;

  if (command === "initialize") {
    console.log(data);
  }
});
