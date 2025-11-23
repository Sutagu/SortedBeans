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
  updateTask: (task: Omit<TaskFormData, 'id'>, EditId: number) => Promise<void>;
  editTaskDate: (id: number, assignedDate: string | null) => Promise<void>;
  editTaskCompleted: (id: number, completed: boolean) => Promise<void>;
  editTaskEstTime: (id: number, est_time: number) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],

  fetchTasks: async () => {
    const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
    set({ tasks: data });
  },
  editTaskEstTime: async (id, est_time) => {
    if (est_time < 1440) {
      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ est_time }),
      });
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, est_time: t.est_time } : t
        ),
      });
    }
  },
  editTaskDate: async (id, assigned_date) => {
    if (assigned_date != null) {
      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigned_date }),
      });
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, assigned_date: t.assigned_date } : t
        ),
      });
    }
  },
  editTaskCompleted: async (id, completed) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    set({
      tasks: get().tasks.map((t) =>
        t.id === id ? { ...t, completed: t.completed } : t
      ),
    });
  },
  addTask: async (task) => {
    const newTask = await apiRequest<TaskFormData>(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    set({ taskFormData: [...get().taskFormData, newTask] });
  },
  updateTask: async (task, EditId) => {
    const editTask = await apiRequest<TaskFormData>(`${API_URL}/${EditId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'applicaiton/json' },
      body: JSON.stringify(task),
    });
    set({ taskFormData: [...get().taskFormData, editTask] });
  },
  deleteTask: async (id) => {
    await apiRequest<void>(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    set({ tasks: get().tasks.filter((t) => t.id != id) });
  },
}));
