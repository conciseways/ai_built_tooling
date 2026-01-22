// Task Manager Class - Handles task data and operations
class TaskManager {
  constructor(storageService) {
    this.storageService = storageService;
    this.tasks = [];
    this.listeners = [];
  }
  
  // Load tasks from storage
  loadTasks() {
    const savedTasks = this.storageService.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
    return this.tasks;
  }
  
  // Save tasks to storage
  saveTasks() {
    this.storageService.setItem('tasks', JSON.stringify(this.tasks));
    this.notifyListeners();
  }
  
  // Add a new task
  addTask(title, description = '') {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }
  
  // Delete a task by ID
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }
  
  // Toggle task completion status
  toggleTaskStatus(taskId) {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date().toISOString();
      this.saveTasks();
    }
    return task;
  }
  
  // Update task details
  updateTask(taskId, updates) {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date().toISOString() });
      this.saveTasks();
    }
    return task;
  }
  
  // Get all tasks
  getAllTasks() {
    return [...this.tasks];
  }
  
  // Get task statistics
  getTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending
    };
  }
  
  // Add a listener for task changes
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.tasks));
  }
}

module.exports = { TaskManager };
