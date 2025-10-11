import { create } from 'zustand';

interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}

interface EditingTask {
  id: number;
}

interface AppState {
  taskFormData: TaskFormData;
  editTask: EditingTask;

  //TaskFormData functons

  //editTask functions
  setEditId: (newId: number) => void;
}

export const useStateOrganiser = create<AppState>((set) => ({
  taskFormData: {
    title: '',
    est_time: 0,
    category_id: 1,
    assigned_date: '',
    description: '',
  },
  editTask: {
    id: 0,
  },

  //Edit Task functions
  setEditId: (newId) =>
    set((state) => ({
      editTask: { ...state.editTask, id: newId },
    })),
}));
