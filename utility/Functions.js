import fs from "fs/promises";
import chalk from "chalk";
import { scriptStructure } from "./Structure.js";
import { formatISO } from "date-fns";
import clear from "clear";
import figlet from "figlet";
import Readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
const rl = Readline.createInterface({ input, output });
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

function displayTime() {
  log(chalk.bold("Task Tracker CLI App", "|||", "Time:", date));
}

async function loadTasks() {
  try {
    const data = await fs.readFile(scriptStructure.filePath, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveTasks(tasks) {
  await fs.writeFile(scriptStructure.filePath, JSON.stringify(tasks, null, 2));
}

async function pauseAndReturn() {
  await new Promise((res) => setTimeout(res, 1500));
}

async function showTaskCounters() {
  const tasks = await loadTasks();
  const total = tasks.length;
  const finished = tasks.filter((t) => t.status === "Finished").length;
  const inProgress = tasks.filter((t) => t.status === "InProgress").length;
  const unfinished = tasks.filter((t) => t.status === "UnFinished").length;

  console.log(
    chalk.cyan(
      `Total: ${total} | Finished: ${finished} | InProgress: ${inProgress} | UnFinished: ${unfinished}`
    )
  );
}

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
    status: "UnFinished", // Default state for new tasks
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  log(chalk.green("Task added!"));
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

export {
  checkFile,
  displayTime,
  loadTasks,
  saveTasks,
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
};
