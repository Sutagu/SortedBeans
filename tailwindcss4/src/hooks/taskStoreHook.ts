import { create } from 'zustand';
import { apiRequest } from '../utils/api';
import type { Task, TaskFormData } from '../utils/types';

const API_URL = import.meta.env.VITE_TASK_API_URL;

interface TaskStore {
  tasks: Task[];
  taskFormData: TaskFormData[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<TaskFormData, 'id'>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],

  fetchTasks: async () => {
    const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
    set({ tasks: data });
  },
  addTask: async (task) => {
    const newTask = await apiRequest<TaskFormData>(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    set({ taskFormData: [...get().taskFormData, newTask] });
  },
  deleteTask: async (id) => {
    await apiRequest<void>(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    set({ tasks: get().tasks.filter((t) => t.id != id) });
  },
}));
