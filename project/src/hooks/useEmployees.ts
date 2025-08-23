// import { useState, useEffect } from 'react';
// import { User } from '../types';
// import { employees as employeeData } from '../data/employees';

// const EMPLOYEES_STORAGE_KEY = 'beats_medical_employees';

// const loadEmployeesFromStorage = (): User[] => {
//   try {
//     const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
//     if (stored) {
//       return JSON.parse(stored);
//     }
//     // If no stored data, initialize with default employees
//     localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employeeData));
//     return employeeData;
//   } catch (error) {
//     console.error('Error loading employees from storage:', error);
//     return employeeData;
//   }
// };

// const saveEmployeesToStorage = (employees: User[]) => {
//   try {
//     localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
//   } catch (error) {
//     console.error('Error saving employees to storage:', error);
//   }
// };

// export const useEmployees = () => {
//   const [employees, setEmployees] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
      
//       // Load employees from localStorage
//       const loadedEmployees = loadEmployeesFromStorage();
//       setEmployees(loadedEmployees);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addEmployee = async (employeeData: Omit<User, 'id'>) => {
//     try {
//       // Generate new ID
//       const newId = (employees.length + 1).toString();
      
//       const newEmployee: User = {
//         id: newId,
//         ...employeeData
//       };
      
//       const updatedEmployees = [...employees, newEmployee];
//       setEmployees(updatedEmployees);
//       saveEmployeesToStorage(updatedEmployees);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//     }
//   };

//   return {
//     employees,
//     loading,
//     refetch: fetchEmployees,
//     addEmployee
//   };
// };



import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';

const API_URL = "http://localhost:5000/employees"; // adjust if different

export const useEmployees = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data.success) {
        const mapped = res.data.employees.map((emp: any) => ({
          ...emp,
          id: emp._id, // map MongoDB _id → frontend id
        }));
        setEmployees(mapped);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add employee
  const addEmployee = async (employeeData: Omit<User, 'id'>) => {
    try {
      const res = await axios.post(API_URL, employeeData);
      if (res.data.success) {
        const newEmployee = { ...res.data.employee, id: res.data.employee._id };
        setEmployees((prev) => [...prev, newEmployee]);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // ✅ Update employee
  const updateEmployee = async (id: string, updates: Partial<User>) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      if (res.data.success) {
        const updatedEmployee = { ...res.data.employee, id: res.data.employee._id };
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
        );
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // ✅ Delete employee
  const deleteEmployee = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      if (res.data.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return {
    employees,
    loading,
    refetch: fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};

