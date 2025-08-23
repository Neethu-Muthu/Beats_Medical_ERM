import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Task, User } from '../types';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

interface WeeklyTasksProps {
  tasks: Task[];
  currentUser: User;
  employees: User[];
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTaskUpdate: (taskId: string, message: string) => void;
}

export const WeeklyTasks: React.FC<WeeklyTasksProps> = ({
  tasks,
  currentUser,
  employees,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddTaskUpdate
}) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getDates = (dayOffset: number) => {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() + dayOffset));
    
    return Array.from({ length: 4 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const dates = getDates(currentDay);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      return task.due_date === dateStr;
    });
  };

  const handleAddTask = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        assigned_to: taskData.assigned_to,
        due_date: taskData.due_date,
        priority: taskData.priority,
        status: taskData.status
      });
    } else {
      onAddTask({
        title: taskData.title,
        description: taskData.description,
        assigned_to: taskData.assigned_to,
        assigned_by: currentUser.id,
        due_date: taskData.due_date,
        priority: taskData.priority,
        status: taskData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  const getDateRangeLabel = () => {
    const startDate = dates[0];
    const endDate = dates[3];
    
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${startDate.getFullYear()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Tasks</h2>
          <span className="text-gray-600 font-medium">{getDateRangeLabel()}</span>
        </div>
      </div>

      <div className="p-6 relative">
        {/* Left Navigation Button */}
        <button
          onClick={() => setCurrentDay(currentDay - 1)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={() => setCurrentDay(currentDay + 1)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Tasks Grid */}
        <div className="mx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dates.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const dayOfWeek = date.getDay();
            
            return (
              <div key={index} className="space-y-4 min-w-0">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">{dayNames[dayOfWeek]}</p>
                  <p className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                    {date.getDate()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>

                <div className="space-y-3">
                  {dayTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentUser={currentUser}
                      employees={employees}
                      onEdit={handleEditTask}
                      onDelete={onDeleteTask}
                      onStatusUpdate={onUpdateTask}
                      onAddUpdate={onAddTaskUpdate}
                    />
                  ))}

                  <button
                    onClick={() => handleAddTask(date)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-gray-500 group-hover:text-blue-600 text-sm font-medium transition-colors">
                        Add Task
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        currentUser={currentUser}
        employees={employees}
        selectedDate={selectedDate}
        editTask={editingTask}
      />
    </div>
  );
};