#!/usr/bin/env node

import chalk from "chalk";
import Readline from "readline/promises";
import clear from "clear";

import { stdin as input, stdout as output } from "process";

import {
  checkFile,
  taskStatus,
  backToOptions,
  logOptions,
  homeOptions,
  displayTime,
} from "./utility/Functions.js";

const log = console.log;

const rl = Readline.createInterface({ input, output });

checkFile();

let timeOutID = setTimeout(() => {
  clear();
  displayTime();
  log(chalk.bgWhite.bold("Task Status"));
  taskStatus();
  clearTimeout(timeOutID);
  log(chalk.bgWhite.bold("Options"));
  homeOptions();
}, 1000);

rl.on("line", (input) => {
  if (input === "1") {
    clear();
    displayTime();
    logOptions("1");
  }
  if (input === "2") {
    clear();
    displayTime();
    logOptions("2");
  }
});
