document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("createSpriteSheetButton")
    .addEventListener("click", createSpriteSheet);
  document
    .getElementById("sourceDialogButton")
    .addEventListener("click", async () => {
      await displayOpenFolderDialog("sourceDirectory");
    });
  document
    .getElementById("destinationDialogButton")
    .addEventListener("click", async () => {
      await displayOpenFolderDialog("destinationDirectory");
    });
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
    console.log(sourceDirectory);

    window.spriteSheetMaker.createSpriteSheet(
      sourceDirectory,
      `${destinationDirectory}/${fileName}`,
      columnCount,
    );
    window.spriteSheetMaker.onCreateSpriteSheetMessage(
      onCreateSpriteSheetMessage,
    );
  } catch (ex) {
    // TODO: Display message modal.
    console.log(ex);
  }
}

function onCreateSpriteSheetMessage(message) {
  // TODO: Set message in message modal.
  console.log(message);
}

async function displayOpenFolderDialog(inputId) {
  const folderPath = await window.electronAPI.openFolder();
  document.getElementById(inputId).value = folderPath;
}
