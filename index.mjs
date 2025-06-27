#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import Readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { formatISO } from "date-fns";
import promptSync from "prompt-sync";
import clear from "clear";

const prompt = promptSync();
const log = console.log;

const rl = Readline.createInterface({ input, output });

let scriptStructure = {
  filePath: "tasks.json",
  options: {
    "Task Options": {
      1: "See All Tasks",
      2: "See Finished Tasks",
      3: "See UnFinished Tasks",
      4: "See InProgress Tasks",
    },
    "Edit Options": {
      1: "Add Task",
      2: "Edit Task",
      3: "Set Task To Finished",
      4: "Set Task To InProgress",
    },
  },
  tasks: {
    "All Tasks": [],
    "Finished Tasks": [],
    "UnFinished Tasks": [],
    "inProgress Tasks": [],
  },
};

let date = formatISO(new Date(), {
  representation: "date",
});

async function run() {
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

run();

function taskStatus() {
  log(chalk.bold("Total Tasks:", scriptStructure.tasks.allTasks.length));
  log(
    chalk.bold("Finished Tasks:", scriptStructure.tasks.finishedTasks.length)
  );
  log(
    chalk.bold(
      "InProgress Tasks:",
      scriptStructure.tasks.inProgressTasks.length
    )
  );
  log(
    chalk.bold(
      "UnFinished Tasks:",
      scriptStructure.tasks.unFinishedTasks.length
    )
  );
}

let timeOutID = setTimeout(() => {
  clear();
  log(chalk.bold("Task Tracker CLI App", "|||", "Time:", date));
  log(chalk.bgWhite.bold("Task Status"));
  taskStatus();
  clearTimeout(timeOutID);
  log(chalk.bgWhite.bold("Options"));
  let i = 1;
  Object.entries(scriptStructure.options).forEach(([key, value]) => {
    log(chalk.bold(`${i} - ${key}`));
    i++;
  });
}, 3000);

rl.on("line", (input) => {
  if (input === 1) {
    clear();
    log;
  }
});
