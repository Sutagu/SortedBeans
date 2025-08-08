import { BiEdit } from 'react-icons/bi';
import { useEffect, useState } from 'react';
type Props = {
  selected: { id: number; name: string };
  onChange: (category: { id: number; name: string }) => void;
};

interface Categ {
  id: number;
  name: string;
}
interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}

const TaskCategorySelector = ({ selected, onChange }: Props) => {
  const [categ, setCateg] = useState<Categ[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    est_time: 0,
    category_id: 1,
    assigned_date: '',
    description: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assigned_date:
        formData.assigned_date != '' ? formData.assigned_date : null,
    };

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
    setRefresh((prev) => prev + 1);
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
  }, [refresh]);
  return (
    <div className="flex-col flex justify-center">
      <div className="p-2 w-full flex items-center justify-between text-lg">
        <select
          value={selected.id}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const category = categ.find((cat) => cat.id === selectedId);
            if (category) onChange(category);
          }}
          className="w-[70%] h-full p-2 "
        >
          {categ.map((cat) => (
            <option key={cat.id} value={cat.id} className="p-2 bg-[#894931]">
              {cat.name}
            </option>
          ))}
        </select>

        <BiEdit
          className="w-[10%] text-xl pr-2 cursor-pointer hover:text-[#B85C38] transition-colors"
          onClick={() => setIsVisible((prev) => !prev)}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`p-5 transition-all bg-white/10 flex flex-col gap-4 ${
          isVisible ? 'block' : 'hidden'
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
        <span className="py-2 flex justify-between items-center">
          <input
            type="datetime-local"
            name="assigned_date"
            value={formData.assigned_date || ''}
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
          className=""
        ></textarea>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-[70%] h-full "
        >
          {categ.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
              className="p-2 text-white bg-gray-500"
            >
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="">
          Add Task
        </button>
      </form>
    </div>
  );
};
export default TaskCategorySelector;
