#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";

import { scriptStructure } from "./utility/Structure.js";

import {
  checkFile,
  displayTime,
  showBanner,
  showTaskCounters,
  inProgressTask,
  pauseAndReturn,
  finishTask,
  deleteTask,
  viewTasks,
  rl,
  log,
  addTask,
} from "./utility/Functions.js";

const TASKS_FILE = scriptStructure.filePath;

// Main Menu
async function showMenu() {
  clear();
  displayTime();
  await showTaskCounters();
  log(chalk.bgWhite.bold("Options"));
  log(chalk.bold("1 - View Tasks"));
  log(chalk.bold("2 - Add Task"));
  log(chalk.bold("3 - Delete Task"));
  log(chalk.bold("4 - Set Task to Finished"));
  log(chalk.bold("5 - Set Task to InProgress"));
  log(chalk.bold("6 - Exit"));

  const choice = await rl.question("Choose an option: ");
  switch (choice.trim()) {
    case "1":
      await viewTasks();
      break;
    case "2":
      await addTask();
      break;
    case "3":
      await deleteTask();
      break;
    case "4":
      await finishTask();
      break;
    case "5":
      await inProgressTask();
      break;
    case "6":
      log(chalk.green("Goodbye!"));
      rl.close();
      return;
    default:
      log(chalk.red("Invalid choice."));
      await pauseAndReturn();
  }
  await showMenu();
}

await showBanner();
await checkFile();
await showMenu();
