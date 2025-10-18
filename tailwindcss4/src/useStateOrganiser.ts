import { create } from 'zustand';

//For editing and submiting tasks
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

//For selection of categories
const defaultCategory: CategoryData = {
  category_id: 0,
  name: 'NULL',
};
interface CategoryData {
  category_id: number;
  name: string;
}

interface AppState {
  taskFormData: TaskFormData;
  editTask: EditingTask;
  refreshPage: number;
  uiTheme: string;
  categoryData: CategoryData;

  //TaskFormData functons
  setTaskFormData: (data: TaskFormData) => void;
  setTaskField: <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => void;

  //editTask functions
  setEditId: (newId: number) => void;
  reset: () => void;

  //SetCategory functions
  setCategoryData: (data: CategoryData) => void;
  //Refresh functions
  setPageRefresh: () => void;

  //Theme functions
  setTheme: (newTheme: string) => void;
}

export const useStateOrganiser = create<AppState>((set) => ({
  taskFormData: defaultTaskFormData,
  editTask: {
    id: 0,
  },
  refreshPage: 0,
  uiTheme: 'default',
  categoryData: defaultCategory,

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
  //Set category data
  setCategoryData: (data) => set({ categoryData: data }),
  //reset all
  reset: () => {
    set({ taskFormData: defaultTaskFormData });
    set({ editTask: { id: 0 } });
  },

  //setPageRefresh functions
  setPageRefresh: () =>
    set((state) => ({ refreshPage: state.refreshPage + 1 })),

  //setUiTheme function
  setTheme: (newTheme) => set({ uiTheme: newTheme }),
}));
