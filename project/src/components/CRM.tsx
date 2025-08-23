import React, { useState } from 'react';
import { UserPlus, Users, FileText, DollarSign, Plus, Eye } from 'lucide-react';
import { User as UserType } from '../types';
import { useCRM } from '../hooks/useCRM';
import { useEmployees } from '../hooks/useEmployees';
import { LeadsModal } from './LeadsModal';
import { CustomersModal } from './CustomersModal';
import { LeadsTable } from './LeadsTable';
import { CustomersTable } from './CustomersTable';

interface CRMProps {
  currentUser: UserType;
  addNotification: (notification: any) => void;
}

type ActiveView = 'overview' | 'leads' | 'customers' | 'quotations' | 'revenue';

export const CRM: React.FC<CRMProps> = ({ currentUser, addNotification }) => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  
  const { leads, customers, loading, addLead, addCustomer, convertLeadToCustomer, updateLead, deleteLead, deleteCustomer } = useCRM();
  const { employees } = useEmployees();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Leads',
      value: leads.length.toString(),
      change: '+12%',
      icon: UserPlus,
      color: 'bg-blue-500',
      onClick: () => setActiveView('leads')
    },
    {
      title: 'Customers',
      value: customers.length.toString(),
      change: '+5%',
      icon: Users,
      color: 'bg-green-500',
      onClick: () => setActiveView('customers')
    },
    {
      title: 'Quotation/Invoice',
      value: '0',
      change: '+18%',
      icon: FileText,
      color: 'bg-purple-500',
      onClick: () => setActiveView('quotations')
    },
    {
      title: 'Revenue',
      value: '$0',
      change: '+25%',
      icon: DollarSign,
      color: 'bg-orange-500',
      onClick: () => setActiveView('revenue')
    }
  ];

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h4>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Recent Leads</h4>
            <button
              onClick={() => setActiveView('leads')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {leads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">{lead.name}</h5>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                  lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-gray-500 text-center py-4">No leads yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Recent Customers</h4>
            <button
              onClick={() => setActiveView('customers')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {customers.slice(0, 3).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">{customer.name}</h5>
                  <p className="text-sm text-gray-600">{customer.company}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  customer.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {customer.status}
                </span>
              </div>
            ))}
            {customers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No customers yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderLeads = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Leads Management</h3>
          <p className="text-gray-600">Manage and track potential customers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('overview')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Overview
          </button>
          <button
            onClick={() => setIsLeadsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>
      <LeadsTable
        leads={leads}
        employees={employees}
        currentUser={currentUser}
        onConvertToCustomer={(leadId) => {
          const lead = leads.find(l => l.id === leadId);
          convertLeadToCustomer(leadId);
          
          // Create notification for lead conversion
          if (lead) {
            addNotification({
              type: 'lead_converted',
              title: 'Lead Converted',
              message: `Lead "${lead.name}" from ${lead.company} has been converted to a customer`,
              user_id: currentUser.id
            });
          }
        }}
        onUpdateLead={updateLead}
        onDeleteLead={deleteLead}
        addNotification={addNotification}
      />
    </div>
  );

  const renderCustomers = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Customers Management</h3>
          <p className="text-gray-600">Manage existing customers and their information</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView('overview')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Overview
          </button>
          <button
            onClick={() => setIsCustomersModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>
      <CustomersTable
        customers={customers}
        onDeleteCustomer={deleteCustomer}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'leads':
        return renderLeads();
      case 'customers':
        return renderCustomers();
      case 'quotations':
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quotations & Invoices</h3>
            <p className="text-gray-600">This feature is coming soon</p>
          </div>
        );
      case 'revenue':
        return (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue Analytics</h3>
            <p className="text-gray-600">This feature is coming soon</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Relationship Management</h3>
        <p className="text-gray-600">Manage clients, deals, and business relationships</p>
      </div>

      {renderContent()}

      <LeadsModal
        isOpen={isLeadsModalOpen}
        onClose={() => setIsLeadsModalOpen(false)}
        onSave={(leadData) => {
          addLead(leadData);
          
          // Create notification for lead assignment
          if (leadData.assigned_to !== currentUser.id) {
            addNotification({
              type: 'lead_assigned',
              title: 'New Lead Assigned',
              message: `You have been assigned a new lead: "${leadData.name}" from ${leadData.company}`,
              user_id: leadData.assigned_to
            });
          }
        }}
        employees={employees}
        currentUser={currentUser}
      />

      <CustomersModal
        isOpen={isCustomersModalOpen}
        onClose={() => setIsCustomersModalOpen(false)}
        onSave={addCustomer}
      />
    </div>
  );
};