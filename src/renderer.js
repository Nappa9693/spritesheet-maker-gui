const SRC_DIR_ID = "sourceDirectory";
const DST_DIR_ID = "destinationDirectory";
const FILE_NAME_ID = "fileName";
const FILE_EXT_ID = "fileExtension";
const COL_COUNT_ID = "columnCount";

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

    if (!isInputValid()) {
      processingSpriteSheetRequest = false;
      return;
    }

    showMessageModal();
    await window.spriteSheetMaker.createSpriteSheet(
      getSourceDirectory(),
      `${getDestinationDirectory()}/${getFileNameWithExtension()}`,
      getColumnCount(),
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

  const sourceDirectory = getSourceDirectory();
  const destinationDirectory = getDestinationDirectory();
  const fileName = getFileName();
  const columnCount = getColumnCount();

  if ((sourceDirectory ?? "").trim() === "") {
    addErrorClass(SRC_DIR_ID);
    inputsValid = false;
  } else {
    removeErrorClass(SRC_DIR_ID);
  }

  if ((destinationDirectory ?? "").trim() === "") {
    addErrorClass(DST_DIR_ID);
    inputsValid = false;
  } else {
    removeErrorClass(DST_DIR_ID);
  }

  if ((fileName ?? "").trim() === "") {
    addErrorClass(FILE_NAME_ID);
    inputsValid = false;
  } else {
    removeErrorClass(FILE_NAME_ID);
  }

  if (Number.isNaN(columnCount)) {
    addErrorClass(COL_COUNT_ID);
    inputsValid = false;
  } else {
    removeErrorClass(COL_COUNT_ID);
  }

  return inputsValid;
}

function getSourceDirectory() {
  return document.getElementById(SRC_DIR_ID).value;
}

function getDestinationDirectory() {
  return document.getElementById(DST_DIR_ID).value;
}

function getFileName() {
  return document.getElementById(FILE_NAME_ID).value;
}

function getFileNameWithExtension() {
  return getFileName() + document.getElementById(FILE_EXT_ID).value;
}

function getColumnCount() {
  return parseInt(document.getElementById(COL_COUNT_ID).value);
}

function addErrorClass(elementId) {
  const element = document.getElementById(elementId);
  element.classList.add("error-input");
}

function removeErrorClass(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove("error-input");
}
