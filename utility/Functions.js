import fs from "fs";
import chalk from "chalk";
import { scriptStructure } from "./Structure.js";
import { formatISO } from "date-fns";

const log = console.log;

let date = formatISO(new Date(), {
  representation: "date",
});

async function checkFile() {
  try {
    await fs.access(scriptStructure.filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // if file does not exist create it
        fs.writeFile(scriptStructure.filePath, "", (err) => {
          if (err) throw err;
          console.log("Tasks File created successfully.");
        });
      } else {
        console.log("Tasks File already exists. No action taken.");
      }
    });
  } catch (err) {
    log(err);
  }
}

function taskStatus() {
  log(chalk.bold("Total Tasks:", scriptStructure.tasks["All Tasks"].length));
  log(
    chalk.bold(
      "Finished Tasks:",
      scriptStructure.tasks["Finished Tasks"].length
    )
  );
  log(
    chalk.bold(
      "InProgress Tasks:",
      scriptStructure.tasks["inProgress Tasks"].length
    )
  );
  log(
    chalk.bold(
      "UnFinished Tasks:",
      scriptStructure.tasks["UnFinished Tasks"].length
    )
  );
}

function homeOptions() {
  let i = 1;
  Object.entries(scriptStructure.options).forEach(([key]) => {
    log(chalk.bold(`${i} - ${key}`));
    i++;
  });
}

function logOptions(num) {
  let i = 1;
  if (num === "1") {
    Object.entries(scriptStructure.options["Task Options"]).forEach(
      ([key, value]) => {
        log(chalk.bold(`${key} - ${value}`));
        i++;
      }
    );
  }
  if (num === "2") {
    Object.entries(scriptStructure.options["Edit Options"]).forEach(
      ([key, value]) => {
        log(chalk.bold(`${key} - ${value}`));
        i++;
      }
    );
  }
}

function displayTime() {
  log(chalk.bold("Task Tracker CLI App", "|||", "Time:", date));
}

export { checkFile, taskStatus, homeOptions, logOptions, displayTime };
