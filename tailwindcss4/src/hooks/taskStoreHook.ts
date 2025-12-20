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
  editTask: (id: number, field: string, value: string | null) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],
  refreshTaskContent: 0,
  fetchTasks: async () => {
    if (navigator.onLine) {
      try {
        const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
        set({ tasks: data });
      } catch (error) {
        console.error('Error when fetching tasks' + error);
      }
    } else {
      console.log('User is offline');
    }
  },
  editTask: async (id, field, value) => {
    if (value === null) {
      console.error(`Field ${field} has NULL value`);
      return;
    }
    try {
      await apiRequest<void>(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, [field]: value } : t
        ),
      });
    } catch (error) {
      console.error(`Error when updating Task ${field}: `, error);
    }
  },

  addTask: async (task: NewTask) => {
    if (navigator.onLine) {
      try {
        const newTask = await apiRequest<TaskFormData>(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        set((state) => ({
          taskFormData: [...get().taskFormData, newTask],
          refreshTaskContent: state.refreshTaskContent + 1,
        }));
      } catch (error) {
        console.error('Error when adding Task to DB' + error);
        await queueWrite(API_URL, 'POST', task);
      }
    } else {
      const optimisticTask: Task = {
        ...task,
        id: Date.now(),
        completed: false,
        created_at: new Date().toString(),
      };
      await queueWrite(API_URL, 'POST', task);
      set((state) => ({
        tasks: [...state.tasks, optimisticTask],
        refreshTaskContent: state.refreshTaskContent + 1,
      }));
    }
  },
  updateTask: async (task, EditId) => {
    try {
      const editTask = await apiRequest<TaskFormData>(`${API_URL}/${EditId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      set({ taskFormData: [...get().taskFormData, editTask] });
    } catch (error) {
      console.error('Error when updating Task' + error);
    }
  },
  deleteTask: async (id) => {
    try {
      await apiRequest<void>(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      set({ tasks: get().tasks.filter((t) => t.id != id) });
    } catch (error) {
      console.error('Error when deleting Task' + error);
    }
  },
}));
