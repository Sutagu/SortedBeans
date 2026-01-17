//Icons
import { CgTrash } from 'react-icons/cg';
//Hooks
import {
  useGetTaskFormData,
  useReset,
  useSetSpecificTaskField,
} from '../utils/useStateOrganiser';
//API hook
import { UseSupabaseTaskStore } from '../supabaseStore/taskApi';
import { UseSupabaseCategoryStore } from '../supabaseStore/categoryApi';
import { ComponentMode } from '../utils/componentMode';
import type React from 'react';
import { useState } from 'react';
//Prop
interface Props {
  mode: ComponentMode;
  setMode: React.Dispatch<React.SetStateAction<ComponentMode>>;
}
const AddTask = ({ mode, setMode }: Props) => {
  //State organiser
  const taskFormData = useGetTaskFormData();
  const ResetFormData = useReset();
  const setTaskField = useSetSpecificTaskField();
  //Api hooks
  const { deleteTask, addTask, updateTask } = UseSupabaseTaskStore();
  const { categories } = UseSupabaseCategoryStore();

  //Local dateString
  const [localDate, setLocalDate] = useState<string>();
  function toDatetimeLocalString(isoDate: string | null): string {
    if (isoDate == null || isoDate == '') {
      setLocalDate('');
      return '';
    }
    const date = new Date(isoDate);
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const result = offsetDate.toISOString().slice(0, 16);
    setLocalDate(result);
    return result;
  }
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'assigned_date') toDatetimeLocalString(value);
    const numericFields = new Set(['est_time', 'category_id']);
    const newValue = numericFields.has(name) ? Number(value) : value;
    setTaskField(name as keyof typeof taskFormData, newValue);
  };

  const ModifyTaskFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    const getDateFormat: string | null = taskFormData.assigned_date
      ? toDatetimeLocalString(taskFormData.assigned_date)
      : null;

    const payload = {
      ...taskFormData,
      assigned_date: getDateFormat == '' ? null : getDateFormat,
    };
    if (mode == ComponentMode.ADD_TASK) addTask(payload);
    else if (mode == ComponentMode.EDIT_TASK) {
      updateTask(payload);
    }
    setMode(ComponentMode.DEFAULT);
    ResetFormData();
  };
  return (
    <form
      onSubmit={ModifyTaskFunction}
      className={`p-5 transition-all bg-white/10 gap-4 flex-col ${
        mode == ComponentMode.ADD_TASK || mode == ComponentMode.EDIT_TASK
          ? 'flex'
          : 'hidden'
      }`}
    >
      <input
        type="text"
        name="title"
        placeholder="Add Title"
        maxLength={30}
        value={taskFormData.title}
        onChange={handleChange}
        className="border-b-1 py-2"
        required
      />
      <span className="py-2 text-sm flex justify-between items-center">
        <input
          type="datetime-local"
          name="assigned_date"
          value={localDate ?? toDatetimeLocalString(taskFormData.assigned_date)}
          onChange={handleChange}
          className="bg-black/20 w-4/10 rounded-lg p-2 text-gray-light"
        />
        <p className="w-6/10">Estimated Time (Minutes):</p>
        <input
          type="number"
          name="est_time"
          value={taskFormData.est_time}
          onChange={handleChange}
          className="w-1/10 text-gray-light"
        />
      </span>
      <textarea
        name="description"
        placeholder="Description..."
        value={taskFormData.description}
        onChange={handleChange}
        maxLength={100}
        className="h-full text-gray-light"
      ></textarea>
      <select
        name="category_id"
        value={taskFormData.category_id}
        onChange={handleChange}
        className="w-7/10"
      >
        {categories.map((cat) => (
          <option
            key={cat.category_id}
            value={cat.category_id}
            className="p-2 text-white bg-gray-500"
          >
            {cat.name}
          </option>
        ))}
      </select>
      <div className="flex gap-4">
        <button
          title="Add or Edit Task Btn"
          type="submit"
          className="cursor-pointer transition-colors bg-accent rounded-md py-2 hover:bg-accent-dark grow"
        >
          {mode == ComponentMode.ADD_TASK ? 'Add Task' : 'Edit Task'}
        </button>
        <CgTrash
          title="Delete btn"
          type="button"
          className={`p-2 h-full w-auto secondary rounded-lg text-xl hover:bg-red-600! transition-colors ${
            mode == ComponentMode.EDIT_TASK ? 'block' : 'hidden'
          }`}
          onClick={() => {
            deleteTask(taskFormData.id);
          }}
        />
        <button
          className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
          onClick={() => {
            ResetFormData();
            setMode(ComponentMode.DEFAULT);
          }}
          type="button"
          title="Cancel Btn"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTask;
