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
  document
    .getElementById("messageModalCloseButton")
    .addEventListener("click", hideMessageModal);

  window.spriteSheetMaker.onCreateSpriteSheetMessage(
    onCreateSpriteSheetMessage,
  );
});

let processingSpriteSheetRequest = false;

async function createSpriteSheet() {
  if (processingSpriteSheetRequest) {
    return;
  }
  try {
    processingSpriteSheetRequest = true;
    const sourceDirectory = document.getElementById("sourceDirectory").value;
    const destinationDirectory = document.getElementById(
      "destinationDirectory",
    ).value;
    const fileName = document.getElementById("fileName").value;
    const columnCount = parseInt(document.getElementById("columnCount").value);

    // TODO: Add validation.

    showMessageModal();
    await window.spriteSheetMaker.createSpriteSheet(
      sourceDirectory,
      `${destinationDirectory}/${fileName}`,
      columnCount,
    );
  } catch (ex) {
    addMessageToMessageModal(ex);
  }

  processingSpriteSheetRequest = false;
}

function onCreateSpriteSheetMessage(message) {
  addMessageToMessageModal(message);
}

async function displayOpenFolderDialog(inputId) {
  const folderPath = await window.electronAPI.openFolder();
  document.getElementById(inputId).value = folderPath;
}

function showMessageModal() {
  document.getElementById("messageModal").showModal();
}

function hideMessageModal() {
  document.getElementById("messageModal").close();
  resetMessageModal();
}

function addMessageToMessageModal(message) {
  const messageModal = document.getElementById("messageModal");
  const paragraphElement = document.createElement("p");

  paragraphElement.innerText = message;
  messageModal.appendChild(paragraphElement);
}

function resetMessageModal() {
  const messageModal = document.getElementById("messageModal");
  let paragraphElements = messageModal.querySelectorAll("p");

  paragraphElements.forEach((element) => {
    messageModal.removeChild(element);
  });
}
