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

  window.spriteSheetMaker.onCreateSpriteSheetErrorMessage(
    onCreateSpriteSheetErrorMessage,
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

    if (!isInputValid()) {
      processingSpriteSheetRequest = false;
      return;
    }

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
  addMessageToMessageModal(message, false);
}

function onCreateSpriteSheetErrorMessage(message) {
  addMessageToMessageModal(message, true);
}

async function displayOpenFolderDialog(inputId) {
  const folderPath = await window.electronAPI.openFolder();
  if (folderPath !== undefined && folderPath !== null) {
    document.getElementById(inputId).value = folderPath;
  }
}

function showMessageModal() {
  document.getElementById("messageModal").showModal();
}

function hideMessageModal() {
  document.getElementById("messageModal").close();
  resetMessageModal();
}

function addMessageToMessageModal(message, isError) {
  const messageModal = document.getElementById("messageModal");
  const paragraphElement = document.createElement("p");

  if (isError) {
    paragraphElement.classList.add("error-message");
  }

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

function isInputValid() {
  let inputsValid = true;

  const sourceDirectoryElement = document.getElementById("sourceDirectory");
  const destinationDirectoryElement = document.getElementById(
    "destinationDirectory",
  );
  const fileNameElement = document.getElementById("fileName");
  const columnCountElement = document.getElementById("columnCount");

  const sourceDirectory = sourceDirectoryElement.value;
  const destinationDirectory = destinationDirectoryElement.value;
  const fileName = fileNameElement.value;
  const columnCount = parseInt(columnCountElement.value);

  if (!(sourceDirectory !== null && sourceDirectory.trim() !== "")) {
    sourceDirectoryElement.classList.add("error-input");
    inputsValid = false;
  } else {
    sourceDirectoryElement.classList.remove("error-input");
  }

  if (!(destinationDirectory !== null && destinationDirectory.trim() !== "")) {
    destinationDirectoryElement.classList.add("error-input");
    inputsValid = false;
  } else {
    destinationDirectoryElement.classList.remove("error-input");
  }

  if (!(fileName !== null && fileName.trim() !== "")) {
    fileNameElement.classList.add("error-input");
    inputsValid = false;
  } else {
    fileNameElement.classList.remove("error-input");
  }

  if (Number.isNaN(columnCount)) {
    columnCountElement.classList.add("error-input");
    inputsValid = false;
  } else {
    columnCountElement.classList.remove("error-input");
  }

  return inputsValid;
}
