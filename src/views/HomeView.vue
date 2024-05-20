<template>
  <main>
    <form v-if="!isEditMode" @submit.prevent="store.addTask">
      <label for="task">Task:</label>
      <input type="text" id="task" name="task" v-model="taskText" maxlength="250" required>
      <label for="description">Description:</label>
      <textarea rows="5" type="text" id="description" name="description" v-model="description" maxlength="1000"/>
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
      <textarea rows="5" type="text" id="description" name="description" v-model="description" maxlength="1000"/>
      <label for="status">Status:</label>
      <select id="status" name="status" v-model="status">
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Edit Task</button>
      <button type="button" @click="clearForm">Cancel</button>
    </form>
    <div class="board">
      <section class="column" id="todo">
        <h2>To Do</h2>
        <ul class="tasks" id="todo-tasks">
          <li v-for="(task, index) in tasks['todo']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <hr/>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('todo', task)">Edit</button>
            <button @click="store.deleteTask('todo', task.id)">Delete</button>
          </li>
        </ul>
      </section>
      <section class="column" id="in-progress">
        <h2>In Progress</h2>
        <ul class="tasks" id="in-progress-tasks">
          <li v-for="(task, index) in tasks['in-progress']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <hr/>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('in-progress', task)">Edit</button>
            <button @click="store.deleteTask('in-progress', task.id)">Delete</button>
          </li>
        </ul>
      </section>
      <section class="column" id="done">
        <h2>Done</h2>
        <ul class="tasks" id="done-tasks">
          <li v-for="(task, index) in tasks['done']" :key="index" class="task">
            <strong class="name">{{ task.name }}</strong>
            <hr/>
            <p class="description">{{ task.description }}</p>
            <button @click="showEditForm('done', task)">Edit</button>
            <button @click="store.deleteTask('done', task.id)">Delete</button>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia'
  import Task from '@/types/task.d.ts'
  import { useTaskStore } from '@/stores/useTaskStore.ts'

  const isEditMode = ref(false)
  const itemToEdit: Ref<{
    column: string, 
    index: number, 
    task: Task
  } | undefined> = ref(undefined)

  const store = useTaskStore()
  const { tasks, taskText, description, status } = storeToRefs(store)

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
       store.editTask(itemToEdit.value.column, {...itemToEdit.value.task,
        name: taskText.value,
        description: description.value,
        status: status.value
      })
    }
    clearForm()
  }
</script>