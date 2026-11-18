/**
 * STACKLY — Authentication System (Demo Mode with localStorage)
 * File: js/auth.js
 */

const STACKLY_AUTH = (function () {
  const USERS_KEY = 'stackly_registered_users';
  const CURRENT_USER_KEY = 'stackly_current_user';

  // Seed default demo accounts
  function getRegisteredUsers() {
    try {
      const users = localStorage.getItem(USERS_KEY);
      if (users) return JSON.parse(users);
    } catch (e) {
      console.error(e);
    }

    const defaultUsers = [
      {
        name: 'Julian Vance',
        email: 'user@stackly.com',
        password: 'password123',
        role: 'User'
      },
      {
        name: 'Eleanor Sterling',
        email: 'admin@stackly.com',
        password: 'adminpassword',
        role: 'Admin'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  function getCurrentUser() {
    try {
      const u = localStorage.getItem(CURRENT_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.add('is-invalid');
    // Find or create error element near the input
    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('small');
      errorEl.className = 'field-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.remove('is-invalid');
    const errorEl = input.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.textContent = '';
  }

  function handleLogin(e) {
    e.preventDefault();
    const roleSelect = document.getElementById('login-role');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');

    let role = roleSelect ? roleSelect.value : 'User';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value : '';

    let hasError = false;

    // Clear previous errors
    clearFieldError('login-email');
    clearFieldError('login-password');

    if (!email || !password) {
      if (!email) {
        showFieldError('login-email', 'Please enter your email address.');
      }
      if (!password) {
        showFieldError('login-password', 'Please enter your password.');
      }
      hasError = true;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      showFieldError('login-email', 'Please enter a valid email address format (e.g. name@domain.com).');
      hasError = true;
    }

    // Determine role: if dropdown is Admin OR email contains "admin" (case-insensitive)
    if (role === 'Admin' || email.toLowerCase().includes('admin')) {
      role = 'Admin';
    }

    // Format display name from email (e.g. john.doe@... -> John Doe)
    const localPart = email.split('@')[0];
    const formattedName = localPart
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const activeUser = {
      name: formattedName || 'Client Member',
      email: email,
      role: role
    };

    // Save active authenticated user session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(activeUser));

    // Also update client profile storage so dashboards immediately display logged-in email
    try {
      let existingProfile = {};
      const stored = localStorage.getItem('stackly_user_profile');
      if (stored) existingProfile = JSON.parse(stored);
      existingProfile.name = formattedName;
      existingProfile.email = email;
      localStorage.setItem('stackly_user_profile', JSON.stringify(existingProfile));
    } catch (err) {
      console.warn('Could not sync profile storage', err);
    }

    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast(`Welcome, ${formattedName}! Redirecting to ${role} Dashboard...`, 'success');
    }

    setTimeout(() => {
      if (role.toLowerCase() === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    }, 600);
  }

  function handleRegister(e) {
    e.preventDefault();
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passInput = document.getElementById('register-password');
    const confirmPassInput = document.getElementById('register-confirm-password');
    const roleSelect = document.getElementById('register-role');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value : '';
    const confirmPass = confirmPassInput ? confirmPassInput.value : '';
    const role = roleSelect ? roleSelect.value : 'User';

    // 1. Check all fields are filled
    if (!name || !email || !password || !confirmPass) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Please fill out all required fields.', 'error');
      return;
    }

    // 2. Check email is in valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Please enter a valid email format (e.g. name@domain.com).', 'error');
      return;
    }

    // 3. Check password matches confirm password
    if (password !== confirmPass) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Password and Confirm Password do not match.', 'error');
      return;
    }

    // No check if email already exists! Save to registered users list for reference
    const users = getRegisteredUsers();
    users.push({
      name,
      email,
      password,
      role
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Store last registered email to pre-fill login page
    localStorage.setItem('stackly_last_registered_email', email);
    localStorage.setItem('stackly_last_registered_role', role);

    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast('Registration successful! Redirecting to sign in...', 'success');
    }

    // Redirect to login page as requested
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 700);
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    const emailInput = document.getElementById('forgot-email');
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

    if (!email) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Please enter your account email.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Please enter a valid email address.', 'error');
      return;
    }

    const resultBox = document.getElementById('forgot-result-box');
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="background: rgba(63, 117, 83, 0.1); border-left: 3px solid var(--color-accent-green); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--color-secondary);">
          <strong>Reset Link Dispatched:</strong> A secure demo password reset link has been dispatched to <em>${email}</em>. Please check your inbox.
        </div>
      `;
    }

    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast(`Reset instructions sent to ${email}`, 'success');
    }

    if (emailInput) emailInput.value = '';
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast('Logged out successfully.', 'info');
    }
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  }

  // Clear login field errors on input
  function initLoginFieldListeners() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (emailInput) emailInput.addEventListener('input', () => clearFieldError('login-email'));
    if (passInput) passInput.addEventListener('input', () => clearFieldError('login-password'));
  }

  // Bind forms if present on page
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);

      // Pre-fill email if redirected from register page
      const lastEmail = localStorage.getItem('stackly_last_registered_email');
      const lastRole = localStorage.getItem('stackly_last_registered_role');
      if (lastEmail) {
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = lastEmail;
        localStorage.removeItem('stackly_last_registered_email');
      }
      if (lastRole) {
        const roleSelect = document.getElementById('login-role');
        if (roleSelect) roleSelect.value = lastRole;
        localStorage.removeItem('stackly_last_registered_role');
      }

      // Clear errors on input
      initLoginFieldListeners();
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);

    document.querySelectorAll('.logout-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
  });

  return {
    getCurrentUser,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    logout
  };
})();

window.STACKLY_AUTH = STACKLY_AUTH;
