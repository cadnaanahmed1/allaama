document.addEventListener('DOMContentLoaded', () => {
  // Define the base URL for the API
  const API_BASE_URL = 'https://allaama-2.onrender.com';
  
  // DOM Elements
  const sections = {
    home: document.getElementById('home-section'),
    login: document.getElementById('login-section'),
    signup: document.getElementById('signup-section'),
    forgotPassword: document.getElementById('forgot-password-section'),
    resetPassword: document.getElementById('reset-password-section'),
    publicCourses: document.getElementById('public-courses-section'),
    courses: document.getElementById('courses-section'),
    dashboard: document.getElementById('dashboard-section'),
    studentSettings: document.getElementById('student-settings-section'),
    courseContent: document.getElementById('course-content-section'),
    sharedCourse: document.getElementById('shared-course-section'),
    admin: document.getElementById('admin-section'),
    adminSettings: document.getElementById('admin-settings-section'),
    about: document.getElementById('about-section'),
    contact: document.getElementById('contact-section')
  };
  
  const navLinks = {
    home: document.getElementById('home-link'),
    courses: document.getElementById('courses-link'),
    dashboard: document.getElementById('dashboard-link'),
    studentSettings: document.getElementById('student-settings-link'),
    admin: document.getElementById('admin-link'),
    adminSettings: document.getElementById('admin-settings-link'),
    login: document.getElementById('login-link'),
    signup: document.getElementById('signup-link'),
    logout: document.getElementById('logout-link'),
    about: document.getElementById('about-link'),
    contact: document.getElementById('contact-link')
  };
  
  const authForms = {
    login: document.getElementById('login-form'),
    signup: document.getElementById('signup-form'),
    forgotPassword: document.getElementById('forgot-password-form'),
    resetPassword: document.getElementById('reset-password-form'),
    adminSettings: document.getElementById('admin-settings-form'),
    studentSettings: document.getElementById('student-settings-form')
  };
  
  const authMessages = {
    login: document.getElementById('login-message'),
    signup: document.getElementById('signup-message'),
    forgotPassword: document.getElementById('forgot-password-message'),
    resetPassword: document.getElementById('reset-password-message'),
    adminSettings: document.getElementById('admin-settings-message'),
    studentSettings: document.getElementById('student-settings-message')
  };
  
  const authToggles = {
    showSignup: document.getElementById('show-signup'),
    showLogin: document.getElementById('show-login'),
    showForgotPassword: document.getElementById('show-forgot-password'),
    backToLogin: document.getElementById('back-to-login'),
    backToForgotPassword: document.getElementById('back-to-forgot-password'),
    loginFromCourses: document.getElementById('login-from-courses'),
    signupFromCourses: document.getElementById('signup-from-courses')
  };
  
  const exploreCourses = document.getElementById('explore-courses');
  const publicCoursePanelsContainer = document.getElementById('course-panels-container');
  const coursePanelsContainer = document.getElementById('course-panels-container-logged');
  const publicCourseContainer = document.getElementById('public-course-container');
  const courseContainer = document.getElementById('course-container');
  const adminCourseContainer = document.getElementById('admin-course-container');
  const adminCategoryContainer = document.getElementById('admin-category-container');
  const enrollmentContainer = document.getElementById('enrollment-container');
  const enrollmentTableBody = document.getElementById('enrollment-table-body');
  const userTableBody = document.getElementById('user-table-body');
  const studentName = document.getElementById('student-name');
  
  // Course Content Elements
  const courseContentSection = document.getElementById('course-content-section');
  const courseTitle = document.getElementById('course-title');
  const courseInstructor = document.getElementById('course-instructor');
  const courseModulesContainer = document.getElementById('course-modules-container');
  const backToDashboardBtn = document.getElementById('back-to-dashboard');
  
  // Shared Course Elements
  const sharedCourseSection = document.getElementById('shared-course-section');
  const sharedCourseTitle = document.getElementById('shared-course-title');
  const sharedCourseInstructor = document.getElementById('shared-course-instructor');
  const sharedCourseModulesContainer = document.getElementById('shared-course-modules-container');
  const sharedCourseAccessMessage = document.getElementById('shared-course-access-message');
  const backToHomeBtn = document.getElementById('back-to-home');
  
  // Search Elements
  const courseSearchInput = document.getElementById('course-search');
  const courseSearchLoggedInput = document.getElementById('course-search-logged');
  const searchButton = document.getElementById('search-button');
  const searchButtonLogged = document.getElementById('search-button-logged');
  
  // Modals
  const courseModal = document.getElementById('course-modal');
  const categoryModal = document.getElementById('category-modal');
  const viewCourseModal = document.getElementById('view-course-modal');
  const userModal = document.getElementById('user-modal');
  const userEnrollmentsModal = document.getElementById('user-enrollments-modal');
  const enrollmentConfirmationModal = document.getElementById('enrollment-confirmation-modal');
  const courseForm = document.getElementById('course-form');
  const categoryForm = document.getElementById('category-form');
  const addCourseBtn = document.getElementById('add-course-btn');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const addModuleBtn = document.getElementById('add-module-btn');
  const modulesContainer = document.getElementById('modules-container');
  const modalTitle = document.getElementById('modal-title');
  const categoryModalTitle = document.getElementById('category-modal-title');
  const courseIdInput = document.getElementById('course-id');
  const categoryIdInput = document.getElementById('category-id');
  const courseCategorySelect = document.getElementById('course-category');
  
  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // State
  let currentUser = null;
  let authToken = localStorage.getItem('authToken');
  let allCourses = [];
  let allCategories = [];
  
  // Helper function to validate and fix image URLs
  function validateImageUrl(url) {
    if (!url) return null;
    
    // Remove quotes if they exist
    let cleanUrl = url.replace(/^"|"$/g, '');
    
    // Check if it's a valid URL
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch (e) {
      console.error('Invalid image URL:', cleanUrl);
      return null;
    }
  }
  
  // Create Beautiful Notification
  function createNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';
    else if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
    else icon = '<i class="fas fa-info-circle"></i>';
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }
  
  // Create Beautiful Loading Spinner
  function createLoadingSpinner(container) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    
    // Clear container and add spinner
    container.innerHTML = '';
    container.appendChild(spinner);
    
    return spinner;
  }
  
  // Create Beautiful Progress Bar
  function createProgressBar(progress, container) {
    const progressBar = document.createElement('div');
    progressBar.className = 'beautiful-progress';
    progressBar.innerHTML = `
      <div class="progress-info">
        <span class="progress-text">${progress}% Complete</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    `;
    
    container.innerHTML = '';
    container.appendChild(progressBar);
    
    return progressBar;
  }
  
  // Create Beautiful Card
  function createBeautifulCard(title, content, actions = '') {
    const card = document.createElement('div');
    card.className = 'beautiful-card';
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
      </div>
      <div class="card-body">
        ${content}
      </div>
      ${actions ? `<div class="card-footer">${actions}</div>` : ''}
    `;
    
    return card;
  }
  
  // Create Beautiful Button
  function createBeautifulButton(text, type = 'primary', icon = '') {
    const button = document.createElement('button');
    button.className = `btn btn-${type}`;
    
    let iconHtml = '';
    if (icon) {
      iconHtml = `<i class="${icon}"></i> `;
    }
    
    button.innerHTML = `${iconHtml}${text}`;
    
    // Add ripple effect
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
    
    return button;
  }
  
  // Initialize app
  function init() {
    // Check if user is logged in
    if (authToken) {
      verifyTokenWithServer();
    } else {
      // Show home section immediately without waiting for animations
      showSection('home');
      updateUI();
      loadPublicCourses(); // Load public courses for non-logged in users
    }
    
    // Event listeners
    setupEventListeners();
    
    // Add beautiful entrance animations
    addEntranceAnimations();
    
    // Ensure home section is visible after a short delay
    setTimeout(() => {
      if (!authToken && sections.home) {
        sections.home.style.opacity = '1';
        sections.home.style.transform = 'translateY(0)';
      }
    }, 100);
    
    // Check for shared course link in URL
    checkForSharedCourse();
  }
  
  // Check for shared course link in URL
  function checkForSharedCourse() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    
    if (courseId) {
      // Load shared course
      loadSharedCourse(courseId);
    }
  }
  
  // Add entrance animations
  function addEntranceAnimations() {
    // Add fade-in animation to sections, but skip home section initially
    Object.entries(sections).forEach(([name, section]) => {
      if (section && name !== 'home') {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }
    });
  }
  
  function verifyTokenWithServer() {
    if (!authToken) {
      logout();
      return;
    }
    
    fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
      return response.json();
    })
    .then(data => {
      currentUser = data.user;
      updateUI();
      showSection('home');
      createNotification(`Welcome back, ${currentUser.name}!`, 'success');
    })
    .catch(error => {
      console.error('Token verification failed:', error);
      logout();
    });
  }
  
  // Update the logout function
  function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateUI();
    showSection('home');
    
    // Only try to load public courses if we're not in the middle of a server error
    try {
      loadPublicCourses();
    } catch (error) {
      console.error('Error loading public courses during logout:', error);
      // Don't show an error notification during logout to avoid confusion
    }
  }
  
  // Load public courses (for non-logged in users)
  function loadPublicCourses() {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(publicCoursePanelsContainer);
    
    // First load categories
    fetch(`${API_BASE_URL}/api/public/categories`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(categories => {
      allCategories = categories;
      
      // Then load courses
      return fetch(`${API_BASE_URL}/api/public/courses`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(courses => {
      console.log('Public courses data:', courses);
      
      // Check if the response is an array
      if (!Array.isArray(courses)) {
        throw new Error('Expected an array of courses');
      }
      
      // Remove spinner
      spinner.remove();
      
      allCourses = courses;
      
      // Group courses by category
      const coursesByCategory = {};
      
      // Initialize with all categories
      allCategories.forEach(category => {
        coursesByCategory[category._id] = {
          category: category,
          courses: []
        };
      });
      
      // Add courses to their categories
      courses.forEach(course => {
        if (course.category && coursesByCategory[course.category]) {
          coursesByCategory[course.category].courses.push(course);
        } else {
          // If course has no category or category doesn't exist, add to "Uncategorized"
          if (!coursesByCategory['uncategorized']) {
            coursesByCategory['uncategorized'] = {
              category: {
                _id: 'uncategorized',
                name: 'Uncategorized',
                description: 'Courses without a category'
              },
              courses: []
            };
          }
          coursesByCategory['uncategorized'].courses.push(course);
        }
      });
      
      // Create course panels
      publicCoursePanelsContainer.innerHTML = '';
      
      Object.values(coursesByCategory).forEach(({ category, courses }, index) => {
        if (courses.length === 0) return; // Skip empty categories
        
        const panel = document.createElement('div');
        panel.className = 'course-panel';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        panel.innerHTML = `
          <div class="panel-header" data-category-id="${category._id}">
            <h3>${category.name}</h3>
            <span class="panel-toggle"><i class="fas fa-chevron-up"></i></span>
          </div>
          <div class="panel-content">
            <div class="course-grid" id="public-courses-${category._id}">
              <!-- Courses will be dynamically loaded here -->
            </div>
          </div>
        `;
        
        publicCoursePanelsContainer.appendChild(panel);
        
        // Add courses to the panel
        const courseGrid = panel.querySelector('.course-grid');
        courses.forEach((course, courseIndex) => {
          const courseCard = createCourseCard(course, false);
          courseGrid.appendChild(courseCard);
          
          // Animate card in with staggered delay
          setTimeout(() => {
            courseCard.style.opacity = '1';
            courseCard.style.transform = 'translateY(0)';
            courseCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, courseIndex * 100);
        });
        
        // Animate panel in with staggered delay
        setTimeout(() => {
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
          panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, index * 100);
        
        // Add event listener to panel header for collapsing/expanding
        const panelHeader = panel.querySelector('.panel-header');
        panelHeader.addEventListener('click', () => {
          const panelContent = panel.querySelector('.panel-content');
          const panelToggle = panel.querySelector('.panel-toggle');
          
          panelHeader.classList.toggle('collapsed');
          panelContent.classList.toggle('collapsed');
        });
      });
      
      // Add event listeners to enroll buttons
      if (currentUser && currentUser.role === 'student') {
        document.querySelectorAll('.enroll-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            showEnrollmentConfirmation(courseId);
          });
        });
      }
      
      // Add event listeners to login buttons for non-logged in users
      if (!currentUser) {
        document.querySelectorAll('.login-to-enroll-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            // Store the course ID in session storage to redirect after login
            sessionStorage.setItem('enrollAfterLogin', courseId);
            showSection('login');
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading public courses:', error);
      
      // Remove spinner and show error
      spinner.remove();
      publicCoursePanelsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load courses. Please check your internet connection and try again later.</p>
        </div>
      `;
      
      // Only show error notification if not already in the process of logging out
      if (authToken) {
        createNotification('Failed to load courses. Please try again later.', 'error');
      }
    });
  }
  
  // Load courses for logged-in users
  function loadCourses() {
    console.log('Loading courses...');
    console.log('Current user:', currentUser);
    console.log('Auth token:', authToken ? 'Present' : 'Missing');
    
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(coursePanelsContainer);
    
    // Check if user is authenticated
    if (!authToken || !currentUser) {
      // Redirect to login if not authenticated
      showSection('login');
      return;
    }
    
    // First load categories
    fetch(`${API_BASE_URL}/api/public/categories`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(categories => {
      allCategories = categories;
      
      // Then load courses
      return fetch(`${API_BASE_URL}/api/student/courses`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    })
    .then(response => {
      console.log('Response status:', response.status);
      
      if (response.status === 403) {
        // If forbidden, the token might be expired or invalid
        logout();
        showSection('login');
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    })
    .then(courses => {
      console.log('Response data:', courses);
      
      // Check if the response is an array
      if (!Array.isArray(courses)) {
        throw new Error('Expected an array of courses');
      }
      
      // Remove spinner
      spinner.remove();
      
      allCourses = courses;
      
      // Group courses by category
      const coursesByCategory = {};
      
      // Initialize with all categories
      allCategories.forEach(category => {
        coursesByCategory[category._id] = {
          category: category,
          courses: []
        };
      });
      
      // Add courses to their categories
      courses.forEach(course => {
        if (course.category && coursesByCategory[course.category]) {
          coursesByCategory[course.category].courses.push(course);
        } else {
          // If course has no category or category doesn't exist, add to "Uncategorized"
          if (!coursesByCategory['uncategorized']) {
            coursesByCategory['uncategorized'] = {
              category: {
                _id: 'uncategorized',
                name: 'Uncategorized',
                description: 'Courses without a category'
              },
              courses: []
            };
          }
          coursesByCategory['uncategorized'].courses.push(course);
        }
      });
      
      // Create course panels
      coursePanelsContainer.innerHTML = '';
      
      Object.values(coursesByCategory).forEach(({ category, courses }, index) => {
        if (courses.length === 0) return; // Skip empty categories
        
        const panel = document.createElement('div');
        panel.className = 'course-panel';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        panel.innerHTML = `
          <div class="panel-header" data-category-id="${category._id}">
            <h3>${category.name}</h3>
            <span class="panel-toggle"><i class="fas fa-chevron-up"></i></span>
          </div>
          <div class="panel-content">
            <div class="course-grid" id="courses-${category._id}">
              <!-- Courses will be dynamically loaded here -->
            </div>
          </div>
        `;
        
        coursePanelsContainer.appendChild(panel);
        
        // Add courses to the panel
        const courseGrid = panel.querySelector('.course-grid');
        courses.forEach((course, courseIndex) => {
          const courseCard = createCourseCard(course, true);
          courseGrid.appendChild(courseCard);
          
          // Animate card in with staggered delay
          setTimeout(() => {
            courseCard.style.opacity = '1';
            courseCard.style.transform = 'translateY(0)';
            courseCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, courseIndex * 100);
        });
        
        // Animate panel in with staggered delay
        setTimeout(() => {
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
          panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, index * 100);
        
        // Add event listener to panel header for collapsing/expanding
        const panelHeader = panel.querySelector('.panel-header');
        panelHeader.addEventListener('click', () => {
          const panelContent = panel.querySelector('.panel-content');
          const panelToggle = panel.querySelector('.panel-toggle');
          
          panelHeader.classList.toggle('collapsed');
          panelContent.classList.toggle('collapsed');
        });
      });
      
      // Add event listeners to enroll buttons
      if (currentUser && currentUser.role === 'student') {
        document.querySelectorAll('.enroll-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            showEnrollmentConfirmation(courseId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading courses:', error);
      
      // Remove spinner and show error
      spinner.remove();
      coursePanelsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load courses: ${error.message}</p>
        </div>
      `;
      
      // Show error notification
      createNotification('Failed to load courses', 'error');
    });
  }
  
  // Create course card element
  function createCourseCard(course, isLoggedIn) {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card beautiful-card';
    courseCard.style.opacity = '0';
    courseCard.style.transform = 'translateY(20px)';
    
    // Validate and fix image URL
    const imageUrl = validateImageUrl(course.imageUrl);
    console.log('Using imageUrl:', imageUrl);
    
    courseCard.innerHTML = `
      <div class="card-image">
        ${imageUrl ? 
          `<img src="${imageUrl}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="image-error" style="display: none;">
             <i class="fas fa-exclamation-triangle"></i>
             <p>Image not available</p>
           </div>` : 
          `<div class="image-error">
             <i class="fas fa-exclamation-triangle"></i>
             <p>No image provided</p>
           </div>`
        }
      </div>
      <div class="card-content">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <div class="course-instructor">
            <i class="fas fa-user"></i> ${course.instructor}
          </div>
          <div class="course-price">
            <i class="fas fa-dollar-sign"></i> ${course.price}
          </div>
        </div>
        <div class="course-modules">
          <h4>Course Modules:</h4>
          <ul>
            ${course.modules && Array.isArray(course.modules) ? course.modules.map(module => `
              <li>
                <i class="fas fa-book"></i> ${module.title}
                <span class="module-duration">${module.duration}</span>
              </li>
            `).join('') : '<li>No modules available</li>'}
          </ul>
        </div>
        <div class="course-actions">
          <button class="share-btn btn btn-secondary" data-course-id="${course._id}" data-course-title="${course.title}">
            <i class="fas fa-share-alt"></i> Share
          </button>
          ${isLoggedIn && currentUser && currentUser.role === 'student' ? 
            `<button class="enroll-btn btn btn-primary" data-course-id="${course._id}">
              <i class="fas fa-user-plus"></i> Enroll Now
            </button>` : 
            !isLoggedIn ? 
            `<button class="login-to-enroll-btn btn btn-primary" data-course-id="${course._id}">
              <i class="fas fa-sign-in-alt"></i> Login to Enroll
            </button>` : ''}
        </div>
      </div>
    `;
    
    // Add event listener to share button
    const shareBtn = courseCard.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
      const courseId = e.currentTarget.getAttribute('data-course-id');
      const courseTitle = e.currentTarget.getAttribute('data-course-title');
      shareCourse(courseId, courseTitle);
    });
    
    return courseCard;
  }
  
  // Share course functionality
  function shareCourse(courseId, courseTitle) {
    // Create shareable URL
    const shareableUrl = `${window.location.origin}${window.location.pathname}?course=${courseId}`;
    
    // Create share modal
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal modal';
    shareModal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Share Course</h3>
        <p>Share this course with others:</p>
        <div class="share-link-container">
          <input type="text" id="share-link-input" value="${shareableUrl}" readonly>
          <button id="copy-link-btn" class="btn btn-primary">Copy Link</button>
        </div>
        <div class="share-options">
          <p>Or share via:</p>
          <div class="share-buttons">
            <button class="share-facebook-btn"><i class="fab fa-facebook-f"></i></button>
            <button class="share-twitter-btn"><i class="fab fa-twitter"></i></button>
            <button class="share-whatsapp-btn"><i class="fab fa-whatsapp"></i></button>
            <button class="share-email-btn"><i class="fas fa-envelope"></i></button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Show modal with animation
    shareModal.style.display = 'block';
    shareModal.style.opacity = '0';
    shareModal.style.transform = 'scale(0.9)';
    
    // Trigger reflow
    shareModal.offsetHeight;
    
    // Animate in
    shareModal.style.opacity = '1';
    shareModal.style.transform = 'scale(1)';
    shareModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add event listeners
    const closeBtn = shareModal.querySelector('.close');
    const copyBtn = shareModal.querySelector('#copy-link-btn');
    const shareLinkInput = shareModal.querySelector('#share-link-input');
    const facebookBtn = shareModal.querySelector('.share-facebook-btn');
    const twitterBtn = shareModal.querySelector('.share-twitter-btn');
    const whatsappBtn = shareModal.querySelector('.share-whatsapp-btn');
    const emailBtn = shareModal.querySelector('.share-email-btn');
    
    const closeModal = () => {
      shareModal.style.opacity = '0';
      shareModal.style.transform = 'scale(0.9)';
      shareModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        shareModal.remove();
      }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    copyBtn.addEventListener('click', () => {
      shareLinkInput.select();
      document.execCommand('copy');
      createNotification('Link copied to clipboard!', 'success');
    });
    
    facebookBtn.addEventListener('click', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`, '_blank');
    });
    
    twitterBtn.addEventListener('click', () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(`Check out this course: ${courseTitle}`)}`, '_blank');
    });
    
    whatsappBtn.addEventListener('click', () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this course: ${courseTitle} ${shareableUrl}`)}`, '_blank');
    });
    
    emailBtn.addEventListener('click', () => {
      window.location.href = `mailto:?subject=${encodeURIComponent(`Check out this course: ${courseTitle}`)}&body=${encodeURIComponent(`I thought you might be interested in this course: ${courseTitle}\n\n${shareableUrl}`)}`;
    });
  }
  
  // Load shared course
  function loadSharedCourse(courseId) {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(sharedCourseModulesContainer);
    
    // Fetch course details
    fetch(`${API_BASE_URL}/api/public/courses/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Course not found');
      }
      return response.json();
    })
    .then(course => {
      // Remove spinner
      spinner.remove();
      
      // Set course details
      sharedCourseTitle.textContent = course.title;
      sharedCourseInstructor.textContent = `Instructor: ${course.instructor}`;
      
      // Check if user is logged in and enrolled
      if (currentUser && currentUser.role === 'student') {
        // Check if user is enrolled in this course
        return fetch(`${API_BASE_URL}/api/student/check-enrollment/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
        .then(response => response.json())
        .then(enrollmentData => {
          if (enrollmentData.enrolled && enrollmentData.status === 'active') {
            // User is enrolled, show course content
            renderCourseModules(course, sharedCourseModulesContainer);
            sharedCourseAccessMessage.style.display = 'none';
          } else {
            // User is not enrolled, show access message
            sharedCourseAccessMessage.innerHTML = `
              <div class="access-message">
                <p>You are not enrolled in this course. Please enroll to access the content.</p>
                <button class="enroll-btn btn btn-primary" data-course-id="${courseId}">Enroll Now</button>
              </div>
            `;
            sharedCourseAccessMessage.style.display = 'block';
            sharedCourseModulesContainer.innerHTML = '';
            
            // Add event listener to enroll button
            const enrollBtn = sharedCourseAccessMessage.querySelector('.enroll-btn');
            enrollBtn.addEventListener('click', () => {
              showEnrollmentConfirmation(courseId);
            });
          }
        });
      } else {
        // User is not logged in, show access message
        sharedCourseAccessMessage.innerHTML = `
          <div class="access-message">
            <p>Please <a href="#" id="login-to-access">login</a> or <a href="#" id="signup-to-access">sign up</a> to enroll in this course.</p>
          </div>
        `;
        sharedCourseAccessMessage.style.display = 'block';
        sharedCourseModulesContainer.innerHTML = '';
        
        // Add event listeners to login and signup links
        const loginLink = sharedCourseAccessMessage.querySelector('#login-to-access');
        const signupLink = sharedCourseAccessMessage.querySelector('#signup-to-access');
        
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('enrollAfterLogin', courseId);
          showSection('login');
        });
        
        signupLink.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('enrollAfterLogin', courseId);
          showSection('signup');
        });
      }
      
      // Show shared course section
      showSection('sharedCourse');
    })
    .catch(error => {
      console.error('Error loading shared course:', error);
      
      // Remove spinner and show error
      spinner.remove();
      sharedCourseModulesContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load course. The course may not exist or has been removed.</p>
        </div>
      `;
      
      // Show shared course section with error
      showSection('sharedCourse');
    });
  }
  
  // Render course modules
  function renderCourseModules(course, container) {
    container.innerHTML = '';
    
    // Create beautiful module cards
    course.modules.forEach((module, moduleIndex) => {
      const moduleElement = document.createElement('div');
      moduleElement.className = 'course-module beautiful-card';
      moduleElement.style.opacity = '0';
      moduleElement.style.transform = 'translateY(20px)';
      
      moduleElement.innerHTML = `
        <div class="card-header">
          <h3><i class="fas fa-book"></i> ${module.title}</h3>
          <span class="module-duration"><i class="fas fa-clock"></i> ${module.duration}</span>
        </div>
        <div class="card-body">
          <div class="lessons-container">
            ${module.lessons.map((lesson, lessonIndex) => `
              <div class="lesson">
                <h4><i class="fas fa-play-circle"></i> ${lesson.title}</h4>
                <p class="lesson-duration"><i class="fas fa-clock"></i> Duration: ${lesson.duration}</p>
                <div class="video-container">
                  ${lesson.videoUrl ? 
                    `<iframe 
                      src="${lesson.videoUrl}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen>
                    </iframe>` : 
                    '<div class="no-video"><i class="fas fa-video-slash"></i> No video available for this lesson</div>'
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      container.appendChild(moduleElement);
      
      // Animate module in with staggered delay
      setTimeout(() => {
        moduleElement.style.opacity = '1';
        moduleElement.style.transform = 'translateY(0)';
        moduleElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, moduleIndex * 100);
    });
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // About and Contact navigation
    navLinks.about.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('about');
    });
    
    navLinks.contact.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('contact');
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactForm);
    }
    
    // FAQ accordion functionality
    document.addEventListener('DOMContentLoaded', () => {
      const faqItems = document.querySelectorAll('.faq-item h4');
      faqItems.forEach(item => {
        item.addEventListener('click', () => {
          const faqItem = item.parentElement;
          faqItem.classList.toggle('active');
        });
      });
    });

    // Navigation
    navLinks.home.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('home');
    });
    
    navLinks.courses.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser) {
        if (currentUser.role === 'admin') {
          showSection('courses');
          loadAdminCourses();
        } else {
          showSection('courses');
          loadCourses();
        }
      } else {
        showSection('publicCourses');
        loadPublicCourses();
      }
    });
    
    navLinks.dashboard.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser && currentUser.role === 'student') {
        showSection('dashboard');
        loadStudentDashboard();
      }
    });
    
    navLinks.studentSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser && currentUser.role === 'student') {
        showSection('studentSettings');
        loadStudentSettings();
      }
    });
    
    navLinks.admin.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser && currentUser.role === 'admin') {
        showSection('admin');
        loadAdminDashboard();
      }
    });
    
    navLinks.adminSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser && currentUser.role === 'admin') {
        showSection('adminSettings');
        loadAdminSettings();
      }
    });
    
    navLinks.login.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('login');
    });
    
    navLinks.signup.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('signup');
    });
    
    navLinks.logout.addEventListener('click', (e) => {
      e.preventDefault();
      createNotification('Logging out...', 'info');
      setTimeout(() => {
        logout();
        createNotification('You have been logged out successfully', 'success');
      }, 500);
    });
    
    // Auth forms
    authForms.login.addEventListener('submit', handleLogin);
    authForms.signup.addEventListener('submit', handleSignup);
    authForms.forgotPassword.addEventListener('submit', handleForgotPassword);
    authForms.resetPassword.addEventListener('submit', handleResetPassword);
    authForms.adminSettings.addEventListener('submit', handleAdminSettings);
    authForms.studentSettings.addEventListener('submit', handleStudentSettings);
    
    // Auth toggles
    authToggles.showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('signup');
    });
    
    authToggles.showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('login');
    });
    
    authToggles.showForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('forgotPassword');
    });
    
    authToggles.backToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('login');
    });
    
    authToggles.backToForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('forgotPassword');
    });
    
    authToggles.loginFromCourses.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('login');
    });
    
    authToggles.signupFromCourses.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('signup');
    });
    
    // Explore courses
    exploreCourses.addEventListener('click', (e) => {
      e.preventDefault();
      // Always show public courses for the Home Page Explore Courses button
      showSection('publicCourses');
      loadPublicCourses();
    });
    
    // Back to home button
    if (backToHomeBtn) {
      backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
      });
    }
    
    // Course search functionality
    if (courseSearchInput && searchButton) {
      searchButton.addEventListener('click', () => {
        performCourseSearch(courseSearchInput.value, false);
      });
      
      courseSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          performCourseSearch(courseSearchInput.value, false);
        }
      });
    }
    
    if (courseSearchLoggedInput && searchButtonLogged) {
      searchButtonLogged.addEventListener('click', () => {
        performCourseSearch(courseSearchLoggedInput.value, true);
      });
      
      courseSearchLoggedInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          performCourseSearch(courseSearchLoggedInput.value, true);
        }
      });
    }
    
    // Course modal
    addCourseBtn.addEventListener('click', () => {
      openCourseModal();
    });
    
    // Category modal
    addCategoryBtn.addEventListener('click', () => {
      openCategoryModal();
    });
    
    addModuleBtn.addEventListener('click', () => {
      addModuleInput();
    });
    
    courseForm.addEventListener('submit', handleCourseSubmit);
    categoryForm.addEventListener('submit', handleCategorySubmit);
    
    // Tab buttons
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        showTab(tabId);
      });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => {
        courseModal.style.display = 'none';
        categoryModal.style.display = 'none';
        viewCourseModal.style.display = 'none';
        userModal.style.display = 'none';
        userEnrollmentsModal.style.display = 'none';
        enrollmentConfirmationModal.style.display = 'none';
      });
    });
    
    // Module remove buttons (event delegation)
    modulesContainer.addEventListener('click', (e) => {
      if (e.target.closest('.remove-module')) {
        // Add animation before removing
        const moduleElement = e.target.closest('.module-input');
        moduleElement.style.transform = 'translateX(-100%)';
        moduleElement.style.opacity = '0';
        moduleElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        setTimeout(() => {
          moduleElement.remove();
        }, 300);
      }
    });
    
    // Back to dashboard button
    backToDashboardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('dashboard');
    });
    
    // Enrollment confirmation
    const confirmEnrollmentBtn = document.getElementById('confirm-enrollment-btn');
    if (confirmEnrollmentBtn) {
      confirmEnrollmentBtn.addEventListener('click', (e) => {
        const courseId = e.target.getAttribute('data-course-id');
        if (courseId) {
          enrollInCourse(courseId);
        }
      });
    }
    
    const cancelEnrollmentBtn = document.getElementById('cancel-enrollment');
    if (cancelEnrollmentBtn) {
      cancelEnrollmentBtn.addEventListener('click', () => {
        enrollmentConfirmationModal.style.display = 'none';
      });
    }
  }
  
  // Perform course search with fuzzy matching
  function performCourseSearch(searchTerm, isLoggedIn) {
    if (!searchTerm.trim()) {
      // If search term is empty, reload all courses
      if (isLoggedIn) {
        loadCourses();
      } else {
        loadPublicCourses();
      }
      return;
    }
    
    // Use fuzzy search to find matching courses
    const options = {
      keys: ['title'],
      threshold: 0.4, // Higher threshold = more lenient match
      includeScore: true
    };
    
    // Simple fuzzy search implementation (since we can't include external libraries)
    const fuzzyMatch = (pattern, str) => {
      pattern = pattern.toLowerCase();
      str = str.toLowerCase();
      
      let patternIdx = 0;
      let strIdx = 0;
      let patternLength = pattern.length;
      let strLength = str.length;
      
      while (patternIdx < patternLength && strIdx < strLength) {
        if (pattern[patternIdx] === str[strIdx]) {
          patternIdx++;
        }
        strIdx++;
      }
      
      return patternIdx === patternLength;
    };
    
    // Filter courses based on fuzzy match
    const matchedCourses = allCourses.filter(course => {
      return fuzzyMatch(searchTerm, course.title);
    });
    
    // Display matched courses
    if (isLoggedIn) {
      displaySearchResults(matchedCourses, true);
    } else {
      displaySearchResults(matchedCourses, false);
    }
  }
  
  // Display search results
  function displaySearchResults(courses, isLoggedIn) {
    const container = isLoggedIn ? coursePanelsContainer : publicCoursePanelsContainer;
    
    // Clear container
    container.innerHTML = '';
    
    if (courses.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>No courses found</h3>
          <p>No courses match your search criteria. Try different keywords.</p>
          <button class="btn btn-primary clear-search">
            <i class="fas fa-times"></i> Clear Search
          </button>
        </div>
      `;
      
      // Add event listener to clear search button
      const clearSearchBtn = container.querySelector('.clear-search');
      clearSearchBtn.addEventListener('click', () => {
        if (isLoggedIn) {
          loadCourses();
        } else {
          loadPublicCourses();
        }
      });
      
      return;
    }
    
    // Create search results panel
    const resultsPanel = document.createElement('div');
    resultsPanel.className = 'course-panel';
    resultsPanel.style.opacity = '0';
    resultsPanel.style.transform = 'translateY(20px)';
    
    resultsPanel.innerHTML = `
      <div class="panel-header">
        <h3>Search Results (${courses.length} courses found)</h3>
        <button class="btn btn-secondary clear-search-btn">
          <i class="fas fa-times"></i> Clear
        </button>
      </div>
      <div class="panel-content">
        <div class="course-grid" id="search-results-grid">
          <!-- Courses will be dynamically loaded here -->
        </div>
      </div>
    `;
    
    container.appendChild(resultsPanel);
    
    // Add courses to the results panel
    const courseGrid = resultsPanel.querySelector('.course-grid');
    courses.forEach((course, index) => {
      const courseCard = createCourseCard(course, isLoggedIn);
      courseGrid.appendChild(courseCard);
      
      // Animate card in with staggered delay
      setTimeout(() => {
        courseCard.style.opacity = '1';
        courseCard.style.transform = 'translateY(0)';
        courseCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, index * 100);
    });
    
    // Animate panel in
    setTimeout(() => {
      resultsPanel.style.opacity = '1';
      resultsPanel.style.transform = 'translateY(0)';
      resultsPanel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 100);
    
    // Add event listener to clear search button
    const clearSearchBtn = resultsPanel.querySelector('.clear-search-btn');
    clearSearchBtn.addEventListener('click', () => {
      if (isLoggedIn) {
        loadCourses();
      } else {
        loadPublicCourses();
      }
    });
    
    // Add event listeners to enroll buttons
    if (isLoggedIn && currentUser && currentUser.role === 'student') {
      document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const courseId = e.target.getAttribute('data-course-id');
          showEnrollmentConfirmation(courseId);
        });
      });
    }
    
    // Add event listeners to login buttons for non-logged in users
    if (!isLoggedIn) {
      document.querySelectorAll('.login-to-enroll-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const courseId = e.target.getAttribute('data-course-id');
          // Store the course ID in session storage to redirect after login
          sessionStorage.setItem('enrollAfterLogin', courseId);
          showSection('login');
        });
      });
    }
  }
  
  // Show section with animation
  function showSection(sectionName) {
    // First, hide all sections
    Object.values(sections).forEach(section => {
      if (section) {
        section.style.display = 'none';
      }
    });
    
    // Then show the requested section
    if (sections[sectionName]) {
      sections[sectionName].style.display = 'block';
      
      // Reset animation properties first
      sections[sectionName].style.opacity = '0';
      sections[sectionName].style.transform = 'translateY(20px)';
      
      // Force a reflow to apply the display change
      sections[sectionName].offsetHeight;
      
      // Now apply the animation
      setTimeout(() => {
        sections[sectionName].style.opacity = '1';
        sections[sectionName].style.transform = 'translateY(0)';
      }, 10);
    } else {
      console.error(`Section ${sectionName} not found`);
      // Fallback: show the first available section
      const firstSection = Object.values(sections).find(section => section);
      if (firstSection) {
        firstSection.style.display = 'block';
        firstSection.style.opacity = '1';
        firstSection.style.transform = 'translateY(0)';
      }
    }
  }
  
  // Handle contact form submission with Formspree
  function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const responseDiv = document.getElementById('contact-message-response');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Formspree will handle the form submission
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 422) {
        // Handle 422 error (usually unverified email)
        throw new Error('Please check your email for a verification message from Formspree and click the verification link.');
      } else if (response.status === 403) {
        // Handle 403 error (usually CSRF protection)
        throw new Error('Form submission blocked. Please try again or contact support.');
      } else {
        throw new Error('Form submission failed');
      }
    })
    .then(data => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success message
      responseDiv.textContent = 'Thank you for your message! We will get back to you soon.';
      responseDiv.className = 'message success';
      responseDiv.style.display = 'block';
      
      // Reset form
      form.reset();
      
      // Show success notification
      createNotification('Message sent successfully!', 'success');
      
      // Hide message after 5 seconds
      setTimeout(() => {
        responseDiv.style.display = 'none';
      }, 5000);
    })
    .catch(error => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error message
      let errorMessage = error.message;
      
      if (error.message.includes('verification')) {
        errorMessage = 'Please check your email for a verification message from Formspree and click the verification link. After verification, please submit the form again.';
      } else if (error.message.includes('blocked')) {
        errorMessage = 'Form submission was blocked by security protection. Please try again later.';
      } else {
        errorMessage = 'Oops! There was a problem sending your message. Please try again later.';
      }
      
      responseDiv.textContent = errorMessage;
      responseDiv.className = 'message error';
      responseDiv.style.display = 'block';
      
      // Show error notification
      createNotification('Failed to send message. Please try again.', 'error');
      
      console.error('Form submission error:', error);
    });
  }
  
  // Show tab with animation
  function showTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    tabContents.forEach(content => {
      if (content.id === `${tabId}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  
  // Update UI based on user role
  function updateUI() {
    if (currentUser) {
      if (navLinks.login) navLinks.login.style.display = 'none';
      if (navLinks.signup) navLinks.signup.style.display = 'none';
      if (navLinks.logout) navLinks.logout.style.display = 'block';
      
      // Show courses and dashboard links for logged in users
      if (navLinks.courses) navLinks.courses.style.display = 'block';
      
      if (currentUser.role === 'admin') {
        if (navLinks.admin) navLinks.admin.style.display = 'block';
        if (navLinks.adminSettings) navLinks.adminSettings.style.display = 'block';
        if (navLinks.dashboard) navLinks.dashboard.style.display = 'none';
        if (navLinks.studentSettings) navLinks.studentSettings) navLinks.studentSettings.style.display = 'none';
      } else {
        if (navLinks.admin) navLinks.admin.style.display = 'none';
        if (navLinks.adminSettings) navLinks.adminSettings.style.display = 'none';
        if (navLinks.dashboard) navLinks.dashboard.style.display = 'block';
        if (navLinks.studentSettings) navLinks.studentSettings) navLinks.studentSettings.style.display = 'block';
      }
    } else {
      if (navLinks.login) navLinks.login.style.display = 'block';
      if (navLinks.signup) navLinks.signup.style.display = 'block';
      if (navLinks.logout) navLinks.logout.style.display = 'none';
      if (navLinks.admin) navLinks.admin.style.display = 'none';
      if (navLinks.adminSettings) navLinks.adminSettings.style.display = 'none';
      if (navLinks.dashboard) navLinks.dashboard.style.display = 'none';
      if (navLinks.studentSettings) navLinks.studentSettings) navLinks.studentSettings.style.display = 'none';
      
      // Show courses link for non-logged in users to see public courses
      if (navLinks.courses) navLinks.courses.style.display = 'block';
    }
  }
  
  // Handle login
  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      updateUI();
      showSection('home');
      authMessages.login.textContent = '';
      authForms.login.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification(`Welcome back, ${currentUser.name}!`, 'success');
      
      // Check if there's a course to enroll in after login
      const enrollAfterLogin = sessionStorage.getItem('enrollAfterLogin');
      if (enrollAfterLogin) {
        sessionStorage.removeItem('enrollAfterLogin');
        // Show enrollment confirmation for the stored course ID
        setTimeout(() => {
          showEnrollmentConfirmation(enrollAfterLogin);
        }, 1000);
      } else {
        // Load courses after successful login
        if (currentUser && currentUser.role === 'student') {
          setTimeout(() => {
            showSection('courses');
            loadCourses();
          }, 1000);
        } else if (currentUser && currentUser.role === 'admin') {
          setTimeout(() => {
            showSection('admin');
            loadAdminDashboard();
          }, 1000);
        }
      }
    })
    .catch(error => {
      authMessages.login.textContent = 'Invalid email or password';
      authMessages.login.className = 'message error';
      authMessages.login.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification('Invalid email or password', 'error');
    });
  }
  
  // Handle signup
  function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      return response.json();
    })
    .then(data => {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      updateUI();
      showSection('home');
      authMessages.signup.textContent = '';
      authForms.signup.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification(`Account created successfully! Welcome, ${currentUser.name}!`, 'success');
    })
    .catch(error => {
      authMessages.signup.textContent = error.message || 'Signup failed';
      authMessages.signup.className = 'message error';
      authMessages.signup.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(error.message || 'Signup failed', 'error');
    });
  }
  
  // Handle forgot password
  function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgot-password-email').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send reset code');
      }
      return response.json();
    })
    .then(data => {
      authMessages.forgotPassword.textContent = data.message;
      authMessages.forgotPassword.className = 'message success';
      authMessages.forgotPassword.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification('Reset code sent to your email', 'success');
      
      // Store email for reset password form
      document.getElementById('reset-password-email').value = email;
      
      // Show reset password section after a delay
      setTimeout(() => {
        showSection('resetPassword');
        authMessages.forgotPassword.textContent = '';
      }, 2000);
    })
    .catch(error => {
      authMessages.forgotPassword.textContent = error.message || 'Failed to send reset code';
      authMessages.forgotPassword.className = 'message error';
      authMessages.forgotPassword.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(error.message || 'Failed to send reset code', 'error');
    });
  }
  
  // Handle reset password
  function handleResetPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-password-email').value;
    const code = document.getElementById('reset-password-code').value;
    const newPassword = document.getElementById('reset-password-new-password').value;
    const confirmPassword = document.getElementById('reset-password-confirm-password').value;
    
    if (newPassword !== confirmPassword) {
      authMessages.resetPassword.textContent = 'Passwords do not match';
      authMessages.resetPassword.className = 'message error';
      authMessages.resetPassword.style.display = 'block';
      
      // Show error notification
      createNotification('Passwords do not match', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code, newPassword })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      return response.json();
    })
    .then(data => {
      authMessages.resetPassword.textContent = data.message;
      authMessages.resetPassword.className = 'message success';
      authMessages.resetPassword.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification('Password reset successfully', 'success');
      
      // Show login section after a delay
      setTimeout(() => {
        showSection('login');
        authMessages.resetPassword.textContent = '';
        authForms.resetPassword.reset();
      }, 2000);
    })
    .catch(error => {
      authMessages.resetPassword.textContent = error.message || 'Failed to reset password';
      authMessages.resetPassword.className = 'message error';
      authMessages.resetPassword.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(error.message || 'Failed to reset password', 'error');
    });
  }
  
  // Handle admin settings
  function handleAdminSettings(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-settings-username').value;
    const email = document.getElementById('admin-settings-email').value;
    const currentPassword = document.getElementById('admin-settings-current-password').value;
    const newPassword = document.getElementById('admin-settings-new-password').value;
    const confirmPassword = document.getElementById('admin-settings-confirm-password').value;
    
    if (newPassword && newPassword !== confirmPassword) {
      authMessages.adminSettings.textContent = 'New passwords do not match';
      authMessages.adminSettings.className = 'message error';
      authMessages.adminSettings.style.display = 'block';
      
      // Show error notification
      createNotification('New passwords do not match', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, email, currentPassword, newPassword })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      return response.json();
    })
    .then(data => {
      // Update current user data
      currentUser = data.user;
      
      authMessages.adminSettings.textContent = 'Settings updated successfully';
      authMessages.adminSettings.className = 'message success';
      authMessages.adminSettings.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification('Settings updated successfully', 'success');
      
      // Reset form after a delay
      setTimeout(() => {
        authMessages.adminSettings.textContent = '';
        authForms.adminSettings.reset();
        
        // Populate form with updated data
        document.getElementById('admin-settings-username').value = currentUser.name;
        document.getElementById('admin-settings-email').value = currentUser.email;
      }, 2000);
    })
    .catch(error => {
      authMessages.adminSettings.textContent = error.message || 'Failed to update settings';
      authMessages.adminSettings.className = 'message error';
      authMessages.adminSettings.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(error.message || 'Failed to update settings', 'error');
    });
  }
  
  // Handle student settings
  function handleStudentSettings(e) {
    e.preventDefault();
    
    const username = document.getElementById('student-settings-username').value;
    const email = document.getElementById('student-settings-email').value;
    const currentPassword = document.getElementById('student-settings-current-password').value;
    const newPassword = document.getElementById('student-settings-new-password').value;
    const confirmPassword = document.getElementById('student-settings-confirm-password').value;
    
    if (newPassword && newPassword !== confirmPassword) {
      authMessages.studentSettings.textContent = 'New passwords do not match';
      authMessages.studentSettings.className = 'message error';
      authMessages.studentSettings.style.display = 'block';
      
      // Show error notification
      createNotification('New passwords do not match', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;
    
    fetch(`${API_BASE_URL}/api/student/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, currentPassword, newPassword })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      return response.json();
    })
    .then(data => {
      // Update current user data
      currentUser = data.user;
      
      authMessages.studentSettings.textContent = 'Settings updated successfully';
      authMessages.studentSettings.className = 'message success';
      authMessages.studentSettings.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification('Settings updated successfully', 'success');
      
      // Reset form after a delay
      setTimeout(() => {
        authMessages.studentSettings.textContent = '';
        authForms.studentSettings.reset();
        
        // Populate form with updated data
        document.getElementById('student-settings-username').value = currentUser.name;
        document.getElementById('student-settings-email').value = currentUser.email;
      }, 2000);
    })
    .catch(error => {
      authMessages.studentSettings.textContent = error.message || 'Failed to update settings';
      authMessages.studentSettings.className = 'message error';
      authMessages.studentSettings.style.display = 'block';
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(error.message || 'Failed to update settings', 'error');
    });
  }
  
  // Load student settings
  function loadStudentSettings() {
    // Populate form with current user data
    if (document.getElementById('student-settings-username')) {
      document.getElementById('student-settings-username').value = currentUser.name;
    }
    if (document.getElementById('student-settings-email')) {
      document.getElementById('student-settings-email').value = currentUser.email;
    }
  }
  
  // Show enrollment confirmation modal
  function showEnrollmentConfirmation(courseId) {
    const modal = document.getElementById('enrollment-confirmation-modal');
    const confirmBtn = document.getElementById('confirm-enrollment-btn');
    
    // Set course ID in the confirm button
    if (confirmBtn) {
      confirmBtn.setAttribute('data-course-id', courseId);
    }
    
    // Show modal with animation
    if (modal) {
      modal.style.display = 'block';
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      
      // Trigger reflow
      modal.offsetHeight;
      
      // Animate in
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
      modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  }
  
  // Enroll in course
  function enrollInCourse(courseId) {
    // Validate courseId
    if (!courseId) {
      createNotification('Invalid course selected. Please try again.', 'error');
      return;
    }
    
    // Show loading notification
    createNotification('Processing enrollment...', 'info');
    
    fetch(`${API_BASE_URL}/api/student/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ courseId })
    })
    .then(response => {
      console.log('Enrollment response status:', response.status);
      
      if (!response.ok) {
        return response.json().then(err => {
          console.error('Enrollment error response:', err);
          throw new Error(err.message || 'Enrollment failed');
        });
      }
      return response.json();
    })
    .then(data => {
      // Close modal with animation
      if (enrollmentConfirmationModal) {
        enrollmentConfirmationModal.style.opacity = '0';
        enrollmentConfirmationModal.style.transform = 'scale(0.9)';
        enrollmentConfirmationModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          enrollmentConfirmationModal.style.display = 'none';
        }, 300);
      }
      
      // Create beautiful payment info modal
      const paymentModal = document.createElement('div');
      paymentModal.className = 'payment-modal modal';
      paymentModal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <div class="payment-info">
            <h3><i class="fas fa-check-circle"></i> Enrollment Request Submitted</h3>
            <div class="payment-details">
              <div class="payment-item">
                <i class="fas fa-phone"></i>
                <div>
                  <strong>Contact Number:</strong>
                  <p>${data.paymentInfo.contactNumber}</p>
                </div>
              </div>
              <div class="payment-item">
                <i class="fas fa-credit-card"></i>
                <div>
                  <strong>Payment Number:</strong>
                  <p>${data.paymentInfo.paymentNumber}</p>
                </div>
              </div>
              <div class="warning-box">
                <p><i class="fas fa-exclamation-triangle"></i> <strong>Warning:</strong> Please do not confuse the Contact Number with the Payment Number.</p>
                <ul>
                  <li>Use the Contact Number only for communication</li>
                  <li>Use the Payment Number only for sending your course fee</li>
                </ul>
              </div>
              <div class="instructions">
                <h4><i class="fas fa-list-ol"></i> Instructions:</h4>
                <ol>
                  <li>Send your payment to the Payment Number</li>
                  <li>After sending the payment, send your username via WhatsApp to the Contact Number</li>
                  <li>The admin will verify your payment and approve your enrollment</li>
                </ol>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-primary" id="close-payment-modal">Got it!</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(paymentModal);
      
      // Show modal with animation
      paymentModal.style.display = 'block';
      paymentModal.style.opacity = '0';
      paymentModal.style.transform = 'scale(0.9)';
      
      // Trigger reflow
      paymentModal.offsetHeight;
      
      // Animate in
      paymentModal.style.opacity = '1';
      paymentModal.style.transform = 'scale(1)';
      paymentModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      // Add close functionality
      paymentModal.querySelector('.close').addEventListener('click', () => {
        paymentModal.style.opacity = '0';
        paymentModal.style.transform = 'scale(0.9)';
        paymentModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          paymentModal.remove();
        }, 300);
      });
      
      paymentModal.querySelector('#close-payment-modal').addEventListener('click', () => {
        paymentModal.style.opacity = '0';
        paymentModal.style.transform = 'scale(0.9)';
        paymentModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          paymentModal.remove();
        }, 300);
      });
      
      // Show success notification
      createNotification('Enrollment request submitted successfully!', 'success');
      
      // Reload courses
      loadCourses();
    })
    .catch(error => {
      // Show more specific error message
      let errorMessage = 'Enrollment failed. Please try again.';
      
      if (error.message.includes('Already enrolled')) {
        errorMessage = 'You are already enrolled in this course.';
      } else if (error.message.includes('Course not found')) {
        errorMessage = 'The selected course does not exist.';
      } else if (error.message.includes('Course ID is required')) {
        errorMessage = 'Invalid course selection.';
      } else if (error.message.includes('token')) {
        errorMessage = 'Your session has expired. Please login again.';
        // Redirect to login page
        setTimeout(() => {
          logout();
          showSection('login');
        }, 2000);
      }
      
      createNotification(errorMessage, 'error');
      console.error('Enrollment error:', error);
    });
  }
  
  // Load student dashboard
  function loadStudentDashboard() {
    if (studentName) {
      studentName.textContent = currentUser.name;
    }
    
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(enrollmentContainer);
    
    fetch(`${API_BASE_URL}/api/student/dashboard`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(enrollments => {
      // Remove spinner
      spinner.remove();
      
      if (enrollmentContainer) {
        enrollmentContainer.innerHTML = '';
        
        // Check if enrollments is an array
        if (!Array.isArray(enrollments)) {
          console.error('Expected enrollments to be an array, got:', enrollments);
          enrollmentContainer.innerHTML = `
            <div class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Invalid data format received from server</p>
            </div>
          `;
          return;
        }
        
        if (enrollments.length === 0) {
          const emptyState = document.createElement('div');
          emptyState.className = 'empty-state';
          emptyState.innerHTML = `
            <div class="empty-state-icon">
              <i class="fas fa-book-open"></i>
            </div>
            <h3>No Enrollments Yet</h3>
            <p>You are not enrolled in any courses yet. Browse our courses and enroll to get started!</p>
            <button class="btn btn-primary browse-courses">
              <i class="fas fa-search"></i> Browse Courses
            </button>
          `;
          
          enrollmentContainer.appendChild(emptyState);
          
          // Add event listener to browse courses button
          emptyState.querySelector('.browse-courses').addEventListener('click', () => {
            showSection('courses');
            loadCourses();
          });
          
          return;
        }
        
        // Create beautiful enrollment cards
        enrollments.forEach((enrollment, index) => {
          // Add safety check for enrollment structure
          if (!enrollment || !enrollment.courseId) {
            console.error('Invalid enrollment structure:', enrollment);
            return;
          }
          
          const enrollmentCard = document.createElement('div');
          enrollmentCard.className = 'enrollment-card beautiful-card';
          enrollmentCard.style.opacity = '0';
          enrollmentCard.style.transform = 'translateY(20px)';
          
          // Create beautiful progress bar
          const progressContainer = document.createElement('div');
          createProgressBar(enrollment.progress || 0, progressContainer);
          
          // Use courseId instead of course to match the data structure
          const courseTitle = enrollment.courseId.title || 'Unknown Course';
          const courseInstructor = enrollment.courseId.instructor || 'Unknown Instructor';
          const enrollmentStatus = enrollment.status || 'unknown';
          const enrollmentId = enrollment._id || '';
          const courseId = enrollment.courseId._id || '';
          
          enrollmentCard.innerHTML = `
            <div class="card-header">
              <h3>${courseTitle}</h3>
              <span class="status status-${enrollmentStatus}">${enrollmentStatus}</span>
            </div>
            <div class="card-body">
              <p><i class="fas fa-user"></i> Instructor: ${courseInstructor}</p>
              <div class="progress-container">
                ${progressContainer.outerHTML}
              </div>
            </div>
            <div class="card-footer">
              ${enrollmentStatus === 'active' ? 
                `<button class="view-course-btn btn btn-primary" data-course-id="${courseId}">
                  <i class="fas fa-play-circle"></i> View Course
                </button>
                 <button class="update-progress-btn btn btn-secondary" data-enrollment-id="${enrollmentId}">
                  <i class="fas fa-tasks"></i> Update Progress
                </button>` : ''}
              ${enrollment.certificateIssued ? 
                `<a href="#" class="download-cert-btn btn btn-success" data-enrollment-id="${enrollmentId}">
                  <i class="fas fa-certificate"></i> Download Certificate
                </a>` : ''}
            </div>
          `;
          
          enrollmentContainer.appendChild(enrollmentCard);
          
          // Animate card in with staggered delay
          setTimeout(() => {
            enrollmentCard.style.opacity = '1';
            enrollmentCard.style.transform = 'translateY(0)';
            enrollmentCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 100);
        });
        
        // Add event listeners to view course buttons
        document.querySelectorAll('.view-course-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            console.log('View course button clicked, courseId:', courseId);
            viewCourseContent(courseId);
          });
        });
        
        // Add event listeners to update progress buttons
        document.querySelectorAll('.update-progress-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const enrollmentId = e.target.getAttribute('data-enrollment-id');
            updateProgress(enrollmentId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading dashboard:', error);
      
      // Remove spinner and show error
      spinner.remove();
      enrollmentContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load dashboard: ${error.message}</p>
        </div>
      `;
      
      // Show error notification
      createNotification('Failed to load dashboard', 'error');
    });
  }
  
  // View course content
  function viewCourseContent(courseId) {
    console.log('viewCourseContent called with courseId:', courseId);
    
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(courseModulesContainer);
    
    fetch(`${API_BASE_URL}/api/student/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to load course content');
      }
      return response.json();
    })
    .then(course => {
      console.log('Course data received:', course);
      
      // Remove spinner
      spinner.remove();
      
      if (courseTitle) courseTitle.textContent = course.title;
      if (courseInstructor) courseInstructor.textContent = `Instructor: ${course.instructor}`;
      
      if (courseModulesContainer) {
        courseModulesContainer.innerHTML = '';
        
        // Create beautiful module cards
        renderCourseModules(course, courseModulesContainer);
      }
      
      showSection('courseContent');
    })
    .catch(error => {
      console.error('Error loading course content:', error);
      
      // Remove spinner and show error
      spinner.remove();
      courseModulesContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load course content: ${error.message}</p>
        </div>
      `;
      
      // Show error notification
      createNotification('Failed to load course content', 'error');
    });
  }
  
  // Update progress
  function updateProgress(enrollmentId) {
    // Create beautiful progress input modal
    const progressModal = document.createElement('div');
    progressModal.className = 'progress-modal modal';
    progressModal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3><i class="fas fa-tasks"></i> Update Progress</h3>
        <div class="progress-input-container">
          <label for="progress-input">Enter progress percentage (0-100):</label>
          <div class="input-group">
            <input type="range" id="progress-input" min="0" max="100" value="0" class="progress-slider">
            <div class="progress-value">0%</div>
          </div>
          <div class="progress-buttons">
            <button class="btn btn-secondary" id="cancel-progress">Cancel</button>
            <button class="btn btn-primary" id="save-progress">Save</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(progressModal);
    
    // Show modal with animation
    progressModal.style.display = 'block';
    progressModal.style.opacity = '0';
    progressModal.style.transform = 'scale(0.9)';
    
    // Trigger reflow
    progressModal.offsetHeight;
    
    // Animate in
    progressModal.style.opacity = '1';
    progressModal.style.transform = 'scale(1)';
    progressModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Get elements
    const progressInput = progressModal.querySelector('#progress-input');
    const progressValue = progressModal.querySelector('.progress-value');
    const saveBtn = progressModal.querySelector('#save-progress');
    const cancelBtn = progressModal.querySelector('#cancel-progress');
    const closeBtn = progressModal.querySelector('.close');
    
    // Update progress value when slider changes
    progressInput.addEventListener('input', () => {
      progressValue.textContent = `${progressInput.value}%`;
    });
    
    // Close modal functions
    const closeModal = () => {
      progressModal.style.opacity = '0';
      progressModal.style.transform = 'scale(0.9)';
      progressModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        progressModal.remove();
      }, 300);
    };
    
    // Add event listeners
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    saveBtn.addEventListener('click', () => {
      const progressValue = parseInt(progressInput.value);
      
      if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        createNotification('Please enter a valid number between 0 and 100', 'error');
        return;
      }
      
      // Close modal
      closeModal();
      
      // Update progress
      fetch(`${API_BASE_URL}/api/student/progress/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ progress: progressValue })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Progress update failed');
        }
        return response.json();
      })
      .then(data => {
        createNotification('Progress updated successfully!', 'success');
        loadStudentDashboard();
      })
      .catch(error => {
        createNotification('Failed to update progress. Please try again.', 'error');
        console.error('Progress update error:', error);
      });
    });
  }
  
  // Load admin dashboard
  function loadAdminDashboard() {
    loadAdminCourses();
    loadAdminCategories();
    loadAdminEnrollments();
    loadAdminUsers();
  }
  
  // Load admin settings
  function loadAdminSettings() {
    // Populate form with current user data
    if (document.getElementById('admin-settings-username')) {
      document.getElementById('admin-settings-username').value = currentUser.name;
    }
    if (document.getElementById('admin-settings-email')) {
      document.getElementById('admin-settings-email').value = currentUser.email;
    }
  }
  
  // Load admin categories
  function loadAdminCategories() {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(adminCategoryContainer);
    
    fetch(`${API_BASE_URL}/api/admin/categories`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(categories => {
      // Remove spinner
      spinner.remove();
      
      if (adminCategoryContainer) {
        adminCategoryContainer.innerHTML = '';
        
        // Create beautiful category cards
        categories.forEach((category, index) => {
          const categoryCard = document.createElement('div');
          categoryCard.className = 'category-card beautiful-card';
          categoryCard.style.opacity = '0';
          categoryCard.style.transform = 'translateY(20px)';
          
          categoryCard.innerHTML = `
            <div class="card-header">
              <h3>${category.name}</h3>
            </div>
            <div class="card-body">
              <p>${category.description}</p>
            </div>
            <div class="card-footer">
              <button class="edit-category-btn btn btn-primary" data-category-id="${category._id}">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="delete-category-btn btn btn-danger" data-category-id="${category._id}">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          `;
          
          adminCategoryContainer.appendChild(categoryCard);
          
          // Animate card in with staggered delay
          setTimeout(() => {
            categoryCard.style.opacity = '1';
            categoryCard.style.transform = 'translateY(0)';
            categoryCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 100);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-category-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const categoryId = e.target.getAttribute('data-category-id');
            editCategory(categoryId);
          });
        });
        
        document.querySelectorAll('.delete-category-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const categoryId = e.target.getAttribute('data-category-id');
            deleteCategory(categoryId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading admin categories:', error);
      
      // Remove spinner and show error
      spinner.remove();
      adminCategoryContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load admin categories: ${error.message}</p>
        </div>
      `;
      
      // Show error notification
      createNotification('Failed to load admin categories', 'error');
    });
  }
  
  // Load admin courses
  function loadAdminCourses() {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(adminCourseContainer);
    
    fetch(`${API_BASE_URL}/api/admin/courses`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(courses => {
      // Remove spinner
      spinner.remove();
      
      if (adminCourseContainer) {
        adminCourseContainer.innerHTML = '';
        
        // Create beautiful course cards
        courses.forEach((course, index) => {
          console.log('Processing admin course:', course);
          console.log('Course imageUrl:', course.imageUrl);
          
          const courseCard = document.createElement('div');
          courseCard.className = 'course-card beautiful-card';
          courseCard.style.opacity = '0';
          courseCard.style.transform = 'translateY(20px)';
          
          // Validate and fix image URL
          const imageUrl = validateImageUrl(course.imageUrl);
          console.log('Using imageUrl:', imageUrl);
          
          courseCard.innerHTML = `
            <div class="card-image">
              ${imageUrl ? 
                `<img src="${imageUrl}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div class="image-error" style="display: none;">
                   <i class="fas fa-exclamation-triangle"></i>
                   <p>Image not available</p>
                 </div>` : 
                `<div class="image-error">
                   <i class="fas fa-exclamation-triangle"></i>
                   <p>No image provided</p>
                 </div>`
              }
            </div>
            <div class="card-content">
              <h3>${course.title}</h3>
              <p>${course.description}</p>
              <div class="course-meta">
                <div class="course-instructor">
                  <i class="fas fa-user"></i> ${course.instructor}
                </div>
                <div class="course-price">
                  <i class="fas fa-dollar-sign"></i> ${course.price}
                </div>
              </div>
              <div class="course-actions">
                <button class="edit-course-btn btn btn-primary" data-course-id="${course._id}">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-course-btn btn btn-danger" data-course-id="${course._id}">
                  <i class="fas fa-trash"></i> Delete
                </button>
                <button class="view-course-admin-btn btn btn-secondary" data-course-id="${course._id}">
                  <i class="fas fa-eye"></i> View Course
                </button>
              </div>
            </div>
          `;
          
          adminCourseContainer.appendChild(courseCard);
          
          // Animate card in with staggered delay
          setTimeout(() => {
            courseCard.style.opacity = '1';
            courseCard.style.transform = 'translateY(0)';
            courseCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 100);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-course-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            editCourse(courseId);
          });
        });
        
        document.querySelectorAll('.delete-course-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            deleteCourse(courseId);
          });
        });
        
        // Add event listeners to view course buttons
        document.querySelectorAll('.view-course-admin-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-course-id');
            viewCourseAsAdmin(courseId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading admin courses:', error);
      
      // Remove spinner and show error
      spinner.remove();
      adminCourseContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load admin courses: ${error.message}</p>
        </div>
      `;
      
      // Show error notification
      createNotification('Failed to load admin courses', 'error');
    });
  }
  
  // View course as admin
  function viewCourseAsAdmin(courseId) {
    fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(course => {
      // Populate modal with course details
      if (document.getElementById('view-course-title')) {
        document.getElementById('view-course-title').textContent = course.title;
      }
      if (document.getElementById('view-course-instructor')) {
        document.getElementById('view-course-instructor').textContent = course.instructor;
      }
      if (document.getElementById('view-course-price')) {
        document.getElementById('view-course-price').textContent = course.price;
      }
      if (document.getElementById('view-course-description')) {
        document.getElementById('view-course-description').textContent = course.description;
      }
      if (document.getElementById('view-course-category')) {
        const category = allCategories.find(cat => cat._id === course.category);
        document.getElementById('view-course-category').textContent = category ? category.name : 'Uncategorized';
      }
      
      // Load modules
      const modulesContainer = document.getElementById('view-course-modules-container');
      if (modulesContainer) {
        modulesContainer.innerHTML = '';
        
        renderCourseModules(course, modulesContainer);
      }
      
      // Show modal with animation
      if (viewCourseModal) {
        viewCourseModal.style.display = 'block';
        viewCourseModal.style.opacity = '0';
        viewCourseModal.style.transform = 'scale(0.9)';
        
        // Trigger reflow
        viewCourseModal.offsetHeight;
        
        // Animate in
        viewCourseModal.style.opacity = '1';
        viewCourseModal.style.transform = 'scale(1)';
        viewCourseModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
    })
    .catch(error => {
      console.error('Error loading course for admin view:', error);
      createNotification('Error loading course details', 'error');
    });
  }
  
  // Load admin enrollments
  function loadAdminEnrollments() {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(enrollmentTableBody);
    
    fetch(`${API_BASE_URL}/api/admin/enrollments`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(enrollments => {
      // Remove spinner
      spinner.remove();
      
      if (enrollmentTableBody) {
        enrollmentTableBody.innerHTML = '';
        
        // Check if enrollments is an array
        if (!Array.isArray(enrollments)) {
          console.error('Expected enrollments to be an array, got:', enrollments);
          enrollmentTableBody.innerHTML = `
            <tr>
              <td colspan="5" class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Invalid data format received from server</p>
              </td>
            </tr>
          `;
          return;
        }
        
        // Create beautiful table rows
        enrollments.forEach((enrollment, index) => {
          // Log enrollment to check if _id exists
          console.log('Enrollment object:', enrollment);
          
          // Skip if enrollment doesn't have the required properties
          if (!enrollment || !enrollment.userId || !enrollment.courseId) {
            console.error('Invalid enrollment structure:', enrollment);
            return; // Skip this enrollment
          }
          
          const row = document.createElement('tr');
          row.style.opacity = '0';
          row.style.transform = 'translateY(20px)';
          
          // Use default values for missing properties
          const userName = enrollment.userId.name || 'Unknown User';
          const userEmail = enrollment.userId.email || 'No email';
          const courseTitle = enrollment.courseId.title || 'Unknown Course';
          const courseInstructor = enrollment.courseId.instructor || 'Unknown Instructor';
          const enrollmentDate = enrollment.date ? new Date(enrollment.date).toLocaleDateString() : 'Unknown date';
          const enrollmentStatus = enrollment.status || 'unknown';
          const enrollmentId = enrollment._id || '';
          
          row.innerHTML = `
            <td>
              <div class="user-info">
                <div class="user-name">${userName}</div>
                <div class="user-email">${userEmail}</div>
              </div>
            </td>
            <td>
              <div class="course-info">
                <div class="course-title">${courseTitle}</div>
                <div class="course-instructor">${courseInstructor}</div>
              </div>
            </td>
            <td>
              <div class="date-info">
                <i class="fas fa-calendar"></i> ${enrollmentDate}
              </div>
            </td>
            <td>
              <span class="status status-${enrollmentStatus}">${enrollmentStatus}</span>
            </td>
            <td>
              <div class="table-actions">
                ${enrollmentStatus === 'pending' ? 
                  `<button class="approve-btn btn btn-success btn-sm" data-enrollment-id="${enrollmentId}">
                    <i class="fas fa-check"></i>
                  </button>
                   <button class="reject-btn btn btn-danger btn-sm" data-enrollment-id="${enrollmentId}">
                    <i class="fas fa-times"></i>
                  </button>` : 
                  enrollmentStatus === 'active' ? 
                  `<button class="complete-btn btn btn-primary btn-sm" data-enrollment-id="${enrollmentId}">
                    <i class="fas fa-check-double"></i>
                  </button>` : ''}
              </div>
            </td>
          `;
          
          enrollmentTableBody.appendChild(row);
          
          // Animate row in with staggered delay
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 50);
        });
        
        // Add event listeners to action buttons - FIXED VERSION
        document.querySelectorAll('.approve-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            // Use currentTarget to get the button element, not the icon inside
            const enrollmentId = e.currentTarget.getAttribute('data-enrollment-id');
            console.log('Approve enrollment ID:', enrollmentId); // Debug log
            updateEnrollmentStatus(enrollmentId, 'active');
          });
        });
        
        document.querySelectorAll('.reject-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            // Use currentTarget to get the button element, not the icon inside
            const enrollmentId = e.currentTarget.getAttribute('data-enrollment-id');
            console.log('Reject enrollment ID:', enrollmentId); // Debug log
            updateEnrollmentStatus(enrollmentId, 'rejected');
          });
        });
        
        document.querySelectorAll('.complete-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            // Use currentTarget to get the button element, not the icon inside
            const enrollmentId = e.currentTarget.getAttribute('data-enrollment-id');
            console.log('Complete enrollment ID:', enrollmentId); // Debug log
            updateEnrollmentStatus(enrollmentId, 'completed');
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading admin enrollments:', error);
      
      // Remove spinner and show error
      spinner.remove();
      enrollmentTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load admin enrollments: ${error.message}</p>
          </td>
        </tr>
      `;
      
      // Show error notification
      createNotification('Failed to load admin enrollments', 'error');
    });
  }
  
  // Load admin users
  function loadAdminUsers() {
    // Create beautiful loading spinner
    const spinner = createLoadingSpinner(userTableBody);
    
    fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(users => {
      // Remove spinner
      spinner.remove();
      
      if (userTableBody) {
        userTableBody.innerHTML = '';
        
        // Create beautiful table rows
        users.forEach((user, index) => {
          const row = document.createElement('tr');
          row.style.opacity = '0';
          row.style.transform = 'translateY(20px)';
          
          row.innerHTML = `
            <td>
              <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
              </div>
            </td>
            <td>
              <div class="user-stats">
                <div class="user-role">${user.role}</div>
              </div>
            </td>
            <td>
              <button class="view-enrollments-btn btn btn-primary btn-sm" data-user-id="${user._id}">
                <i class="fas fa-list"></i> View Enrollments
              </button>
            </td>
            <td>
              <div class="table-actions">
                <button class="view-user-btn btn btn-secondary btn-sm" data-user-id="${user._id}">
                  <i class="fas fa-user"></i> View Details
                </button>
                ${user.role === 'student' ? 
                  `<button class="delete-user-btn btn btn-danger btn-sm" data-user-id="${user._id}">
                    <i class="fas fa-trash"></i> Delete
                  </button>` : ''}
              </div>
            </td>
          `;
          
          userTableBody.appendChild(row);
          
          // Animate row in with staggered delay
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 50);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-enrollments-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-user-id');
            viewUserEnrollments(userId);
          });
        });
        
        document.querySelectorAll('.view-user-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-user-id');
            viewUserDetails(userId);
          });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-user-id');
            deleteUser(userId);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading admin users:', error);
      
      // Remove spinner and show error
      spinner.remove();
      userTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load admin users: ${error.message}</p>
          </td>
        </tr>
      `;
      
      // Show error notification
      createNotification('Failed to load admin users', 'error');
    });
  }
  
  // Delete user
  function deleteUser(userId) {
    // Create beautiful confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal modal';
    confirmModal.innerHTML = `
      <div class="modal-content">
        <div class="confirm-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirm Deletion</h3>
        </div>
        <div class="confirm-body">
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div class="confirm-actions">
          <button class="btn btn-secondary" id="cancel-delete">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    // Show modal with animation
    confirmModal.style.display = 'block';
    confirmModal.style.opacity = '0';
    confirmModal.style.transform = 'scale(0.9)';
    
    // Trigger reflow
    confirmModal.offsetHeight;
    
    // Animate in
    confirmModal.style.opacity = '1';
    confirmModal.style.transform = 'scale(1)';
    confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add event listeners
    const cancelBtn = confirmModal.querySelector('#cancel-delete');
    const confirmBtn = confirmModal.querySelector('#confirm-delete');
    
    const closeModal = () => {
      confirmModal.style.opacity = '0';
      confirmModal.style.transform = 'scale(0.9)';
      confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        confirmModal.remove();
      }, 300);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
      closeModal();
      
      fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('User deletion failed');
        }
        return response.json();
      })
      .then(data => {
        createNotification('User deleted successfully!', 'success');
        loadAdminUsers();
      })
      .catch(error => {
        createNotification('Failed to delete user. Please try again.', 'error');
        console.error('User deletion error:', error);
      });
    });
  }
  
  // View user enrollments
  function viewUserEnrollments(userId) {
    fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const enrollmentsContainer = document.getElementById('user-enrollments-container');
      if (enrollmentsContainer) {
        enrollmentsContainer.innerHTML = '';
        
        if (!data.enrollments || data.enrollments.length === 0) {
          enrollmentsContainer.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-book-open"></i>
              <p>No enrollments found for this user.</p>
            </div>
          `;
          return;
        }
        
        // Create beautiful enrollment list
        const enrollmentsList = document.createElement('div');
        enrollmentsList.className = 'enrollments-list';
        
        data.enrollments.forEach((enrollment, index) => {
          const enrollmentItem = document.createElement('div');
          enrollmentItem.className = 'enrollment-item beautiful-card';
          enrollmentItem.style.opacity = '0';
          enrollmentItem.style.transform = 'translateY(20px)';
          
          enrollmentItem.innerHTML = `
            <div class="enrollment-header">
              <h4>${enrollment.courseId ? enrollment.courseId.title : 'Unknown Course'}</h4>
              <span class="status status-${enrollment.status || 'unknown'}">${enrollment.status || 'unknown'}</span>
            </div>
            <div class="enrollment-body">
              <p><i class="fas fa-user"></i> Instructor: ${enrollment.courseId ? enrollment.courseId.instructor : 'Unknown Instructor'}</p>
              <p><i class="fas fa-calendar"></i> Enrolled: ${enrollment.date ? new Date(enrollment.date).toLocaleDateString() : 'Unknown date'}</p>
              <div class="progress-container">
                <div class="progress-label">Progress: ${enrollment.progress || 0}%</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${enrollment.progress || 0}%"></div>
                </div>
              </div>
            </div>
          `;
          
          enrollmentsList.appendChild(enrollmentItem);
          
          // Animate item in with staggered delay
          setTimeout(() => {
            enrollmentItem.style.opacity = '1';
            enrollmentItem.style.transform = 'translateY(0)';
            enrollmentItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          }, index * 100);
        });
        
        enrollmentsContainer.appendChild(enrollmentsList);
      }
      
      // Show modal with animation
      if (userEnrollmentsModal) {
        userEnrollmentsModal.style.display = 'block';
        userEnrollmentsModal.style.opacity = '0';
        userEnrollmentsModal.style.transform = 'scale(0.9)';
        
        // Trigger reflow
        userEnrollmentsModal.offsetHeight;
        
        // Animate in
        userEnrollmentsModal.style.opacity = '1';
        userEnrollmentsModal.style.transform = 'scale(1)';
        userEnrollmentsModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
    })
    .catch(error => {
      console.error('Error loading user enrollments:', error);
      createNotification('Error loading user enrollments', 'error');
    });
  }
  
  // Update enrollment status
  function updateEnrollmentStatus(enrollmentId, status) {
    fetch(`${API_BASE_URL}/api/admin/enrollments/${enrollmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Status update failed');
      }
      return response.json();
    })
    .then(data => {
      createNotification(`Enrollment ${status} successfully!`, 'success');
      loadAdminEnrollments();
    })
    .catch(error => {
      createNotification('Failed to update enrollment status. Please try again.', 'error');
      console.error('Status update error:', error);
    });
  }
  
  // View user details
  function viewUserDetails(userId) {
    fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const userDetails = document.getElementById('user-details');
      if (userDetails) {
        userDetails.innerHTML = `
          <div class="user-profile">
            <div class="profile-header">
              <div class="profile-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="profile-info">
                <h3>${data.user ? data.user.name : 'Unknown User'}</h3>
                <p>${data.user ? data.user.email : 'No email'}</p>
                <span class="user-role">${data.user ? data.user.role : 'Unknown'}</span>
              </div>
            </div>
            <div class="profile-details">
              <div class="detail-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                  <strong>Member Since:</strong>
                  <p>${data.user && data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                </div>
              </div>
            </div>
            <div class="profile-enrollments">
              <h4><i class="fas fa-list"></i> Enrollments</h4>
              ${data.enrollments && data.enrollments.length > 0 ? 
                `<div class="enrollment-list">
                  ${data.enrollments.map(enrollment => `
                    <div class="enrollment-item">
                      <strong>${enrollment.courseId ? enrollment.courseId.title : 'Unknown Course'}</strong> - 
                      Status: <span class="status status-${enrollment.status || 'unknown'}">${enrollment.status || 'unknown'}</span>
                    </div>
                  `).join('')}
                </div>` : 
                '<p>No enrollments found.</p>'}
            </div>
          </div>
        `;
      }
      
      // Show modal with animation
      if (userModal) {
        userModal.style.display = 'block';
        userModal.style.opacity = '0';
        userModal.style.transform = 'scale(0.9)';
        
        // Trigger reflow
        userModal.offsetHeight;
        
        // Animate in
        userModal.style.opacity = '1';
        userModal.style.transform = 'scale(1)';
        userModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
    })
    .catch(error => {
      console.error('Error loading user details:', error);
      createNotification('Error loading user details', 'error');
    });
  }
  
  // Open course modal
  function openCourseModal(course = null) {
    // Load categories for the dropdown
    loadCategoriesForDropdown();
    
    if (course) {
      if (modalTitle) modalTitle.textContent = 'Edit Course';
      if (courseIdInput) courseIdInput.value = course._id;
      if (document.getElementById('course-title')) document.getElementById('course-title').value = course.title;
      if (document.getElementById('course-description')) document.getElementById('course-description').value = course.description;
      if (document.getElementById('course-instructor')) document.getElementById('course-instructor').value = course.instructor;
      if (document.getElementById('course-price')) document.getElementById('course-price').value = course.price;
      if (document.getElementById('course-image-url')) {
        document.getElementById('course-image-url').value = course.imageUrl;
      }
      if (document.getElementById('course-category')) {
        document.getElementById('course-category').value = course.category || '';
      }
      
      // Clear existing modules
      if (modulesContainer) modulesContainer.innerHTML = '';
      
      // Add course modules
      course.modules.forEach(module => {
        addModuleInput(module.title, module.duration, module.lessons);
      });
    } else {
      if (modalTitle) modalTitle.textContent = 'Add New Course';
      if (courseIdInput) courseIdInput.value = '';
      if (courseForm) courseForm.reset();
      if (modulesContainer) modulesContainer.innerHTML = '';
      addModuleInput();
    }
    
    // Show modal with animation
    if (courseModal) {
      courseModal.style.display = 'block';
      courseModal.style.opacity = '0';
      courseModal.style.transform = 'scale(0.9)';
      
      // Trigger reflow
      courseModal.offsetHeight;
      
      // Animate in
      courseModal.style.opacity = '1';
      courseModal.style.transform = 'scale(1)';
      courseModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  }
  
  // Load categories for dropdown
  function loadCategoriesForDropdown() {
    if (!courseCategorySelect) return;
    
    // Clear existing options
    courseCategorySelect.innerHTML = '<option value="">Select a category</option>';
    
    // Add categories to dropdown
    allCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category._id;
      option.textContent = category.name;
      courseCategorySelect.appendChild(option);
    });
  }
  
  // Open category modal
  function openCategoryModal(category = null) {
    if (category) {
      if (categoryModalTitle) categoryModalTitle.textContent = 'Edit Category';
      if (categoryIdInput) categoryIdInput.value = category._id;
      if (document.getElementById('category-name')) document.getElementById('category-name').value = category.name;
      if (document.getElementById('category-description')) document.getElementById('category-description').value = category.description;
    } else {
      if (categoryModalTitle) categoryModalTitle.textContent = 'Add New Category';
      if (categoryIdInput) categoryIdInput.value = '';
      if (categoryForm) categoryForm.reset();
    }
    
    // Show modal with animation
    if (categoryModal) {
      categoryModal.style.display = 'block';
      categoryModal.style.opacity = '0';
      categoryModal.style.transform = 'scale(0.9)';
      
      // Trigger reflow
      categoryModal.offsetHeight;
      
      // Animate in
      categoryModal.style.opacity = '1';
      categoryModal.style.transform = 'scale(1)';
      categoryModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  }
  
  // Edit category
  function editCategory(categoryId) {
    fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(category => {
      openCategoryModal(category);
    })
    .catch(error => {
      console.error('Error loading category:', error);
      createNotification('Error loading category details', 'error');
    });
  }
  
  // Delete category
  function deleteCategory(categoryId) {
    // Create beautiful confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal modal';
    confirmModal.innerHTML = `
      <div class="modal-content">
        <div class="confirm-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirm Deletion</h3>
        </div>
        <div class="confirm-body">
          <p>Are you sure you want to delete this category? This action cannot be undone.</p>
        </div>
        <div class="confirm-actions">
          <button class="btn btn-secondary" id="cancel-delete">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    // Show modal with animation
    confirmModal.style.display = 'block';
    confirmModal.style.opacity = '0';
    confirmModal.style.transform = 'scale(0.9)';
    
    // Trigger reflow
    confirmModal.offsetHeight;
    
    // Animate in
    confirmModal.style.opacity = '1';
    confirmModal.style.transform = 'scale(1)';
    confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add event listeners
    const cancelBtn = confirmModal.querySelector('#cancel-delete');
    const confirmBtn = confirmModal.querySelector('#confirm-delete');
    
    const closeModal = () => {
      confirmModal.style.opacity = '0';
      confirmModal.style.transform = 'scale(0.9)';
      confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        confirmModal.remove();
      }, 300);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
      closeModal();
      
      fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Category deletion failed');
        }
        return response.json();
      })
      .then(data => {
        createNotification('Category deleted successfully!', 'success');
        loadAdminCategories();
      })
      .catch(error => {
        createNotification('Failed to delete category. Please try again.', 'error');
        console.error('Category deletion error:', error);
      });
    });
  }
  
  // Add module input
  function addModuleInput(title = '', duration = '', lessons = []) {
    if (!modulesContainer) return;
    
    const moduleInput = document.createElement('div');
    moduleInput.className = 'module-input';
    moduleInput.style.opacity = '0';
    moduleInput.style.transform = 'translateY(20px)';
    
    // Create lessons HTML
    let lessonsHTML = '';
    if (lessons.length > 0) {
      lessonsHTML = lessons.map(lesson => `
        <div class="lesson-input">
          <input type="text" class="lesson-title" placeholder="Lesson Title" value="${lesson.title}" required>
          <input type="text" class="lesson-duration" placeholder="Duration (e.g., 30 minutes)" value="${lesson.duration}" required>
          <input type="text" class="lesson-video-url" placeholder="Video Embed URL" value="${lesson.videoUrl || ''}">
          <button type="button" class="remove-lesson"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');
    } else {
      lessonsHTML = `
        <div class="lesson-input">
          <input type="text" class="lesson-title" placeholder="Lesson Title" required>
          <input type="text" class="lesson-duration" placeholder="Duration (e.g., 30 minutes)" required>
          <input type="text" class="lesson-video-url" placeholder="Video Embed URL">
          <button type="button" class="remove-lesson"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }
    
    moduleInput.innerHTML = `
      <div class="module-header">
        <input type="text" class="module-title" placeholder="Module Title" value="${title}" required>
        <input type="text" class="module-duration" placeholder="Duration (e.g., 4 hours)" value="${duration}" required>
        <button type="button" class="remove-module"><i class="fas fa-trash"></i></button>
      </div>
      <div class="lessons-label">Lessons:</div>
      <div class="lessons-container">
        ${lessonsHTML}
      </div>
      <button type="button" class="add-lesson-btn"><i class="fas fa-plus"></i> Add Lesson</button>
    `;
    
    modulesContainer.appendChild(moduleInput);
    
    // Animate module in
    setTimeout(() => {
      moduleInput.style.opacity = '1';
      moduleInput.style.transform = 'translateY(0)';
      moduleInput.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 100);
    
    // Add event listener to add lesson button
    moduleInput.querySelector('.add-lesson-btn').addEventListener('click', () => {
      const lessonsContainer = moduleInput.querySelector('.lessons-container');
      const lessonInput = document.createElement('div');
      lessonInput.className = 'lesson-input';
      lessonInput.style.opacity = '0';
      lessonInput.style.transform = 'translateY(20px)';
      
      lessonInput.innerHTML = `
        <input type="text" class="lesson-title" placeholder="Lesson Title" required>
        <input type="text" class="lesson-duration" placeholder="Duration (e.g., 30 minutes)" required>
        <input type="text" class="lesson-video-url" placeholder="Video Embed URL">
        <button type="button" class="remove-lesson"><i class="fas fa-trash"></i></button>
      `;
      
      lessonsContainer.appendChild(lessonInput);
      
      // Animate lesson in
      setTimeout(() => {
        lessonInput.style.opacity = '1';
        lessonInput.style.transform = 'translateY(0)';
        lessonInput.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, 100);
    });
  }
  
  // Handle category submit
  function handleCategorySubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    const categoryId = categoryIdInput ? categoryIdInput.value : '';
    const url = categoryId ? `${API_BASE_URL}/api/admin/categories/${categoryId}` : `${API_BASE_URL}/api/admin/categories`;
    const method = categoryId ? 'PUT' : 'POST';
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ name, description })
    })
    .then(response => {
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        return response.json().then(err => { 
          console.error('Response error:', err);
          throw err; 
        });
      }
      return response.json();
    })
    .then(data => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      createNotification(`Category ${categoryId ? 'updated' : 'created'} successfully!`, 'success');
      
      // Close modal
      categoryModal.style.display = 'none';
      
      // Reload categories
      loadAdminCategories();
    })
    .catch(error => {
      console.error('Category save error:', error);
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show error notification
      createNotification(`Failed to ${categoryId ? 'update' : 'create'} category: ${error.message}`, 'error');
    });
  }
  
  // Handle course submit
  function handleCourseSubmit(e) {
    e.preventDefault();
    
    // Get form elements from the form itself
    const form = e.target;
    const courseIdInput = form.querySelector('#course-id');
    const titleInput = form.querySelector('#course-title');
    const descriptionInput = form.querySelector('#course-description');
    const instructorInput = form.querySelector('#course-instructor');
    const priceInput = form.querySelector('#course-price');
    const imageUrlInput = form.querySelector('#course-image-url');
    const categoryInput = form.querySelector('#course-category');
    
    // Check if required inputs exist
    if (!titleInput || !descriptionInput || !instructorInput || !priceInput || !imageUrlInput || !categoryInput) {
      createNotification('Form elements not found. Please refresh the page and try again.', 'error');
      console.error('Form elements missing:', {
        titleInput: !!titleInput,
        descriptionInput: !!descriptionInput,
        instructorInput: !!instructorInput,
        priceInput: !!priceInput,
        imageUrlInput: !!imageUrlInput,
        categoryInput: !!categoryInput
      });
      return;
    }
    
    // Get values directly from inputs
    const courseId = courseIdInput ? courseIdInput.value : '';
    const title = titleInput.value ? titleInput.value.trim() : '';
    const description = descriptionInput.value ? descriptionInput.value.trim() : '';
    const instructor = instructorInput.value ? instructorInput.value.trim() : '';
    const price = priceInput.value ? parseFloat(priceInput.value) : 0;
    const imageUrl = imageUrlInput.value ? imageUrlInput.value.trim() : '';
    const category = categoryInput.value ? categoryInput.value : '';
    
    // Debug logging to see what values we're getting
    console.log('Form values:', {
      title: `"${title}"`,
      description: `"${description}"`,
      instructor: `"${instructor}"`,
      price: price,
      imageUrl: `"${imageUrl}"`,
      category: `"${category}"`
    });
    
    // Validate required fields
    if (!title) {
      createNotification('Please enter a course title', 'error');
      titleInput.focus();
      return;
    }
    
    if (!description) {
      createNotification('Please enter a course description', 'error');
      descriptionInput.focus();
      return;
    }
    
    if (!instructor) {
      createNotification('Please enter an instructor name', 'error');
      instructorInput.focus();
      return;
    }
    
    if (isNaN(price) || price < 0) {
      createNotification('Please enter a valid price (must be a positive number)', 'error');
      priceInput.focus();
      return;
    }
    
    if (!imageUrl) {
      createNotification('Please enter a course image URL', 'error');
      imageUrlInput.focus();
      return;
    }
    
    if (!category) {
      createNotification('Please select a category', 'error');
      categoryInput.focus();
      return;
    }
    
    // Validate and fix image URL
    const validatedImageUrl = validateImageUrl(imageUrl);
    if (!validatedImageUrl) {
      createNotification('Please enter a valid image URL', 'error');
      imageUrlInput.focus();
      return;
    }
    
    // Collect modules and lessons
    const modules = [];
    const modulesContainer = form.querySelector('#modules-container');
    
    if (modulesContainer) {
      const moduleInputs = modulesContainer.querySelectorAll('.module-input');
      
      console.log('Found modules:', moduleInputs.length);
      
      moduleInputs.forEach((moduleEl, moduleIndex) => {
        const moduleTitle = moduleEl.querySelector('.module-title');
        const moduleDuration = moduleEl.querySelector('.module-duration');
        
        const moduleTitleValue = moduleTitle && moduleTitle.value ? moduleTitle.value.trim() : '';
        const moduleDurationValue = moduleDuration && moduleDuration.value ? moduleDuration.value.trim() : '';
        
        console.log(`Module ${moduleIndex}:`, {
          title: `"${moduleTitleValue}"`,
          duration: `"${moduleDurationValue}"`
        });
        
        // Skip empty modules
        if (!moduleTitleValue || !moduleDurationValue) {
          console.log(`Skipping empty module ${moduleIndex}`);
          return;
        }
        
        const lessons = [];
        const lessonInputs = moduleEl.querySelectorAll('.lesson-input');
        
        console.log(`Module ${moduleIndex} has ${lessonInputs.length} lessons`);
        
        lessonInputs.forEach((lessonEl, lessonIndex) => {
          const lessonTitle = lessonEl.querySelector('.lesson-title');
          const lessonDuration = lessonEl.querySelector('.lesson-duration');
          const lessonVideoUrl = lessonEl.querySelector('.lesson-video-url');
          
          const lessonTitleValue = lessonTitle && lessonTitle.value ? lessonTitle.value.trim() : '';
          const lessonDurationValue = lessonDuration && lessonDuration.value ? lessonDuration.value.trim() : '';
          const lessonVideoUrlValue = lessonVideoUrl && lessonVideoUrl.value ? lessonVideoUrl.value.trim() : '';
          
          console.log(`Lesson ${lessonIndex}:`, {
            title: `"${lessonTitleValue}"`,
            duration: `"${lessonDurationValue}"`,
            videoUrl: `"${lessonVideoUrlValue}"`
          });
          
          // Skip empty lessons
          if (!lessonTitleValue || !lessonDurationValue) {
            console.log(`Skipping empty lesson ${lessonIndex}`);
            return;
          }
          
          lessons.push({
            title: lessonTitleValue,
            duration: lessonDurationValue,
            videoUrl: lessonVideoUrlValue
          });
        });
        
        modules.push({
          title: moduleTitleValue,
          duration: moduleDurationValue,
          lessons: lessons
        });
      });
    }
    
    // Validate that at least one module exists
    if (modules.length === 0) {
      createNotification('Please add at least one module with a title and duration', 'error');
      return;
    }
    
    const courseData = {
      title,
      description,
      instructor,
      price,
      imageUrl: validatedImageUrl,
      category,
      modules: JSON.stringify(modules)
    };
    
    console.log('Course data to be sent:', courseData);
    
    const url = courseId ? `${API_BASE_URL}/api/admin/courses/${courseId}` : `${API_BASE_URL}/api/admin/courses`;
    const method = courseId ? 'PUT' : 'POST';
    
    // Show loading notification
    createNotification(`${courseId ? 'Updating' : 'Creating'} course...`, 'info');
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(courseData)
    })
    .then(response => {
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        return response.json().then(err => { 
          console.error('Response error:', err);
          throw err; 
        });
      }
      return response.json();
    })
    .then(data => {
      createNotification(`Course ${courseId ? 'updated' : 'created'} successfully!`, 'success');
      
      if (courseModal) {
        courseModal.style.opacity = '0';
        courseModal.style.transform = 'scale(0.9)';
        courseModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          courseModal.style.display = 'none';
        }, 300);
      }
      
      loadAdminCourses();
    })
    .catch(error => {
      console.error('Course save error:', error);
      createNotification(`Failed to ${courseId ? 'update' : 'create'} course: ${error.message}`, 'error');
    });
  }
  
  // Edit course
  function editCourse(courseId) {
    fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(course => {
      openCourseModal(course);
    })
    .catch(error => {
      console.error('Error loading course:', error);
      createNotification('Error loading course details', 'error');
    });
  }
  
  // Delete course
  function deleteCourse(courseId) {
    // Create beautiful confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal modal';
    confirmModal.innerHTML = `
      <div class="modal-content">
        <div class="confirm-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirm Deletion</h3>
        </div>
        <div class="confirm-body">
          <p>Are you sure you want to delete this course? This action cannot be undone.</p>
        </div>
        <div class="confirm-actions">
          <button class="btn btn-secondary" id="cancel-delete">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    // Show modal with animation
    confirmModal.style.display = 'block';
    confirmModal.style.opacity = '0';
    confirmModal.style.transform = 'scale(0.9)';
    
    // Trigger reflow
    confirmModal.offsetHeight;
    
    // Animate in
    confirmModal.style.opacity = '1';
    confirmModal.style.transform = 'scale(1)';
    confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add event listeners
    const cancelBtn = confirmModal.querySelector('#cancel-delete');
    const confirmBtn = confirmModal.querySelector('#confirm-delete');
    
    const closeModal = () => {
      confirmModal.style.opacity = '0';
      confirmModal.style.transform = 'scale(0.9)';
      confirmModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        confirmModal.remove();
      }, 300);
    };
    
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
      closeModal();
      
      fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Course deletion failed');
        }
        return response.json();
      })
      .then(data => {
        createNotification('Course deleted successfully!', 'success');
        loadAdminCourses();
      })
      .catch(error => {
        createNotification('Failed to delete course. Please try again.', 'error');
        console.error('Course deletion error:', error);
      });
    });
  }

  // Initialize the app
  init();
});
