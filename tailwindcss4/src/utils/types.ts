export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}
export interface TaskFormData {
  id?: number;
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}
export interface EditingTask {
  id: number;
}
export interface CategoryData {
  category_id: number;
  name: string;
}
