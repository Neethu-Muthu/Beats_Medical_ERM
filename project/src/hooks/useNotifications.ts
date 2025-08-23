import { useState, useEffect } from 'react';
import { Notification, User } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'beats_medical_notifications';

const loadNotificationsFromStorage = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notifications from storage:', error);
    return [];
  }
};

const saveNotificationsToStorage = (notifications: Notification[]) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to storage:', error);
  }
};

export const useNotifications = (currentUser: User | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Check for deadline notifications daily
      checkDeadlineNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const allNotifications = loadNotificationsFromStorage();
      
      // Filter notifications based on user role
      let userNotifications: Notification[] = [];
      
      if (currentUser.role === 'CEO' || currentUser.role === 'Director') {
        // CEO and Directors see all notifications
        userNotifications = allNotifications;
      } else {
        // Employees only see their own notifications
        userNotifications = allNotifications.filter(notification => 
          notification.user_id === currentUser.id
        );
      }
      
      // Sort by creation date (newest first)
      userNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDeadlineNotifications = () => {
    if (!currentUser) return;

    try {
      // Load tasks from storage
      const tasksStored = localStorage.getItem('beats_medical_tasks');
      if (!tasksStored) return;

      const tasks = JSON.parse(tasksStored);
      const today = new Date().toISOString().split('T')[0];
      
      // Find tasks due today that are not completed
      const dueTasks = tasks.filter((task: any) => 
        task.due_date === today && 
        task.status !== 'completed'
      );

      // Create deadline notifications
      dueTasks.forEach((task: any) => {
        const existingNotifications = loadNotificationsFromStorage();
        
        // Check if notification already exists for this task today
        const notificationExists = existingNotifications.some(notification =>
          notification.type === 'task_deadline' &&
          notification.related_id === task.id &&
          notification.created_at.split('T')[0] === today
        );

        if (!notificationExists) {
          // Create notification for assigned employee
          addNotification({
            type: 'task_deadline',
            title: 'Task Due Today',
            message: `Task "${task.title}" is due today`,
            user_id: task.assigned_to,
            related_id: task.id
          });

          // If current user is CEO/Director and not the assigned person, notify them too
          if ((currentUser.role === 'CEO' || currentUser.role === 'Director') && 
              currentUser.id !== task.assigned_to) {
            addNotification({
              type: 'task_deadline',
              title: 'Task Due Today',
              message: `Task "${task.title}" assigned to employee is due today`,
              user_id: currentUser.id,
              related_id: task.id
            });
          }
        }
      });
    } catch (error) {
      console.error('Error checking deadline notifications:', error);
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
    try {
      const newNotification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...notificationData,
        read: false,
        created_at: new Date().toISOString()
      };

      const allNotifications = loadNotificationsFromStorage();
      const updatedNotifications = [newNotification, ...allNotifications];
      
      saveNotificationsToStorage(updatedNotifications);
      
      // Update local state if this notification is for current user or if user is CEO/Director
      if (currentUser && 
          (notificationData.user_id === currentUser.id || 
           currentUser.role === 'CEO' || 
           currentUser.role === 'Director')) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      const allNotifications = loadNotificationsFromStorage();
      const updatedNotifications = allNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      saveNotificationsToStorage(updatedNotifications);
      
      // Update local state based on user role
      if (currentUser && (currentUser.role === 'CEO' || currentUser.role === 'Director')) {
        setNotifications(updatedNotifications);
      } else if (currentUser) {
        // For employees, only show notifications assigned to them
        const userNotifications = updatedNotifications.filter(notification => 
          notification.user_id === currentUser.id
        );
        setNotifications(userNotifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    try {
      const allNotifications = loadNotificationsFromStorage();
      const updatedNotifications = allNotifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      saveNotificationsToStorage(updatedNotifications);
      
      // Update local state based on user role
      if (currentUser && (currentUser.role === 'CEO' || currentUser.role === 'Director')) {
        setNotifications(updatedNotifications);
      } else if (currentUser) {
        // For employees, only show notifications assigned to them
        const userNotifications = updatedNotifications.filter(notification => 
          notification.user_id === currentUser.id
        );
        setNotifications(userNotifications);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    try {
      const allNotifications = loadNotificationsFromStorage();
      const updatedNotifications = allNotifications.filter(
        notification => notification.id !== notificationId
      );
      
      saveNotificationsToStorage(updatedNotifications);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  return {
    notifications,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    refetch: fetchNotifications
  };
};