////////////////////////////
// CLASSES
////////////////////////////
// Task - Board, (* - 1)
class Task {
    constructor(textContent, boardId, id = generateRandomNumberBetween(1, 9999999).toString()) {
        this.id = id;
        this.boardId = boardId;
        this.textContent = textContent;
    }
}

class Board {
    constructor(name, id = generateRandomNumberBetween(1, 9999999).toString(), tasks = []) {
        this.id = id;
        this.name = name;
        this.tasks = tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }
}



////////////////////////////
// dom elements
////////////////////////////
const boards = document.querySelectorAll('.main__board');
const boardsArray = Array.from(boards);



////////////////////////////
// MAIN
////////////////////////////

// load tasks
const globalTasks = restoreTasks();

function main() {

    boards.forEach(board => {
        board.addEventListener('click', ev => {
            ev.preventDefault();
            if (ev.target.classList.contains('main__button-add')) {
                addButtonHandler(board);
            }
            else if (ev.target.classList.contains('main__button-save')) {
                saveButtonHandler(board, ev);
            }
        });

        board.addEventListener('dblclick', ev => {
            ev.preventDefault();
            if (ev.target.classList.contains('main__task-item')) {
                cliclToEdit(ev.target);
            }
        });

        function handleDragOver(ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }
        }

        function handleDrop(ev) {
            ev.preventDefault(); // stops the browser from redirecting.

            const dropZone = board.querySelector('.main__task-list');


            const taskId = ev.dataTransfer.getData('text');
            const taskElement = document.querySelector(`[data-task-id~="${taskId}"]`);
            taskElement.dataset.boardId = board.dataset.boardId;
            dropZone.append(taskElement);

            console.log('task:', taskElement.dataset.taskId);
            console.log('dropped in drop zone:', board.dataset.boardId);


            // update task board
            const task = globalTasks.find(task => task.id === taskElement.dataset.taskId);
            if (task) task.boardId = board.dataset.boardId;
            console.log(task);
        }


        board.addEventListener('dragover', handleDragOver);
        board.addEventListener('drop', handleDrop);

    });


    // save tasks to localstorage when unloading page
    saveTasks();

    //
    // listenForLocalstorageChanges();
}
//
main();











////////////////////////////
// functions definitions
////////////////////////////
function addButtonHandler(board) {
    toggleTaskForm(board);
}

function toggleTaskForm(board) {
    const taskForm = board.querySelector('.main__form-task');
    const textarea = taskForm.querySelector('.main__textarea');
    textarea.value = '';
    taskForm.classList.toggle('hidden');
}

function addTask(task) {
    // TODO

}

function saveButtonHandler(board, ev) {

    // get task value from FORM
    const taskForm = board.querySelector('.main__form-task');
    const value = taskForm.taskTextContent.value.trim();

    if (value) {
        // create task
        const task = new Task(value, board.dataset.boardId);
        // save task
        globalTasks.push(task);

        // add task to dom
        const tasksList = board.querySelector('.main__task-list');
        const taskElement = createTaskElement(task);
        tasksList.append(taskElement);
    }

    //
    toggleTaskForm(board);
}

function restoreTasks() {
    let tasks = [];
    // loadDummyTasks(tasks);

    //
    const localstoreData = localStorage.getItem('tasks');
    if (localstoreData) tasks = JSON.parse(localstoreData);

    // load boards
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        // addDoubleClickHandler(taskElement);


        const targetBoardElement = boardsArray.find(board => {
            return board.dataset.boardId === task.boardId;
        });


        const tasksListElement = targetBoardElement.querySelector('.main__task-list');
        if (tasksListElement) tasksListElement.append(taskElement);

    });

    //
    return tasks;
}

function saveTasks() {
    window.addEventListener('beforeunload', ev => {
        localStorage.setItem('tasks', JSON.stringify(globalTasks));
    });
}

////////////////////////////
// utilities
////////////////////////////

function generateRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('main__task-item');
    taskElement.textContent = task.textContent;
    taskElement.setAttribute('data-task-id', task.id);
    taskElement.setAttribute('draggable', true);

    addDragNDropFeaure(taskElement);

    return taskElement
}

function addDragNDropFeaure(taskElement) {
    function handleDragStart(ev) {
        this.style.opacity = '0.4';
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text', this.dataset.taskId);
    }

    function handleDragEnd(ev) {
        this.style.opacity = '1';
    }


    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
}

function cliclToEdit(taskElement) {
    const contenteditableIsEnabled = taskElement.getAttribute('contenteditable');

    if (contenteditableIsEnabled) {
        console.log('edit mode disabled');
        taskElement.classList.remove('main__task-item-edit-mode');
        taskElement.removeAttribute('contenteditable');

        // update task
        const taskId = taskElement.dataset.taskId;
        const newValue = taskElement.textContent;
        const taskToUpdate = globalTasks.find(task => task.id === taskId);
        taskToUpdate.textContent = newValue;

        console.log(globalTasks);
    }
    else {
        console.log('edit mode enabled');
        taskElement.classList.add('main__task-item-edit-mode');
        taskElement.setAttribute('contenteditable', 'true');
    }
}

function loadDummyTasks(tasks) {
    // tasks.push(new Task('do this', "1", "82133"));
    // tasks.push(new Task('do that', "1", "94353"));
    // tasks.push(new Task('do these', "2", "34345"));
    // tasks.push(new Task('do this', "3", "43943"));
    // tasks.push(new Task('do those', "4", "43943"));
    // tasks.push(new Task('do those and those', "4", "93244"));
    // tasks.push(new Task('do this and that', "4", "13452"));
}