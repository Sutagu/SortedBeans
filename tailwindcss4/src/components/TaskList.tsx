type Props = {
    category : string
}

const tasks: Record<string, string[]> = {
  Tasks: ['Clean room', 'Brush teeth'],
  Day: ['Check emails', 'Drink water'],
  Shopping: ['Buy milk', 'Order online'],
  Assignments: ['Software Testing', 'Computer Programming 3'],
}

const TaskList = ({category} : Props) =>{
    const items = tasks[category] || []

    return (
        <ul className="bg-[#3C2A21] h-[80%] pt-5">
            {items.map((task, idx) =>(
                <li
                    key={idx}
                    className="text-left h-[10%] pl-2 shadow border-t-1 hover:bg-[#2d2424] transition"
                    >
                        {task}
                    </li>
            ))}
        </ul>
    )

}

export default TaskList