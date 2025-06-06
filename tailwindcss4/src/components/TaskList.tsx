import { RxHamburgerMenu } from "react-icons/rx"; 
type Props = {
    category : string
}

const tasks: Record<string, string[]> = {
  Tasks: [
    'Clean room',
    'Brush teeth',
    'Take out trash',
    'Make the bed',
    'Vacuum floor',
    'Do laundry',
    'Wash dishes',
    'Feed the pet',
    'Water the plants',
    'Organize closet',
    'Wipe desk',
    'Sanitize phone',
    'Tidy bookshelf',
    'Dust windows',
    'Declutter drawers',
  ],
  Day: [
    'Check emails',
    'Drink water',
    'Meditate for 5 mins',
    'Stretch body',
    'Journal thoughts',
    'Plan today’s goals',
    'Read 10 pages',
    'Review calendar',
    'Prep meals',
    'Walk outside',
    'Review to-do list',
    'Respond to messages',
    'Reflect on yesterday',
    'Track expenses',
    'Clean workspace',
  ],
  Shopping: [
    'Buy milk',
    'Order online',
    'Get eggs',
    'Pick up bread',
    'Buy vegetables',
    'Refill detergent',
    'Buy toilet paper',
    'Purchase toothpaste',
    'Grab snacks',
    'Check discounts',
    'Restock tea/coffee',
    'Get rice or pasta',
    'Buy frozen meals',
    'Check for fruits',
    'Buy pet food',
  ],
  Assignments: [
    'Software Testing',
    'Computer Programming 3',
    'Database Systems',
    'Web Development',
    'Operating Systems',
    'Computer Networks',
    'AI Fundamentals',
    'Cybersecurity Basics',
    'Mobile App Dev',
    'Data Structures',
    'Cloud Computing',
    'Ethical Hacking',
    'Capstone Project',
    'System Design',
    'Software Engineering Principles',
  ]
}

const TaskList = ({category} : Props) =>{
    const items = tasks[category] || []

    return (
        <ul className="taskListContainer bg-[#3C2A21] h-[80%] max-h-[80%] overflow-y-auto p-5">
            {items.map((task, idx) =>(
                <li
                    key={idx}
                    className="text-left h-[10%] pl-2 border-t-1 border-b-1 hover:bg-[#2d2424] flex items-center gap-2 transition"
                    >
                        <RxHamburgerMenu className="rotate-90"/>
                        {task}
                    </li>
            ))}
        </ul>
    )

}

export default TaskList