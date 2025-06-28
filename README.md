# Task Tracker CLI

A simple and interactive command-line application to help you track your tasks.

---

## Features

- **Add Task:**  
  Quickly add new tasks with a title. All new tasks start as `UnFinished`.

- **View Tasks:**  
  See a list of all your tasks, including their status (`UnFinished`, `InProgress`, `Finished`).

- **Delete Task:**  
  Remove tasks you no longer need from your list.

- **Set Task to Finished:**  
  Mark any `UnFinished` task as `Finished`.

- **Set Task to InProgress:**  
  Mark any task as `InProgress` to indicate you are currently working on it.

- **Task Status Counters:**  
  Instantly see counters for Total, Finished, InProgress, and UnFinished tasks in the main menu.

- **Easy Navigation:**  
  Simple menu-driven interface with clear options and prompts.

---

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Run the app:**
   ```
   npx ./         # or: node index.js
   ```

   Or, install globally:
   ```
   npm install -g .
   task-tracker
   ```

---

## Usage

- Follow the on-screen menu to add, view, delete, or update your tasks.
- Press the number corresponding to your desired action and follow the prompts.

---

## Technologies Used

- [Node.js](https://nodejs.org/)
- [chalk](https://www.npmjs.com/package/chalk)
- [figlet](https://www.npmjs.com/package/figlet)
- [clear](https://www.npmjs.com/package/clear)
- [date-fns](https://www.npmjs.com/package/date-fns)

---

## License

ISC

---

## Project Source

This project is based on the [Task Tracker project from roadmap.sh](https://roadmap.sh/projects/task-tracker).

---