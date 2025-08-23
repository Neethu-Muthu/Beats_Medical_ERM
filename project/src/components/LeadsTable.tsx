import React from 'react';
import { Mail, Phone, Building, UserCheck, Trash2, Edit } from 'lucide-react';
import { Lead, User } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  employees: User[];
  currentUser: User;
  onConvertToCustomer: (leadId: string) => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onDeleteLead: (leadId: string) => void;
  addNotification?: (notification: any) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  employees,
  currentUser,
  onConvertToCustomer,
  onUpdateLead,
  onDeleteLead,
  addNotification
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAssignedEmployee = (assignedTo: string) => {
    return employees.find(emp => emp.id === assignedTo);
  };

  const canEdit = (lead: Lead) => {
    return currentUser.role === 'CEO' || 
           currentUser.role === 'Director' || 
           lead.assigned_to === currentUser.id;
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Leads Yet</h3>
          <p className="text-gray-600">Start by adding your first lead to track potential customers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => {
              const assignedEmployee = getAssignedEmployee(lead.assigned_to);
              const canEditLead = canEdit(lead);
              
              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{lead.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs border rounded-full font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignedEmployee ? assignedEmployee.name : 'Unassigned'}
                    </div>
                    {assignedEmployee && (
                      <div className="text-xs text-gray-500">{assignedEmployee.member_id}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{lead.source || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {canEditLead && (
                        <>
                          <button
                            onClick={() => {
                              onConvertToCustomer(lead.id);
                              
                              // Create notification for lead conversion
                              if (addNotification) {
                                addNotification({
                                  type: 'lead_converted',
                                  title: 'Lead Converted',
                                  message: `Lead "${lead.name}" from ${lead.company} has been converted to a customer`,
                                  user_id: currentUser.id
                                });
                              }
                            }}
                            className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                          >
                            Convert
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = lead.status === 'cold' ? 'warm' : 
                                             lead.status === 'warm' ? 'hot' : 'cold';
                              onUpdateLead(lead.id, { status: newStatus });
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};