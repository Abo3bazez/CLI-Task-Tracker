#!/usr/bin/env node

import chalk from "chalk";
import Readline from "readline/promises";
import clear from "clear";
import fs from "fs/promises";
import { stdin as input, stdout as output } from "process";
import { scriptStructure } from "./utility/Structure.js";
import figlet from "figlet";

import {
  checkFile,
  taskStatus,
  logOptions,
  homeOptions,
  displayTime,
} from "./utility/Functions.js";

const log = console.log;
const rl = Readline.createInterface({ input, output });
const TASKS_FILE = scriptStructure.filePath;

// Show "task tracker" banner at startup for 2 seconds
async function showBanner() {
  clear();
  console.log(
    figlet.textSync("task tracker", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  );
  await new Promise((res) => setTimeout(res, 2000));
}

// --- Utility functions for file operations ---
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// --- Task Management Functions ---
async function addTask() {
  clear();
  log(chalk.green("Add a new task"));
  const title = await rl.question("Task title: ");
  if (!title.trim()) {
    log(chalk.red("Task title cannot be empty."));
    await pauseAndReturn();
    return;
  }
  const tasks = await loadTasks();
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    status: "UnFinished",
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  log(chalk.green("Task added!"));
  await pauseAndReturn();
}

async function viewTasks() {
  clear();
  log(chalk.green("All Tasks:"));
  const tasks = await loadTasks();
  if (tasks.length === 0) {
    log(chalk.yellow("No tasks found."));
  } else {
    tasks.forEach((task, idx) => {
      log(`${idx + 1}. ${task.title} [${task.status}] (ID: ${task.id})`);
    });
  }
  log(chalk.blue("\nPress Enter to return to the menu..."));
  await rl.question("");
  // No pauseAndReturn here
}

async function deleteTask() {
  clear();
  const tasks = await loadTasks();
  if (tasks.length === 0) {
    log(chalk.yellow("No tasks to delete."));
    await pauseAndReturn();
    return;
  }
  log(chalk.green("Delete a Task:"));
  tasks.forEach((task, idx) => {
    log(`${idx + 1}. ${task.title} [${task.status}]`);
  });
  const num = await rl.question("Enter task number to delete: ");
  const idx = parseInt(num) - 1;
  if (isNaN(idx) || idx < 0 || idx >= tasks.length) {
    log(chalk.red("Invalid task number."));
    await pauseAndReturn();
    return;
  }
  const removed = tasks.splice(idx, 1);
  await saveTasks(tasks);
  log(chalk.green(`Deleted: ${removed[0].title}`));
  await pauseAndReturn();
}

async function finishTask() {
  clear();
  const tasks = await loadTasks();
  // Only allow finishing tasks that are UnFinished
  const unfinished = tasks.filter((t) => t.status === "UnFinished");
  if (unfinished.length === 0) {
    log(chalk.yellow("No unfinished tasks."));
    await pauseAndReturn();
    return;
  }
  log(chalk.green("Set Task to Finished:"));
  unfinished.forEach((task, idx) => {
    log(`${idx + 1}. ${task.title} [${task.status}]`);
  });
  const num = await rl.question("Enter task number to finish: ");
  const idx = parseInt(num) - 1;
  if (isNaN(idx) || idx < 0 || idx >= unfinished.length) {
    log(chalk.red("Invalid task number."));
    await pauseAndReturn();
    return;
  }
  const task = unfinished[idx];
  const realIdx = tasks.findIndex((t) => t.id === task.id);
  tasks[realIdx].status = "Finished";
  await saveTasks(tasks);
  log(chalk.green(`Task "${task.title}" marked as Finished.`));
  await pauseAndReturn();
}

async function inProgressTask() {
  clear();
  const tasks = await loadTasks();
  const notInProgress = tasks.filter((t) => t.status !== "InProgress");
  if (notInProgress.length === 0) {
    log(chalk.yellow("No tasks to set as InProgress."));
    await pauseAndReturn();
    return;
  }
  log(chalk.green("Set Task to InProgress:"));
  notInProgress.forEach((task, idx) => {
    log(`${idx + 1}. ${task.title} [${task.status}]`);
  });
  const num = await rl.question("Enter task number to set InProgress: ");
  const idx = parseInt(num) - 1;
  if (isNaN(idx) || idx < 0 || idx >= notInProgress.length) {
    log(chalk.red("Invalid task number."));
    await pauseAndReturn();
    return;
  }
  const task = notInProgress[idx];
  const realIdx = tasks.findIndex((t) => t.id === task.id);
  tasks[realIdx].status = "InProgress";
  await saveTasks(tasks);
  log(chalk.green(`Task "${task.title}" marked as InProgress.`));
  await pauseAndReturn();
}

// Add this function before showMenu()
async function showTaskCounters() {
  const tasks = await loadTasks();
  const total = tasks.length;
  const finished = tasks.filter((t) => t.status === "Finished").length;
  const inProgress = tasks.filter((t) => t.status === "InProgress").length;
  const unfinished = tasks.filter((t) => t.status === "UnFinished").length;

  log(
    chalk.cyan(
      `Total: ${total} | Finished: ${finished} | InProgress: ${inProgress} | UnFinished: ${unfinished}`
    )
  );
}

// --- Main Menu ---
async function showMenu() {
  clear();
  displayTime();
  await showTaskCounters(); // <-- Add this line
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

// Helper to pause before returning to menu
async function pauseAndReturn() {
  await new Promise((res) => setTimeout(res, 1500));
}

await showBanner();
await checkFile();
await showMenu();
