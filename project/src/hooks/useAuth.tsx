// import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// import { User } from '../types';

// const EMPLOYEES_STORAGE_KEY = 'beats_medical_employees';

// const getEmployeesFromStorage = async (): Promise<User[]> => {
//   try {
//     const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
//     if (stored) {
//       return JSON.parse(stored);
//     }
//     // If no stored data, load from initial data
//     const { employees: employeeData } = await import('../data/employees');
//     localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employeeData));
//     return employeeData;
//   } catch (error) {
//     console.error('Error loading employees from storage:', error);
//     // Fallback to importing directly
//     return [];
//   }
// };

// interface AuthContextType {
//   isAuthenticated: boolean;
//   currentUser: User | null;
//   login: (mobile: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   currentUser: null,
//   login: async () => false,
//   logout: () => {},
//   loading: false
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);

//   const login = async (mobile: string, password: string): Promise<boolean> => {
//     setLoading(true);
    
//     // Get current employees from storage
//     const currentEmployees = await getEmployeesFromStorage();
//     const employee = currentEmployees.find(emp => emp.mobile === mobile);
    
//     if (employee && password === 'beats@123') {
//       setCurrentUser(employee);
//       localStorage.setItem('currentUser', JSON.stringify(employee));
//       setLoading(false);
//       return true;
//     }
    
//     setLoading(false);
//     return false;
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('currentUser');
//   };

//   useEffect(() => {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated: !!currentUser, 
//       currentUser, 
//       login, 
//       logout, 
//       loading 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   return context;
// };


// hooks/useAuth.ts
import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: async () => false,
  logout: () => {},
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Create a fake user object (must satisfy User type)
        const user: User = {
    id: '1',
    name: 'MUHAMMAD RAFEEK KABEER',
    mobile: '565225438',
    role: 'CEO',
    department: 'Executive',
    designation: 'CEO',
    member_id: 'BM16001'
  };
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      return false;
    }
  };


//   const login = async (mobile: string, password: string): Promise<boolean> => {
//   setLoading(true);
//   try {
//     const res = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile, password }),
//     });

//     const data = await res.json();

//     if (data.success && data.user) {
//       setCurrentUser(data.user);
//       localStorage.setItem("currentUser", JSON.stringify(data.user));
//       setLoading(false);
//       return true;
//     } else {
//       setLoading(false);
//       return false;
//     }
//   } catch (err) {
//     console.error("Login error:", err);
//     setLoading(false);
//     return false;
//   }
// };


  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
