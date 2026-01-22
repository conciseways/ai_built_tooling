// Import modules
import { TaskManager } from './taskManager.js';
import { UIController } from './uiController.js';
import { StorageService } from './storageService.js';

// Main App Class
class App {
  constructor() {
    // Initialize services
    this.storage = new StorageService();
    this.taskManager = new TaskManager(this.storage);
    this.ui = new UIController(this.taskManager);
    
    // Initialize the application
    this.init();
  }
  
  init() {
    // Load saved data
    this.taskManager.loadTasks();
    
    // Initialize UI
    this.ui.initializeUI();
    
    // Load user settings
    this.loadSettings();
    
    console.log('Fast Tracker application initialized');
  }
  
  loadSettings() {
    const settings = this.storage.getItem('settings');
    if (settings) {
      // Apply saved settings
      const parsedSettings = JSON.parse(settings);
      
      // Apply theme
      if (parsedSettings.theme) {
        document.body.dataset.theme = parsedSettings.theme;
      }
      
      // Load username if available
      if (parsedSettings.username) {
        document.getElementById('username').value = parsedSettings.username;
      }
    }
  }
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
