// Storage Service Class - Handles data persistence
export class StorageService {
  constructor() {
    this.storage = window.localStorage;
    this.prefix = 'fast-tracker-';
  }
  
  // Get item from storage
  getItem(key) {
    return this.storage.getItem(this.prefix + key);
  }
  
  // Set item in storage
  setItem(key, value) {
    this.storage.setItem(this.prefix + key, value);
  }
  
  // Remove item from storage
  removeItem(key) {
    this.storage.removeItem(this.prefix + key);
  }
  
  // Clear all app data
  clearAll() {
    // Only clear items with our prefix
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }
  
  // Check if an item exists
  hasItem(key) {
    return this.storage.getItem(this.prefix + key) !== null;
  }
}
