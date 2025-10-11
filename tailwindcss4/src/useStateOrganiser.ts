import { create } from 'zustand';

const defaultTaskFormData: TaskFormData = {
  title: '',
  est_time: 0,
  category_id: 1,
  assigned_date: '',
  description: '',
};

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
  setTaskFormData: (data: TaskFormData) => void;
  setTaskField: <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => void;
  //editTask functions
  setEditId: (newId: number) => void;
  reset: () => void;
}

export const useStateOrganiser = create<AppState>((set) => ({
  taskFormData: defaultTaskFormData,
  editTask: {
    id: 0,
  },

  //TaskFormData functions
  setTaskFormData: (data) => set({ taskFormData: data }),
  setTaskField: (field, value) =>
    set((state) => ({
      taskFormData: { ...state.taskFormData, [field]: value },
    })),

  //Edit Task functions
  setEditId: (newId) =>
    set((state) => ({
      editTask: { ...state.editTask, id: newId },
    })),

  //reset all
  reset: () => {
    set({ taskFormData: defaultTaskFormData });
    set({ editTask: { id: 0 } });
  },
}));
