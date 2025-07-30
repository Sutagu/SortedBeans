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

const TaskCategorySelector = ({ selected, onChange }: Props) => {
  const [categ, setCateg] = useState<Categ[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/task_categories')
      .then((res) => res.json())
      .then((data: Categ[]) => {
        setCateg(data);
      })
      .catch((err) => {
        console.error('Error fetching categories', err);
      });
  }, []);
  return (
    <div className="px-2 w-full h-[7.5%] flex items-center justify-between text-lg">
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

      <BiEdit className="w-[10%] text-xl pr-2 cursor-pointer hover:text-[#B85C38] transition-colors" />
    </div>
  );
};
export default TaskCategorySelector;
