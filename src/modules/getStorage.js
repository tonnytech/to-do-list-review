// Get data from local storage

const getBookStorage = () => {
  let taskListStorage;
  if (JSON.parse(localStorage.getItem('taskList')) === null) {
    taskListStorage = [];
  } else {
    taskListStorage = JSON.parse(localStorage.getItem('taskList'));
  }
  return taskListStorage;
};

export default getBookStorage;