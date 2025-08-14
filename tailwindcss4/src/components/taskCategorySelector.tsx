import { AiOutlineMinusCircle } from 'react-icons/ai';
import { CgAdd } from 'react-icons/cg';
import { BiEdit } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
type Props = {
  selected: { category_id: number; name: string };
  onChange: (category: { category_id: number; name: string }) => void;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  enablePatch: number;
  setEnablePatch: React.Dispatch<React.SetStateAction<number>>;
};
interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}
interface Categ {
  category_id: number;
  name: string;
}

const TaskCategorySelector = ({
  selected,
  onChange,
  reloadTrigger,
  setReloadTrigger,
  formData,
  setFormData,
  enablePatch,
  setEnablePatch,
}: Props) => {
  const [categ, setCateg] = useState<Categ[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [input, setInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'est_time' || name === 'category' ? Number(value) : value,
    }));
  };
  function toDatetimeLocalString(isoDate: string): string {
    const date = new Date(isoDate);

    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().slice(0, 16);
  }

  const resetFormData = () => {
    setFormData({
      title: '',
      est_time: 0,
      category_id: 1,
      assigned_date: '',
      description: '',
    });
    setInput('');
    setIsVisible(false);
    setCategoryVisible(false);
    setEnablePatch(0);
  };
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assigned_date:
        formData.assigned_date != '' ? formData.assigned_date : null,
    };
    if (isVisible) {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create task');
        const newTask = await res.json();
        console.log('Created Task:', newTask);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tasks/update/${enablePatch}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error('Failed to update Task');
        const newTask = await res.json();
        console.log('Updated Task:', newTask);
      } catch (err) {
        console.error(err);
      }
    }

    resetFormData();
    setReloadTrigger((prev) => prev + 1);
  };
  const addTaskCategory = async (name: string) => {
    const payload = { name };
    try {
      const res = await fetch('http://localhost:5000/api/task_categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create category');
      const newCategory = await res.json();
      console.log('Created category:', newCategory);
    } catch (err) {
      console.error(err);
    }
    resetFormData();
    setReloadTrigger((prev) => prev + 1);
  };
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete:', error.error || res.statusText);
        return;
      }

      setReloadTrigger((prev) => prev + 1);
      resetFormData();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/task_categories/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete:', error.error || res.statusText);
        return;
      }
      const category = categ[0];
      if (category) onChange(category);
      setReloadTrigger((prev) => prev + 1);
      resetFormData();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };
  useEffect(() => {
    fetch('http://localhost:5000/api/task_categories')
      .then((res) => res.json())
      .then((data: Categ[]) => {
        setCateg(data);
      })
      .catch((err) => {
        console.error('Error fetching categories', err);
      });
  }, [reloadTrigger]);
  return (
    <div className="flex-col flex justify-center">
      <div className="p-2 w-full flex items-center justify-between text-lg">
        <select
          value={selected.category_id}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const category = categ.find(
              (cat) => cat.category_id === selectedId
            );
            if (category) onChange(category);
          }}
          className="w-7/10 h-full p-2 "
        >
          {categ.map((cat) => (
            <option
              key={cat.category_id}
              value={cat.category_id}
              className="p-2 accent-dark"
            >
              {cat.name}
            </option>
          ))}
        </select>
        <div className="w-2/10 flex justify-end-safe gap-1">
          <AiOutlineMinusCircle
            title="Delete Current Category"
            className="text-xl cursor-pointer hover:text-[#B85C38] transition-colors"
            onClick={() => deleteCategory(selected.category_id)}
          />
          <CgAdd
            className={`text-xl cursor-pointer hover:text-[#B85C38] transition-colors ${
              categoryVisible && enablePatch == 0 ? 'text-[#B85C38]' : ''
            }`}
            onClick={() => {
              resetFormData();
              setCategoryVisible((prev) => !prev);
            }}
          />
          <BiEdit
            className={`text-xl cursor-pointer hover:text-[#B85C38] transition-colors ${
              isVisible && enablePatch == 0 ? 'text-[#B85C38]' : ''
            }`}
            onClick={() => {
              resetFormData();
              setIsVisible((prev) => !prev);
            }}
          />
        </div>
      </div>
      <span
        className={`p-5 transition-all bg-white/10 gap-4  
          ${categoryVisible && enablePatch == 0 ? 'flex' : 'hidden'} `}
      >
        <input
          type="text"
          name="name"
          placeholder="Add category name"
          autoComplete="off"
          className="w-7/10 border-b-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="w-3/10 text-sm accent rounded-md py-2 hover:font-semibold hover:cursor-pointer transition-colors "
          onClick={() => addTaskCategory(input)}
        >
          Add Category
        </button>
        <button
          className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
          onClick={() => resetFormData()}
        >
          Cancel
        </button>
      </span>

      <form
        onSubmit={addTask}
        className={`p-5 transition-all bg-white/10 gap-4 ${
          isVisible || enablePatch != 0 ? 'flex flex-col' : 'hidden'
        }`}
      >
        <input
          type="text"
          name="title"
          placeholder="Add Title"
          value={formData.title}
          onChange={handleChange}
          className="border-b-1 py-2"
          required
        />
        <span className="py-2 text-sm flex justify-between items-center">
          <input
            type="datetime-local"
            name="assigned_date"
            value={
              formData.assigned_date
                ? toDatetimeLocalString(formData.assigned_date)
                : ''
            }
            onChange={handleChange}
            className="bg-black/20 w-4/10 rounded-lg p-2 text-gray-300"
          />
          <p className="w-6/10">Estimated Time (Minutes):</p>
          <input
            type="text"
            name="est_time"
            value={formData.est_time}
            onChange={handleChange}
            className="w-1/10 text-gray-300"
          />
        </span>
        <textarea
          name="description"
          placeholder="Description..."
          value={formData.description}
          onChange={handleChange}
          maxLength={100}
          className="h-full text-gray-300"
        ></textarea>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-7/10"
        >
          {categ.map((cat) => (
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
            className={`transition-colors accent rounded-md py-2 hover:font-semibold hover:cursor-pointer ${
              isVisible && enablePatch == 0 ? 'grow' : 'hidden'
            }`}
          >
            Add Task
          </button>
          <button
            type="submit"
            className={`transition-colors accent rounded-md py-2 hover:font-semibold hover:cursor-pointer ${
              enablePatch != 0 ? 'grow' : 'hidden'
            }`}
          >
            Edit Task
          </button>
          <MdDelete
            title="Delete task"
            className={`p-2 h-full w-auto secondary rounded-lg text-xl hover:bg-red-600! transition-colors ${
              enablePatch != 0 ? 'block' : 'hidden'
            }`}
            onClick={() => deleteTask(enablePatch)}
          />
          <button
            className="transition-colors secondary rounded-md p-2 hover:bg-red-600! hover:cursor-pointer"
            onClick={() => resetFormData()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default TaskCategorySelector;
