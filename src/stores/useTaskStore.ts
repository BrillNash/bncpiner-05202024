import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Task } from '@/types/task.d.ts'
import { uuid } from 'vue-uuid'

export const useTaskStore = defineStore('tasks', () => {
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

  const taskText = ref('');
  const description = ref('');
  const status = ref('todo');

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

  return { 
    tasks, 
    taskText,
    description,
    status,
    addTask, 
    editTask, 
    deleteTask }
})
