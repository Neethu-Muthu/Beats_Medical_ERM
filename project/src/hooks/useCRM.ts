import { useState, useEffect } from 'react';
import { Lead, Customer } from '../types';

const LEADS_STORAGE_KEY = 'beats_medical_leads';
const CUSTOMERS_STORAGE_KEY = 'beats_medical_customers';

const loadLeadsFromStorage = (): Lead[] => {
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading leads from storage:', error);
    return [];
  }
};

const loadCustomersFromStorage = (): Customer[] => {
  try {
    const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading customers from storage:', error);
    return [];
  }
};

const saveLeadsToStorage = (leads: Lead[]) => {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Error saving leads to storage:', error);
  }
};

const saveCustomersToStorage = (customers: Customer[]) => {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers to storage:', error);
  }
};

export const useCRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const loadedLeads = loadLeadsFromStorage();
      const loadedCustomers = loadCustomersFromStorage();
      setLeads(loadedLeads);
      setCustomers(loadedCustomers);
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLead: Lead = {
        id: Date.now().toString(),
        ...leadData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const updatedLeads = [newLead, ...leads];
      setLeads(updatedLeads);
      saveLeadsToStorage(updatedLeads);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...customerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      saveCustomersToStorage(updatedCustomers);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const convertLeadToCustomer = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      // Create customer from lead
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        address: lead.address || '',
        status: 'active',
        total_value: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Remove from leads
      const updatedLeads = leads.filter(l => l.id !== leadId);
      setLeads(updatedLeads);
      saveLeadsToStorage(updatedLeads);

      // Add to customers
      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      saveCustomersToStorage(updatedCustomers);
    } catch (error) {
      console.error('Error converting lead to customer:', error);
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const updatedLeads = leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, ...updates, updated_at: new Date().toISOString() }
          : lead
      );
      
      setLeads(updatedLeads);
      saveLeadsToStorage(updatedLeads);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const updatedLeads = leads.filter(lead => lead.id !== leadId);
      setLeads(updatedLeads);
      saveLeadsToStorage(updatedLeads);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      setCustomers(updatedCustomers);
      saveCustomersToStorage(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return {
    leads,
    customers,
    loading,
    addLead,
    addCustomer,
    convertLeadToCustomer,
    updateLead,
    deleteLead,
    deleteCustomer,
    refetch: fetchData
  };
};