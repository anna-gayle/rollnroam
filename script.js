class ThemeManager {
  constructor() {
    this.themeSwitch = document.getElementById('themeSwitch');
    this.initTheme();
    this.setupEventListeners();
  }

  initTheme() {
    // Calculate RGB values for the background color
    document.documentElement.style.setProperty('--bg-color-rgb', this.hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-color')));
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      this.setTheme(prefersDark);
    }
  }

  setTheme(isDarkMode) {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    this.themeSwitch.checked = isDarkMode;
    this.updateThemeIcons();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  setupEventListeners() {
    this.themeSwitch.addEventListener('change', () => {
      this.setTheme(this.themeSwitch.checked);
    });
  }

  updateThemeIcons() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelector('.light-icon')?.classList.toggle('active', !isDarkMode);
    document.querySelector('.dark-icon')?.classList.toggle('active', isDarkMode);
  }

  hexToRgb(hex) {
    // Convert hex color to rgb(r, g, b) format
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '26, 26, 46'; // Default dark theme RGB
  }
}

class RollNRoamApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.init();
  }

  init() {
    this.setupToastContainer();
    this.initTooltips();
    this.setupTabAnimations();
    this.setupFindGamesButton();
    this.setupLogoAnimation();
    this.setupFormValidation();
    this.setupQuickFilters();
    this.createFloatingDice();
    this.injectAdditionalStyles();
  }

  setupToastContainer() {
    if (!document.getElementById('toastContainer')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
  }

  initTooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }

  setupTabAnimations() {
    document.querySelectorAll('#mainTabs .nav-link').forEach(tab => {
      tab.addEventListener('click', () => {
        setTimeout(() => {
          const targetTab = document.querySelector(tab.dataset.bsTarget);
          if (targetTab) {
            targetTab.classList.add('tab-animation');
            setTimeout(() => targetTab.classList.remove('tab-animation'), 500);
          }
        }, 150);
      });
    });
  }

  setupFindGamesButton() {
    document.getElementById('findGamesBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('find-tab')?.click();
    });
  }

  setupLogoAnimation() {
    const logo = document.querySelector('.navbar-brand i');
    logo?.addEventListener('mouseenter', () => {
      logo.classList.add('fa-spin');
      setTimeout(() => logo.classList.remove('fa-spin'), 1000);
    });
  }

  setupFormValidation() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(form)) {
          this.handleFormSuccess(form);
        }
      });
    });
  }

  validateForm(form) {
    let isValid = true;
    
    form.querySelectorAll('input[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailInput.classList.add('is-invalid');
      this.showToast('Please enter a valid email address.');
      isValid = false;
    }

    const passwordInput = form.querySelector('input[type="password"]');
    if (passwordInput?.value.trim() && passwordInput.value.length < 6) {
      passwordInput.classList.add('is-invalid');
      this.showToast('Password must be at least 6 characters long.');
      isValid = false;
    }

    return isValid;
  }

  handleFormSuccess(form) {
    bootstrap.Modal.getInstance(form.closest('.modal'))?.hide();
    
    const message = form.closest('#loginModal') 
      ? 'Login successful! Welcome back to Roll n Roam.'
      : 'Account created successfully! Welcome to Roll n Roam.';
    
    this.showToast(message);
    form.reset();
  }

  setupQuickFilters() {
    document.querySelectorAll('.quick-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        document.querySelectorAll('.quick-filter').forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        this.showToast(`Filtering by: ${filter.textContent.trim()}`);
      });
    });
  }

  createFloatingDice() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    const diceContainer = document.createElement('div');
    diceContainer.className = 'floating-dice-container';
    heroContent.appendChild(diceContainer);
    
    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    
    for (let i = 0; i < 8; i++) {
      const dice = document.createElement('i');
      dice.className = `fas fa-dice-${diceTypes[Math.floor(Math.random() * diceTypes.length)]} floating-dice`;
      
      Object.assign(dice.style, {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: `${Math.random() * 0.3 + 0.1}`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`
      });
      
      diceContainer.appendChild(dice);
    }
  }

  showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
      <div class="toast-body">
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close ms-auto float-end" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  injectAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-dice-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
      }
      .floating-dice {
        position: absolute;
        animation: float-dice linear infinite;
        color: var(--accent-color);
      }
      @keyframes float-dice {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.2; }
        90% { opacity: 0.2; }
        100% { transform: translateY(-500px) rotate(360deg); opacity: 0; }
      }
      .tab-animation {
        animation: fadeInTab 0.5s ease;
      }
      @keyframes fadeInTab {
        0% { opacity: 0.7; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      body { transition: background-color 0.3s ease, color 0.3s ease; }
      .toast {
        border-radius: 8px;
        background-color: var(--dark-bg);
        border-left: 4px solid var(--accent-color);
      }
      .toast .fa-check-circle { color: var(--accent-color); }
    `;
    document.head.appendChild(style);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new RollNRoamApp();
});