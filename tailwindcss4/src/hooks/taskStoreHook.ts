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
  editTaskDate: (id: number, assignedDate: string | null) => Promise<void>;
  editTaskCompleted: (id: number, completed: boolean) => Promise<void>;
  editTaskEstTime: (id: number, est_time: number) => Promise<void>;
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskFormData: [],
  refreshTaskContent: 0,
  fetchTasks: async () => {
    try {
      const data = await apiRequest<Task[]>(API_URL, { method: 'GET' });
      set({ tasks: data });
    } catch (error) {
      console.error('Error when fetching tasks' + error);
    }
  },
  editTaskEstTime: async (id, est_time) => {
    if (est_time < 1440) {
      try {
        await apiRequest<void>(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ est_time }),
        });
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, est_time } : t)),
        });
      } catch (error) {
        console.log('Error when editing Task est_time' + error);
      }
    }
  },
  editTaskDate: async (id, assigned_date) => {
    if (assigned_date != null) {
      try {
        await apiRequest<void>(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assigned_date }),
        });
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, assigned_date } : t
          ),
        });
      } catch (error) {
        console.error('Error when editing Task assigned_date' + error);
      }
    }
  },
  editTaskCompleted: async (id, completed) => {
    try {
      await apiRequest<void>(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, completed } : t)),
      });
    } catch (error) {
      console.error('Error when editing Task completed' + error);
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
      const optimisticTask: TaskFormData = {
        ...task,
        id: Date.now(),
      };
      set((state) => ({
        taskFormData: [...get().taskFormData, optimisticTask],
        refreshTaskContent: state.refreshTaskContent + 1,
      }));
      await queueWrite(API_URL, 'POST', task);
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
