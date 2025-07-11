const fs = require("node:fs");
const { Jimp } = require("jimp");

exports.createSpriteSheet = async (
  webContents,
  srcDirectory,
  destination,
  columnsCount,
) => {
  try {
    // Get files to combine.
    const files = fs.readdirSync(`${srcDirectory}/`).sort();

    webContents.send(
      "create-spritesheet-message",
      `${files.length} images found in specified directory...`,
    );

    // Iterate through the images. First image will dictate the width
    // and height of each frame in the spritesheet and the dimensions
    // of the spritesheet.
    let imageWidth = 0;
    let imageHeight = 0;
    let spritesheet = null;

    let currentColumn = 0;
    let currentRow = 0;
    const rowCount =
      Math.round(files.length / columnsCount) + (files.length % columnsCount);

    webContents.send(
      "create-spritesheet-message",
      `Columns: ${columnsCount}, Calculated rows: ${rowCount}`,
    );
    webContents.send(
      "create-spritesheet-message",
      "Combining images into spritesheet...",
    );
    for (let i = 0; i < files.length - (files.length % columnsCount); i++) {
      const image = await Jimp.read(`${srcDirectory}/${files[i]}`);

      if (i === 0) {
        imageWidth = image.width;
        imageHeight = image.height;
        spritesheet = new Jimp({
          width: imageWidth * columnsCount,
          height: imageHeight * rowCount,
          color: 0x00000000,
        });

        webContents.send(
          "create-spritesheet-message",
          `Initialized spritesheet with dimensions ${spritesheet.width} x ${spritesheet.height}`,
        );
      }

      if (currentColumn >= columnsCount) {
        currentColumn = 0;
        currentRow++;
      }

      const x = currentColumn * imageWidth;
      const y = currentRow * imageHeight;

      webContents.send(
        "create-spritesheet-message",
        `Appending image ${files[i]} to spritesheet...`,
      );
      spritesheet.composite(image, x, y);

      currentColumn++;
    }

    if (files.length % columnsCount > 0) {
      // There are some remaining images that did not
      // fit cleanly into the columnCount by imageCount / coulmnCount
      // dimensions.
      currentRow++;
      currentColumn = 0;
      const startingIndex = files.length - (files.length % columnsCount);

      for (let i = 0; i < files.length % columnsCount; i++) {
        const fileIndex = startingIndex + i;
        const image = await Jimp.read(`${srcDirectory}/${files[fileIndex]}`);
        const x = currentColumn * imageWidth;
        const y = currentRow * imageHeight;

        webContents.send(
          "create-spritesheet-message",
          `Appending image ${files[fileIndex]} to spritesheet...`,
        );
        spritesheet.composite(image, x, y);

        currentColumn++;
      }
    }

    await spritesheet.write(destination);

    webContents.send(
      "create-spritesheet-message",
      `Spritesheet ${destination} has been created.`,
    );
  } catch (err) {
    webContents.send("create-spritesheet-error-message", err);
  }
};
