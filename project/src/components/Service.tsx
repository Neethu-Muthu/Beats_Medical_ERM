import React from 'react';
import { Wrench, Calendar, CheckCircle, Clock } from 'lucide-react';
import { User as UserType } from '../types';

interface ServiceProps {
  currentUser: UserType;
}

export const Service: React.FC<ServiceProps> = ({ currentUser }) => {
  const stats = [
    {
      title: 'Active Services',
      value: '45',
      change: '+8%',
      icon: Wrench,
      color: 'bg-blue-500'
    },
    {
      title: 'Scheduled',
      value: '23',
      change: '+15%',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Completed',
      value: '156',
      change: '+12%',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending',
      value: '12',
      change: '-5%',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Management</h3>
        <p className="text-gray-600">Manage service requests, maintenance, and support tickets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h4>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Service Requests</h4>
          <div className="space-y-4">
            {[
              { client: 'Dubai Healthcare City', service: 'Equipment Maintenance', status: 'In Progress', priority: 'High' },
              { client: 'Al Zahra Hospital', service: 'Software Update', status: 'Scheduled', priority: 'Medium' },
              { client: 'Emirates Hospital', service: 'Hardware Repair', status: 'Completed', priority: 'High' },
              { client: 'Mediclinic Middle East', service: 'System Installation', status: 'Pending', priority: 'Low' }
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800">{request.client}</h5>
                  <p className="text-sm text-gray-600">{request.service}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.priority === 'High' ? 'bg-red-100 text-red-800' :
                    request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h4>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', client: 'Dubai Healthcare City', service: 'Equipment Maintenance', engineer: 'ABHISHEK A V' },
              { time: '11:30 AM', client: 'Al Zahra Hospital', service: 'Software Update', engineer: 'BRAVIN RAJAGOPAL' },
              { time: '02:00 PM', client: 'Emirates Hospital', service: 'System Check', engineer: 'ABHISHEK A V' },
              { time: '04:30 PM', client: 'Mediclinic Middle East', service: 'Installation', engineer: 'BRAVIN RAJAGOPAL' }
            ].map((appointment, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium min-w-fit">
                  {appointment.time}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800">{appointment.client}</h5>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                  <p className="text-xs text-gray-500">Engineer: {appointment.engineer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};