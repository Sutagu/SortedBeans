import { create } from 'zustand';
import { queueWrite } from '../db/queueCache';
import { apiRequest } from '../utils/api';
import type { NewTask, Task, TaskFormData } from '../utils/types';

const API_URL = import.meta.env.VITE_TASK_API_URL;
interface TaskStore {
  tasks: Task[];
  taskFormData: TaskFormData[];
  refreshTaskContent: number;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<TaskFormData, 'id'>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (task: Omit<TaskFormData, 'id'>, EditId: number) => Promise<void>;
  editTask: (
    id: number,
    field: string,
    value: string | boolean | null
  ) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],
  refreshTaskContent: 0,
  fetchTasks: async () => {
    if (navigator.onLine) {
      try {
        console.log('Fetching Tasks');
        const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
        set({ tasks: data });
      } catch (error) {
        console.error('Error when fetching tasks' + error);
      }
    } else {
      console.log('User is offline');
      set({ tasks: get().tasks });
    }
  },
  editTask: async (id, field, value) => {
    const editUrl = `${API_URL}/${id}`;
    const editTaskBody = { field, value };
    console.log(editTaskBody);
    set({
      tasks: get().tasks.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
      refreshTaskContent: get().refreshTaskContent + 1,
    });
    if (value === null) {
      console.error(`Field ${field} has NULL value`);
      return;
    }
    if (!navigator.onLine) {
      await queueWrite(editUrl, 'PATCH', editTaskBody);
      return;
    }
    try {
      await apiRequest<void>(editUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTaskBody),
      });
    } catch (error) {
      console.error(`Error when updating Task ${field}: `, error);
      await queueWrite(editUrl, 'PATCH', editTaskBody);
    }
  },

  addTask: async (task: NewTask) => {
    const optimisticTask: Task = {
      ...task,
      id: Date.now(),
      completed: false,
      created_at: new Date().toString(),
    };
    if (!navigator.onLine) {
      await queueWrite(API_URL, 'POST', task);
      set((state) => ({
        tasks: [...state.tasks, optimisticTask],
        refreshTaskContent: state.refreshTaskContent + 1,
      }));
      return;
    }
    try {
      const newTask = await apiRequest<Task>(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      set((state) => ({
        tasks: [...get().tasks, newTask],
        refreshTaskContent: state.refreshTaskContent + 1,
      }));
    } catch (error) {
      console.error('Error when adding Task to DB' + error);
      await queueWrite(API_URL, 'POST', task);
      set((state) => ({
        tasks: [...state.tasks, optimisticTask],
        refreshTaskContent: state.refreshTaskContent + 1,
      }));
    }
  },
  updateTask: async (task, EditId) => {
    const updateTaskUrl = `${API_URL}/update/${EditId}`;
    set({
      tasks: get().tasks.filter((t) => (t.id == EditId ? task : t)),
      refreshTaskContent: get().refreshTaskContent + 1,
    });
    if (!navigator.onLine) {
      //If user is not connected write to queue then prevent attempting to server
      await queueWrite(updateTaskUrl, 'PATCH', task);
      return;
    }
    try {
      await apiRequest<Task>(updateTaskUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.error('Error when updating Task' + error);
      //Write to queue if server fails and optimistically update task
      await queueWrite(updateTaskUrl, 'PATCH', task);
    }
  },
  deleteTask: async (id) => {
    const deleteTaskUrl = `${API_URL}/${id}`;

    set({ tasks: get().tasks.filter((t) => t.id != id) });
    if (!navigator.onLine) {
      await queueWrite(deleteTaskUrl, 'DELETE');
      return;
    }
    try {
      await apiRequest<void>(deleteTaskUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error when deleting Task', error);
      await queueWrite(deleteTaskUrl, 'DELETE');
    }
  },
}));
