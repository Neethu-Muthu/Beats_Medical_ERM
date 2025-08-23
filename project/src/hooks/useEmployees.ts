import { useState, useEffect } from 'react';
import { User } from '../types';
import { employees as employeeData } from '../data/employees';

const EMPLOYEES_STORAGE_KEY = 'beats_medical_employees';

const loadEmployeesFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // If no stored data, initialize with default employees
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employeeData));
    return employeeData;
  } catch (error) {
    console.error('Error loading employees from storage:', error);
    return employeeData;
  }
};

const saveEmployeesToStorage = (employees: User[]) => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error('Error saving employees to storage:', error);
  }
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      // Load employees from localStorage
      const loadedEmployees = loadEmployeesFromStorage();
      setEmployees(loadedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: Omit<User, 'id'>) => {
    try {
      // Generate new ID
      const newId = (employees.length + 1).toString();
      
      const newEmployee: User = {
        id: newId,
        ...employeeData
      };
      
      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      saveEmployeesToStorage(updatedEmployees);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return {
    employees,
    loading,
    refetch: fetchEmployees,
    addEmployee
  };
};