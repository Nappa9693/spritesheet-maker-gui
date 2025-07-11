document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("createSpriteSheetButton")
    .addEventListener("click", createSpriteSheet);
});

function createSpriteSheet() {
  try {
    const sourceDirectory = document.getElementById("sourceDirectory").value;
    const destinationDirectory = document.getElementById(
      "destinationDirectory",
    ).value;
    const fileName = document.getElementById("fileName").value;
    const columnCount = parseInt(document.getElementById("columnCount").value);

    // TODO: Add validation.

    alert(`Source Directory: ${sourceDirectory}\n
                Destination Directory: ${destinationDirectory}\n
                File Name: ${fileName}\n
                Column Count: ${columnCount}`);
  } catch (ex) {
    // TODO: Display message modal.
    console.log(ex);
  }
}
