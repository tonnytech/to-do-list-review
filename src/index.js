import './index.css';
import getBookStorage from './modules/getStorage.js';

// Declaring variables

const myListItems = document.querySelector('.to-do-list');
const toDoItem = document.getElementById('toDoItem');
const clearAllBtn = document.querySelector('.my-button');

// Recalculate index

const recalculateIndex = () => {
  const storage = getBookStorage();
  storage.forEach((item, itemIndex) => {
    item.index = itemIndex;
  });
  localStorage.setItem('taskList', JSON.stringify(storage));
};

// Editing complete status

const completeStatus = (indexToChange, newStatus) => {
  const storage = getBookStorage();
  storage.forEach((stored) => {
    if (stored.index === parseInt(indexToChange, 10)) {
      stored.completed = newStatus;
    }
  });
  localStorage.setItem('taskList', JSON.stringify(storage));
  recalculateIndex();
};

// Remove task from local storage

const removeFromStorage = (listIndex) => {
  const tasks = getBookStorage();
  const newTaskArray = tasks.filter(
    (task) => task.index !== parseInt(listIndex, 10),
  );
  localStorage.setItem('taskList', JSON.stringify(newTaskArray));
  recalculateIndex();
};

// Editing tasks

const EditTask = (IndexToEdit, newValue) => {
  const storage = getBookStorage();
  storage.forEach((stored) => {
    if (stored.index === parseInt(IndexToEdit, 10)) {
      stored.description = newValue;
    }
  });
  localStorage.setItem('taskList', JSON.stringify(storage));
  recalculateIndex();
};

// Generating lists of tasks

const AddToDoListItems = (listItem) => {
  // Creating a list item

  const mainElement = document.createElement('li');
  mainElement.classList.add('to-do-pop');
  mainElement.dataset.id = listItem.index;

  // Creating  a checkbox

  const doneCheckbox = document.createElement('input');
  doneCheckbox.setAttribute('type', 'checkbox');
  doneCheckbox.classList.add('my-checkbox');
  doneCheckbox.dataset.complete_list = listItem.index;
  mainElement.appendChild(doneCheckbox);

  doneCheckbox.addEventListener('click', (e) => {
    const IndexToEdit = e.target.dataset.complete_list;
    if (doneCheckbox.checked === true) {
      completeStatus(IndexToEdit, true);
    } else {
      completeStatus(IndexToEdit, false);
    }
  });

  // Creating an input type

  const toDoInput = document.createElement('INPUT');
  toDoInput.setAttribute('type', 'input');
  toDoInput.setAttribute('readonly', true);
  toDoInput.setAttribute('value', listItem.description);
  toDoInput.classList.add('to-do-input');
  toDoInput.dataset.complete_list = listItem.index;
  mainElement.appendChild(toDoInput);

  // Handling editing task event
  toDoInput.addEventListener('click', (e) => {
    toDoInput.removeAttribute('readonly');
    const IndexToEdit = e.target.dataset.complete_list;
    toDoInput.addEventListener('change', () => {
      const updatedTask = toDoInput.value;
      EditTask(IndexToEdit, updatedTask);
      toDoInput.setAttribute('readonly', true);
    });
  });

  // Creating a delete icon

  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fa-solid');
  deleteBtn.id = listItem.index;
  deleteBtn.classList.add('fa-ellipsis-vertical');

  // Handling delete Event

  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (deleteBtn.classList.contains('fa-trash-can')) {
      deleteBtn.parentElement.remove();
      removeFromStorage(e.target.id);
    } else {
      deleteBtn.classList.remove('fa-ellipsis-vertical');
      deleteBtn.classList.add('fa-trash-can');
    }
  });

  mainElement.appendChild(deleteBtn);

  return mainElement;
};

// Appending the generated list to the html file

const appendItems = () => {
  myListItems.innerHTML = '';
  const storage = getBookStorage();
  storage.forEach((item) => {
    const toDoItem = AddToDoListItems(item);
    myListItems.appendChild(toDoItem);
  });
};

// clear input

const clearInputs = () => {
  toDoItem.value = '';
};

// Adding tasks to local storage

const addToStorage = (item) => {
  const storage = getBookStorage();
  storage.push(item);
  localStorage.setItem('taskList', JSON.stringify(storage));
  recalculateIndex();
  clearInputs();
};

// A function to add a new task

const addTask = (task, complete = false, index) => {
  const toDoTask = task;
  const toDoComplete = complete;
  const toDoIndex = index;

  const newTask = {
    completed: toDoComplete,
    index: toDoIndex,
    description: toDoTask,
  };

  addToStorage(newTask);
  appendItems();
};

// Adding a new task from the input in the index.html file

const addEvent = () => {
  const taskStorage = getBookStorage();
  if (!toDoItem.value) {
    return;
  }
  addTask(toDoItem.value, false, taskStorage.length);
};

toDoItem.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addEvent();
  }
});

// Handling clear all event

const clearAll = () => {
  const storage = getBookStorage();
  const newTaskArray = storage.filter((task) => task.completed === false);
  localStorage.setItem('taskList', JSON.stringify(newTaskArray));
  recalculateIndex();
};

clearAllBtn.addEventListener('click', () => {
  clearAll();
  appendItems();
});

const refreshStatus = () => {
  const storage = getBookStorage();
  storage.forEach((stored) => {
    stored.completed = false;
  });
  localStorage.setItem('taskList', JSON.stringify(storage));
  recalculateIndex();
};

window.addEventListener('load', () => {
  refreshStatus();
  appendItems();
});
