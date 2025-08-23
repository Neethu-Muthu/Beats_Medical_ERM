import React, { useState } from 'react';
import { Clock, User, Edit, Trash2, ChevronDown, ChevronUp, MessageSquare, Plus } from 'lucide-react';
import { Task, User as UserType } from '../types';
import { TaskUpdateModal } from './TaskUpdateModal';

interface TaskCardProps {
  task: Task;
  currentUser: UserType;
  employees: UserType[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusUpdate: (taskId: string, updates: Partial<Task>) => void;
  onAddUpdate: (taskId: string, message: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUser,
  employees,
  onEdit,
  onDelete,
  onStatusUpdate,
  onAddUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const assignedUser = employees.find(emp => emp.id === task.assigned_to);
  
  const canEdit = currentUser.id === task.assigned_to || 
                  currentUser.role === 'CEO' || 
                  currentUser.role === 'Director';

  const canAddUpdate = currentUser.id === task.assigned_to;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Collapsed View */}
      <div 
        className="p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-sm leading-tight truncate">
              {task.title}
            </h3>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`px-2 py-0.5 text-xs border rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-0.5 text-xs border rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {canEdit && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task._id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="space-y-3 pt-3">
            <p className="text-gray-600 text-sm">{task.description}</p>

            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-500">
                <User className="w-3 h-3 mr-1" />
                <span>{assignedUser?.name}</span>
              </div>

              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Task Updates */}
            {task.updates && task.updates.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Updates ({task.updates.length})</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {task.updates.slice(-3).map((update) => (
                    <div key={update._id} className="bg-gray-50 p-2 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700">{update.user_name}</span>
                        <span className="text-gray-400">{getTimeAgo(update.created_at)}</span>
                      </div>
                      <p className="text-gray-600">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Update Button */}
            {canAddUpdate && (
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add Update</span>
              </button>
            )}

            {canEdit && task.status !== 'completed' && (
              <div className="flex space-x-1 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(task._id, { status: 'in-progress' });
                  }}
                  disabled={task.status === 'in-progress'}
                  className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  In Progress
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(task._id, { status: 'completed' });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  Complete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <TaskUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={(message) => {
          onAddUpdate(task._id, message);
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};