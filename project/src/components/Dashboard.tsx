// import React from 'react';
// import { User } from '../types';
// import { WeeklyTasks } from './WeeklyTasks';
// import { useTasks } from '../hooks/useTasks';
// import { useEmployees } from '../hooks/useEmployees';

// interface DashboardProps {
//   currentUser: User;
//   addNotification: (notification: any) => void;
// }

// export const Dashboard: React.FC<DashboardProps> = ({ currentUser, addNotification }) => {
//   const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(currentUser);
//   const { employees, loading: employeesLoading } = useEmployees();

//   if (tasksLoading || employeesLoading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <WeeklyTasks
//         tasks={tasks}
//         currentUser={currentUser}
//         employees={employees}
//         onAddTask={(taskData) => {
//           addTask(taskData);
          
//           // Create notification for task assignment
//           if (taskData.assigned_to !== currentUser.id) {
//             const assignedEmployee = employees.find(emp => emp.id === taskData.assigned_to);
//             addNotification({
//               type: 'task_assigned',
//               title: 'New Task Assigned',
//               message: `You have been assigned a new task: "${taskData.title}"`,
//               user_id: taskData.assigned_to
//             });
//           }
//         }}
//         onUpdateTask={updateTask}
//         onDeleteTask={deleteTask}
//         onAddTaskUpdate={(taskId, message) => {
//           // Add update to task
//           const taskUpdate = {
//             id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//             task_id: taskId,
//             user_id: currentUser.id,
//             user_name: currentUser.name,
//             message: message,
//             created_at: new Date().toISOString()
//           };

//           // Update the task with the new update
//           const task = tasks.find(t => t.id === taskId);
//           if (task) {
//             const updatedTask = {
//               ...task,
//               updates: [...(task.updates || []), taskUpdate],
//               updated_at: new Date().toISOString()
//             };
//             updateTask(taskId, updatedTask);

//             // Notify relevant people about the update
//             if (task.assigned_by !== currentUser.id) {
//               addNotification({
//                 type: 'task_assigned', // Reusing this type for updates
//                 title: 'Task Update',
//                 message: `${currentUser.name} added an update to task: "${task.title}"`,
//                 user_id: task.assigned_by
//               });
//             }

//             // Notify CEO and Directors if they're not the one adding the update
//             employees.forEach(employee => {
//               if ((employee.role === 'CEO' || employee.role === 'Director') && 
//                   employee.id !== currentUser.id) {
//                 addNotification({
//                   type: 'task_assigned',
//                   title: 'Task Update',
//                   message: `${currentUser.name} added an update to task: "${task.title}"`,
//                   user_id: employee.id
//                 });
//               }
//             });
//           }
//         }}
//       />
//     </div>
//   );
// };


import React from 'react';
import { User } from '../types';
import { WeeklyTasks } from './WeeklyTasks';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';

interface DashboardProps {
  currentUser: User;
  addNotification: (notification: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser, addNotification }) => {
  // ✅ no args needed now
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(currentUser);
  const { employees, loading: employeesLoading } = useEmployees();

  if (tasksLoading || employeesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <WeeklyTasks
        tasks={tasks}
        currentUser={currentUser}
        employees={employees}
        onAddTask={(taskData) => {
          addTask(taskData);

          // ✅ employees still use id
          if (taskData.assigned_to !== currentUser.id) {
            const assignedEmployee = employees.find(emp => emp.id === taskData.assigned_to);
            addNotification({
              type: 'task_assigned',
              title: 'New Task Assigned',
              message: `You have been assigned a new task: "${taskData.title}"`,
              user_id: taskData.assigned_to
            });
          }
        }}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onAddTaskUpdate={(taskId, message) => {
          const taskUpdate = {
            _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            task_id: taskId,
            user_id: currentUser.id,
            user_name: currentUser.name,
            message: message,
            created_at: new Date().toISOString()
          };

          // ✅ use _id instead of id
          const task = tasks.find(t => t._id === taskId);
          if (task) {
            const updatedTask = {
              ...task,
              updates: [...(task.updates || []), taskUpdate],
              updated_at: new Date().toISOString()
            };
            updateTask(task._id, updatedTask);

            if (task.assigned_by !== currentUser.id) {
              addNotification({
                type: 'task_assigned',
                title: 'Task Update',
                message: `${currentUser.name} added an update to task: "${task.title}"`,
                user_id: task.assigned_by
              });
            }

            employees.forEach(employee => {
              if ((employee.role === 'CEO' || employee.role === 'Director') && 
                  employee.id !== currentUser.id) {
                addNotification({
                  type: 'task_assigned',
                  title: 'Task Update',
                  message: `${currentUser.name} added an update to task: "${task.title}"`,
                  user_id: employee.id
                });
              }
            });
          }
        }}
      />
    </div>
  );
};
