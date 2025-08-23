import React from 'react';
import { User, Phone, MapPin, Plus } from 'lucide-react';
import { User as UserType } from '../types';
import { useEmployees } from '../hooks/useEmployees';
import { useTasks } from '../hooks/useTasks';
import { useCRM } from '../hooks/useCRM';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';

interface EmployeesProps {
  currentUser: UserType;
}

export const Employees: React.FC<EmployeesProps> = ({ currentUser }) => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<UserType | null>(null);
  const { employees, loading, addEmployee } = useEmployees();
  const { tasks } = useTasks(currentUser);
  const { leads, customers } = useCRM();

  const canAddEmployee = currentUser.role === 'CEO' || currentUser.role === 'Director';

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CEO': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Director': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Employee': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Members</h3>
          <p className="text-gray-600">Manage and view all employees in the organization</p>
        </div>
        {canAddEmployee && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div 
            key={employee.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEmployee(employee)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <span className={`px-3 py-1 text-xs border rounded-full font-medium ${getRoleColor(employee.role)}`}>
                {employee.role}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">{employee.name}</h4>
                <p className="text-gray-600 text-sm">{employee.designation}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+971{employee.mobile}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{employee.department}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Member ID</span>
                  <span className="text-xs font-mono text-gray-700">{employee.member_id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addEmployee}
      />

      {selectedEmployee && (
        <EmployeeDetailsModal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          tasks={tasks}
          leads={leads}
          customers={customers}
          allEmployees={employees}
        />
      )}
    </div>
  );
};