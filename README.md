This was a small learning project to pick up Electron, Electron Forge, and Vite. I had fun working on it and may or may not do more on it. That said you can use the application to create a spritesheet from multiple images. For example you export your animation frames from Krita and want to combine them into a spritesheet for usage in a game. With this app you can specify where the images are, where you want the output spritesheet, and a basic columns configuration (the rows are automatically calculated for you by the app based on the number of columns and images).

## To Run and create the distributable

First you will need to install [NodeJS](https://nodejs.org/en) in order to be able to run the commands below.
Note: This was developed using the NodeJS LTS version v22.14.0.

Next, download the source code and run the following commands while in the root directory with your terminal/CLI.

```
npm install
npm start
npm run make
```

The start command will run the app so you can test it out. The make command creates the executable which can be found in the out folder.

## Usage

Simply specify the source directory either by selecting the location with the Choose Directory button or pasting it into the text field. Do this step for the destination as well. Specify the file name. Select the desired file extension (default is .png). Specify the number of columns you wish to use for the spritesheet. Click create spritesheet and you will see some output showing the results or any errors that may have occurred. Assuming all went well you will see the spritesheet in the destination directory with the specified name.
