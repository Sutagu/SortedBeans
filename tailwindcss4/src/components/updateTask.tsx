//Icons
import { CgTrash } from 'react-icons/cg';
//Hooks
import {
  useGetTaskFormData,
  useSetTaskField,
  useGetEditId,
  useSetEditId,
} from '../utils/useStateOrganiser';
//API hook
import { useTaskStore } from '../hooks/taskStoreHook';
import { useCategoryStore } from '../hooks/categoryStoreHook';
const UpdateTask = () => {
  //State organiser
  const setTaskField = useSetTaskField();
  const taskFormData = useGetTaskFormData();
  const EditId = useGetEditId();
  const setEditId = useSetEditId();
  //Api hooks
  const { deleteTask, updateTask } = useTaskStore();
  const { categories } = useCategoryStore();

  function toDatetimeLocalString(isoDate: string): string {
    const date = new Date(isoDate);
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().slice(0, 16);
  }
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numericFields = new Set(['est_time', 'category_id']);
    const newValue = numericFields.has(name) ? Number(value) : value;
    setTaskField(name as keyof typeof taskFormData, newValue);
  };

  const editTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...taskFormData,
      assigned_date:
        taskFormData.assigned_date != '' ? taskFormData.assigned_date : null,
    };
    updateTask(payload, EditId);
  };
  return (
    <form
      onSubmit={editTask}
      className="p-5 transition-all bg-white/10 gap-4 flex flex-col"
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
          value={
            taskFormData.assigned_date
              ? toDatetimeLocalString(taskFormData.assigned_date)
              : ''
          }
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
          type="submit"
          className="cursor-pointer transition-colors bg-accent rounded-md py-2 hover:bg-accent-dark grow"
        >
          Update Task
        </button>
        <CgTrash
          title="Delete task"
          className="p-2 h-full w-auto secondary rounded-lg text-xl hover:bg-red-600! transition-colors block"
          onClick={() => deleteTask(EditId)}
        />
        <button
          className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
          onClick={() => setEditId(0)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default UpdateTask;
