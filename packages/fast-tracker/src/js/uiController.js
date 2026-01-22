// UI Controller Class - Handles UI interactions and updates
export class UIController {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.currentSection = 'dashboard';
    
    // DOM Elements
    this.elements = {
      navLinks: document.querySelectorAll('nav a'),
      sections: document.querySelectorAll('main section'),
      addTaskBtn: document.getElementById('add-task'),
      taskList: document.getElementById('task-list'),
      settingsForm: document.getElementById('settings-form'),
      statsElements: {
        total: document.querySelector('.stat:nth-child(1) .stat-value'),
        completed: document.querySelector('.stat:nth-child(2) .stat-value'),
        pending: document.querySelector('.stat:nth-child(3) .stat-value')
      },
      showCompletedCheckbox: document.querySelector('.task-filters input[type="checkbox"]')
    };
  }
  
  // Initialize the UI
  initializeUI() {
    // Set up navigation
    this.setupNavigation();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Add task manager listener
    this.taskManager.addListener(() => this.updateUI());
    
    // Initial UI update
    this.updateUI();
  }
  
  // Set up navigation between sections
  setupNavigation() {
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.showSection(targetId);
      });
    });
    
    // Show default section
    this.showSection(this.currentSection);
  }
  
  // Show a specific section
  showSection(sectionId) {
    this.currentSection = sectionId;
    
    // Hide all sections
    this.elements.sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }
  
  // Set up event listeners
  setupEventListeners() {
    // Add task button
    this.elements.addTaskBtn.addEventListener('click', () => {
      this.showAddTaskModal();
    });
    
    // Settings form
    this.elements.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveSettings();
    });
    
    // Show/hide completed tasks
    this.elements.showCompletedCheckbox.addEventListener('change', () => {
      this.updateTaskList();
    });
  }
  
  // Show modal to add a new task
  showAddTaskModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>Add New Task</h3>
        <form id="add-task-form">
          <div class="form-group">
            <label for="task-title">Title</label>
            <input type="text" id="task-title" required>
          </div>
          <div class="form-group">
            <label for="task-description">Description (optional)</label>
            <textarea id="task-description"></textarea>
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Form submission
    const form = modal.querySelector('#add-task-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      
      if (title.trim()) {
        this.taskManager.addTask(title, description);
        document.body.removeChild(modal);
      }
    });
    
    // Focus on title input
    setTimeout(() => {
      document.getElementById('task-title').focus();
    }, 100);
  }
  
  // Update the UI with current data
  updateUI() {
    this.updateTaskList();
    this.updateDashboardStats();
  }
  
  // Update the task list
  updateTaskList() {
    const tasks = this.taskManager.getAllTasks();
    const showCompleted = this.elements.showCompletedCheckbox.checked;
    
    // Clear the task list
    this.elements.taskList.innerHTML = '';
    
    // Filter tasks if needed
    const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.completed);
    
    // Add tasks to the list
    if (filteredTasks.length === 0) {
      this.elements.taskList.innerHTML = '<p class="empty-list">No tasks to display</p>';
    } else {
      filteredTasks.forEach(task => {
        const taskElement = this.createTaskElement(task);
        this.elements.taskList.appendChild(taskElement);
      });
    }
  }
  
  // Create a task list item element
  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    taskElement.dataset.id = task.id;
    
    taskElement.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-title">${task.title}</div>
      <div class="task-actions">
        <button class="edit-task">Edit</button>
        <button class="delete-task">Delete</button>
      </div>
    `;
    
    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
      this.taskManager.toggleTaskStatus(task.id);
    });
    
    const editBtn = taskElement.querySelector('.edit-task');
    editBtn.addEventListener('click', () => {
      this.showEditTaskModal(task);
    });
    
    const deleteBtn = taskElement.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) {
        this.taskManager.deleteTask(task.id);
      }
    });
    
    return taskElement;
  }
  
  // Show modal to edit a task
  showEditTaskModal(task) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>Edit Task</h3>
        <form id="edit-task-form">
          <div class="form-group">
            <label for="edit-task-title">Title</label>
            <input type="text" id="edit-task-title" value="${task.title}" required>
          </div>
          <div class="form-group">
            <label for="edit-task-description">Description (optional)</label>
            <textarea id="edit-task-description">${task.description || ''}</textarea>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Form submission
    const form = modal.querySelector('#edit-task-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('edit-task-title').value;
      const description = document.getElementById('edit-task-description').value;
      
      if (title.trim()) {
        this.taskManager.updateTask(task.id, { title, description });
        document.body.removeChild(modal);
      }
    });
    
    // Focus on title input
    setTimeout(() => {
      document.getElementById('edit-task-title').focus();
    }, 100);
  }
  
  // Update dashboard statistics
  updateDashboardStats() {
    const stats = this.taskManager.getTaskStats();
    
    this.elements.statsElements.total.textContent = stats.total;
    this.elements.statsElements.completed.textContent = stats.completed;
    this.elements.statsElements.pending.textContent = stats.pending;
  }
  
  // Save user settings
  saveSettings() {
    const username = document.getElementById('username').value;
    const theme = document.getElementById('theme').value;
    
    const settings = {
      username,
      theme
    };
    
    // Save to storage
    this.taskManager.storageService.setItem('settings', JSON.stringify(settings));
    
    // Apply theme
    document.body.dataset.theme = theme;
    
    // Show confirmation
    alert('Settings saved successfully!');
  }
}
