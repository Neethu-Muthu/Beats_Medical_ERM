import React from 'react';
import { X, User, Phone, MapPin, Calendar, CheckCircle, Clock, MessageSquare, UserCheck, Building } from 'lucide-react';
import { User as UserType, Task, Lead, Customer } from '../types';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: UserType;
  tasks: Task[];
  leads: Lead[];
  customers: Customer[];
  allEmployees: UserType[];
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
  tasks,
  leads,
  customers,
  allEmployees
}) => {
  if (!isOpen) return null;

  // Filter data for this employee
  const employeeTasks = tasks.filter(task => task.assigned_to === employee.id);
  const employeeLeads = leads.filter(lead => lead.assigned_to === employee.id);
  const employeeCustomers = customers.filter(customer => 
    // For customers, we'll show those converted from leads assigned to this employee
    // Since we don't have a direct assignment field for customers, we'll show all for now
    true
  );

  // Get all task updates from this employee
  const employeeUpdates = tasks
    .filter(task => task.updates && task.updates.length > 0)
    .flatMap(task => 
      task.updates!
        .filter(update => update.user_id === employee.id)
        .map(update => ({ ...update, task_title: task.title }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string) => {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CEO': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Director': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Employee': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{employee.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-3 py-1 text-xs border rounded-full font-medium ${getRoleColor(employee.role)}`}>
                  {employee.role}
                </span>
                <span className="text-gray-600">{employee.designation}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{employee.member_id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Employee Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                <span>Contact</span>
              </div>
              <p className="font-medium text-gray-800">+971{employee.mobile}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Department</span>
              </div>
              <p className="font-medium text-gray-800">{employee.department}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="w-4 h-4 mr-2" />
                <span>Role</span>
              </div>
              <p className="font-medium text-gray-800">{employee.role}</p>
            </div>
          </div>

          {/* Activity Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tasks Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Assigned Tasks ({employeeTasks.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                ) : (
                  employeeTasks.map(task => (
                    <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs border rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        {task.updates && task.updates.length > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <MessageSquare className="w-3 h-3 mr-1" />
                            <span>{task.updates.length} updates</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leads Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Assigned Leads ({employeeLeads.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeLeads.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No leads assigned</p>
                ) : (
                  employeeLeads.map(lead => (
                    <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{lead.name}</h4>
                        <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building className="w-3 h-3 mr-2" />
                          <span>{lead.company}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.source && (
                          <div className="text-xs text-gray-500">
                            Source: {lead.source}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Task Updates Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Recent Updates ({employeeUpdates.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeUpdates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No updates posted</p>
                ) : (
                  employeeUpdates.map(update => (
                    <div key={update._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800 text-sm">{update.task_title}</h4>
                        <span className="text-xs text-gray-500">{formatDateTime(update.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{update.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Customers Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Related Customers ({employeeCustomers.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeCustomers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No customers handled</p>
                ) : (
                  employeeCustomers.slice(0, 5).map(customer => (
                    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{customer.name}</h4>
                        <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building className="w-3 h-3 mr-2" />
                          <span>{customer.company}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Value: ${customer.total_value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};