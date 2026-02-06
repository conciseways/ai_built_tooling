/**
 * IndexedDB Database Module
 * Handles all database operations for the Time Tracker PWA
 */

const DB = {
  // Database configuration
  name: 'TimeTrackerDB',
  version: 1,
  storeName: 'timeEntries',
  
  // Database connection
  db: null,
  
  /**
   * Initialize the database
   * @returns {Promise} - Resolves when the database is ready
   */
  init() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }
      
      console.log('Initializing IndexedDB...');
      
      // Check for IndexedDB support
      if (!window.indexedDB) {
        console.error('IndexedDB not supported');
        reject('IndexedDB not supported by your browser');
        return;
      }
      
      // Open the database
      const request = indexedDB.open(this.name, this.version);
      
      // Handle database upgrade (first time or version change)
      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed');
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('time', 'time', { unique: false });
          console.log('Object store created');
        }
      };
      
      // Handle success
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');
        resolve(this.db);
      };
      
      // Handle error
      request.onerror = (event) => {
        console.error('Database initialization error:', event.target.error);
        reject('Could not initialize database');
      };
    });
  },
  
  /**
   * Get all time entries
   * @returns {Promise<Array>} - Resolves with array of entries
   */
  getEntries() {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.getAll();
          
          request.onsuccess = (event) => {
            const entries = event.target.result;
            console.log(`Retrieved ${entries.length} entries`);
            resolve(entries);
          };
          
          request.onerror = (event) => {
            console.error('Error getting entries:', event.target.error);
            reject('Could not retrieve entries');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Get a single entry by ID
   * @param {string} id - Entry ID
   * @returns {Promise<Object>} - Resolves with the entry object
   */
  getEntry(id) {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.get(id);
          
          request.onsuccess = (event) => {
            const entry = event.target.result;
            if (entry) {
              resolve(entry);
            } else {
              reject(`Entry with ID ${id} not found`);
            }
          };
          
          request.onerror = (event) => {
            console.error('Error getting entry:', event.target.error);
            reject('Could not retrieve entry');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Add a new time entry
   * @param {Object} entry - Entry object with id, time, and note properties
   * @returns {Promise} - Resolves when entry is added
   */
  addEntry(entry) {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.add(entry);
          
          request.onsuccess = () => {
            console.log('Entry added successfully');
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error adding entry:', event.target.error);
            reject('Could not add entry');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Update an existing time entry
   * @param {Object} entry - Entry object with id, time, and note properties
   * @returns {Promise} - Resolves when entry is updated
   */
  updateEntry(entry) {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.put(entry);
          
          request.onsuccess = () => {
            console.log('Entry updated successfully');
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error updating entry:', event.target.error);
            reject('Could not update entry');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Delete a time entry
   * @param {string} id - Entry ID
   * @returns {Promise} - Resolves when entry is deleted
   */
  deleteEntry(id) {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.delete(id);
          
          request.onsuccess = () => {
            console.log('Entry deleted successfully');
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error deleting entry:', event.target.error);
            reject('Could not delete entry');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Count all entries in the database
   * @returns {Promise<number>} - Resolves with the count
   */
  countEntries() {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.count();
          
          request.onsuccess = (event) => {
            const count = event.target.result;
            console.log(`Entry count: ${count}`);
            resolve(count);
          };
          
          request.onerror = (event) => {
            console.error('Error counting entries:', event.target.error);
            reject('Could not count entries');
          };
        })
        .catch(error => reject(error));
    });
  },
  
  /**
   * Clear all entries from the database
   * @returns {Promise} - Resolves when all entries are cleared
   */
  clearEntries() {
    return new Promise((resolve, reject) => {
      this.init()
        .then(db => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.clear();
          
          request.onsuccess = () => {
            console.log('All entries cleared');
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error clearing entries:', event.target.error);
            reject('Could not clear entries');
          };
        })
        .catch(error => reject(error));
    });
  }
};
