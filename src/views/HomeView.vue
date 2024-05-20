<template>
  <main>
    <main class="board">
      <section class="column" id="todo">
        <h2>To Do</h2>
        <ul class="tasks" id="todo-tasks">
          <li v-for="(task, index) in tasks['todo']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('todo', task)">Edit</button>
            <button @click="deleteTask('todo', task.id)">Delete</button>
          </li>
        </ul>
      </section>
      <section class="column" id="in-progress">
        <h2>In Progress</h2>
        <ul class="tasks" id="in-progress-tasks">
          <li v-for="(task, index) in tasks['in-progress']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('in-progress', task)">Edit</button>
            <button @click="deleteTask('in-progress', task.id)">Delete</button>
          </li>
        </ul>
      </section>
      <section class="column" id="done">
        <h2>Done</h2>
        <ul class="tasks" id="done-tasks">
          <li v-for="(task, index) in tasks['done']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('done', task)">Edit</button>
            <button @click="deleteTask('done', task.id)">Delete</button>
          </li>
        </ul>
      </section>
    </main>
    <form v-if="!isEditMode" @submit.prevent="addTask">
      <label for="task">Task:</label>
      <input type="text" id="task" name="task" v-model="taskText" maxlength="250" required>
      <label for="description">Description:</label>
      <textarea type="text" id="description" name="description" v-model="description" maxlength="1000"/>
      <label for="status">Status:</label>
      <select id="status" name="status" v-model="status">
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
    <form v-else @submit.prevent="formSubmit">
      <label for="task">Task:</label>
      <input type="text" id="task" name="task" v-model="taskText" maxlength="250" required>
      <label for="description">Description:</label>
      <textarea type="text" id="description" name="description" v-model="description" maxlength="1000"/>
      <label for="status">Status:</label>
      <select id="status" name="status" v-model="status">
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Edit Task</button>
      <button type="button" @click="clearForm">Cancel</button>
    </form>
  </main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Task from '@/types/task.d.ts'
  import { uuid } from 'vue-uuid'

  const isEditMode = ref(false)
  const itemToEdit: Ref<{
    column: string, 
    index: number, 
    task: Task
  } | undefined> = ref(undefined)

  const tasks = ref<{
    'todo': Task[],
    'in-progress': Task[],
    'done': Task[]
  }>({
    'todo': [
      { id: uuid.v4(), name: 'Task 1', description: 'Description for Task 1', status: 'todo' },
      { id: uuid.v4(), name: 'Task 2', description: 'Description for Task 2', status: 'todo' },
      { id: uuid.v4(), name: 'Task 3', status: 'todo' }
    ],
    'in-progress': [
      { id: uuid.v4(), name: 'Task 4', description: 'Description for Task 4', status: 'in-progress' },
      { id: uuid.v4(), name: 'Task 5', description: 'Description for Task 5', status: 'in-progress' },
      { id: uuid.v4(), name: 'Task 6', status: 'in-progress' }
    ],
    'done': [
      { id: uuid.v4(), name: 'Task 7', description: 'Description for Task 7', status: 'done' },
      { id: uuid.v4(), name: 'Task 8', description: 'Description for Task 8', status: 'done' },
      { id: uuid.v4(), name: 'Task 9', status: 'done' },
      { id: uuid.v4(), name: 'Task 10', description: 'Description for Task 10', status: 'done' }
    ]
  });

  // const tasks = ref<Task[]>([]);
  // const todoList = computed<Task[]>(() => {
  //   return tasks.value.filter((t) => t.status === 'TODO');
  // });
  // const inProgressList = computed<Task[]>(() => {
  //   return tasks.value.filter((t) => t.status === 'IN_PROGRESS');
  // });
  // const doneList = computed<Task[]>(() => {
  //   return tasks.value.filter((t) => t.status === 'DONE');
  // });

  const taskText = ref('');
  const description = ref('');
  const status = ref('todo');

  function clearForm() {
    itemToEdit.value = undefined
    isEditMode.value = false
    taskText.value = ''
    description.value = ''
    status.value = 'todo'
  }

  function showEditForm(column: string, task: Task) {
    isEditMode.value = true
    taskText.value = task.name
    description.value = task.description
    status.value = task.status
    const taskIndex = tasks.value[column].findIndex(t => t.id === task.id)
    itemToEdit.value = {
      column, 
      taskIndex, 
      task
    }
  } 

  function formSubmit(){
    if(itemToEdit){
       editTask(itemToEdit.value.column, {...itemToEdit.value.task,
        name: taskText.value,
        description: description.value,
        status: status.value
      })
    }
    clearForm()
  }

  function addTask() {
    const task = {
      id: uuid.v4(),
      name: taskText.value.trim(),
      status: status.value,
      description: description.value

    };
    
    tasks.value[status.value].push(task);
    taskText.value = ''
    description.value = '';
  }

  function editTask(column: string, task: Task) {
    const taskIndex = tasks.value[column].findIndex(t => t.id === task.id)
    tasks.value[status.value].push(task)
    tasks.value[column].splice(taskIndex, 1)
  }

  function deleteTask(column: string, id: string) {
    const taskIndex = tasks.value[column].findIndex(task => task.id === id)
    if(taskIndex !== -1) {
      tasks.value[column].splice(taskIndex, 1);
    }
  }
</script>