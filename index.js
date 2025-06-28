#!/usr/bin/env node

import clear from "clear";

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
  addTask,
  rl,
  log,
} from "./utility/Functions.js";

// Main menu function
async function showMenu() {
  clear();
  displayTime();
  await showTaskCounters();
  log("");
  log("1 - View Tasks");
  log("2 - Add Task");
  log("3 - Delete Task");
  log("4 - Set Task to Finished");
  log("5 - Set Task to InProgress");
  log("6 - Exit");
  log("");

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
      log("Goodbye!");
      rl.close();
      return;
    default:
      log("Invalid choice.");
      await pauseAndReturn();
  }
  await showMenu();
}

// Helper to pause before returning to menu
await new Promise((res) => setTimeout(res, 1500));

// Entrypoint
await showBanner();
await checkFile();
await showMenu();
