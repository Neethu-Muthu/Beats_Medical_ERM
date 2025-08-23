// export interface User {
//   id: string;
//   name: string;
//   mobile: string;
//   role: 'CEO' | 'Director' | 'Employee';
//   department: string;
//   designation: string;
//   member_id: string;
// }

// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   assigned_to: string;
//   assigned_by: string;
//   due_date: string;
//   status: 'pending' | 'in-progress' | 'completed';
//   priority: 'low' | 'medium' | 'high';
//   created_at: string;
//   updated_at: string;
//   updates?: TaskUpdate[];
// }

// export interface TaskUpdate {
//   id: string;
//   task_id: string;
//   user_id: string;
//   user_name: string;
//   message: string;
//   created_at: string;
// }

// export interface AuthState {
//   isAuthenticated: boolean;
//   currentUser: User | null;
// }

// export interface Notification {
//   id: string;
//   type: 'task_assigned' | 'lead_assigned' | 'task_deadline' | 'lead_converted';
//   title: string;
//   message: string;
//   user_id: string;
//   read: boolean;
//   created_at: string;
//   related_id?: string; // task_id or lead_id
// }

// export interface Lead {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   address?: string;
//   status: 'cold' | 'warm' | 'hot';
//   source?: string;
//   assigned_to: string;
//   notes?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   address: string;
//   status: 'active' | 'inactive';
//   total_value: number;
//   created_at: string;
//   updated_at: string;
// }



export interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'CEO' | 'Director' | 'Employee';
  department: string;
  designation: string;
  member_id: string;
}

// ✅ Align Task with backend (MongoDB `_id`)
export interface Task {
  _id: string;   // from MongoDB
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed'; // backend statuses
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  updates?: TaskUpdate[];
}

// ✅ DTO for creating a task (frontend → backend payload)
export type CreateTaskDto = Omit<Task, '_id' | 'created_at' | 'updated_at' | 'updates'>;

// ✅ DTO for updating a task (frontend → backend payload)
export type UpdateTaskDto = Partial<Omit<Task, '_id' | 'created_at' | 'updated_at'>>;

  
export interface TaskUpdate {
  _id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'lead_assigned' | 'task_deadline' | 'lead_converted';
  title: string;
  message: string;
  user_id: string;
  read: boolean;
  created_at: string;
  related_id?: string; // task_id or lead_id
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  status: 'cold' | 'warm' | 'hot';
  source?: string;
  assigned_to: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive';
  total_value: number;
  created_at: string;
  updated_at: string;
}
