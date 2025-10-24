// DevOps Loom - Interactive JavaScript
// Handles navigation, authentication, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAuthentication();
    initSmoothScrolling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Authentication system
function initAuthentication() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Check if user is already logged in
    checkAuthStatus();

    // Modal event listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => openModal(signupModal));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Switch between login and signup
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllModals();
            setTimeout(() => openModal(signupModal), 100);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllModals();
            setTimeout(() => openModal(loginModal), 100);
        });
    }

    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Open modal with animation
function openModal(modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    document.body.style.overflow = 'auto';
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = document.getElementById('rememberMe').checked;

    // Clear previous messages
    clearMessages();

    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Simulate login process
    showMessage('Logging in...', 'success');
    
    setTimeout(() => {
        // For demo purposes, accept any email/password combination
        const user = {
            name: email.split('@')[0],
            email: email,
            loginTime: new Date().toISOString()
        };

        // Store user data
        if (rememberMe) {
            localStorage.setItem('devopsLoomUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('devopsLoomUser', JSON.stringify(user));
        }

        // Update UI
        updateAuthUI(user);
        closeAllModals();
        showMessage('Welcome back!', 'success');
        
        // Clear form
        e.target.reset();
    }, 1500);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Clear previous messages
    clearMessages();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (!agreeTerms) {
        showMessage('Please agree to the terms and conditions', 'error');
        return;
    }

    // Simulate signup process
    showMessage('Creating your account...', 'success');
    
    setTimeout(() => {
        const user = {
            name: name,
            email: email,
            signupTime: new Date().toISOString()
        };

        // Store user data
        localStorage.setItem('devopsLoomUser', JSON.stringify(user));

        // Update UI
        updateAuthUI(user);
        closeAllModals();
        showMessage('Account created successfully! Welcome to DevOps Loom!', 'success');
        
        // Clear form
        e.target.reset();
    }, 2000);
}

// Check authentication status on page load
function checkAuthStatus() {
    const user = localStorage.getItem('devopsLoomUser') || sessionStorage.getItem('devopsLoomUser');
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            updateAuthUI(userData);
        } catch (e) {
            // Clear invalid data
            localStorage.removeItem('devopsLoomUser');
            sessionStorage.removeItem('devopsLoomUser');
        }
    }
}

// Update authentication UI
function updateAuthUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = user.name;
}

// Logout functionality
function logout() {
    localStorage.removeItem('devopsLoomUser');
    sessionStorage.removeItem('devopsLoomUser');
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');

    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (signupBtn) signupBtn.style.display = 'inline-block';
    if (userMenu) userMenu.style.display = 'none';
    
    showMessage('You have been logged out', 'success');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    // Remove existing messages
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Add to the active modal or body
    const activeModal = document.querySelector('.modal.show');
    if (activeModal) {
        const form = activeModal.querySelector('.auth-form');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
        }
    } else {
        // Show as toast notification
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '3000';
        messageDiv.style.maxWidth = '300px';
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.remove();
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations and interactions
function initAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.path-card, .tool-card, .tutorial-card, .resource-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to cards
    document.querySelectorAll('.path-card, .tool-card, .tutorial-card, .resource-category').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add loading states to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#e9ecef';
        }
    });
    
    return isValid;
}

// Add real-time password strength indicator
function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthIndicator(this, strength);
        });
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function updatePasswordStrengthIndicator(input, strength) {
    // Remove existing indicator
    const existingIndicator = input.parentNode.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (input.value.length === 0) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    indicator.style.marginTop = '5px';
    indicator.style.height = '4px';
    indicator.style.borderRadius = '2px';
    indicator.style.background = '#e9ecef';
    indicator.style.position = 'relative';
    indicator.style.overflow = 'hidden';
    
    const strengthBar = document.createElement('div');
    strengthBar.style.height = '100%';
    strengthBar.style.transition = 'width 0.3s ease';
    
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#28a745'];
    const widths = ['20%', '40%', '60%', '80%', '100%'];
    
    strengthBar.style.background = colors[Math.min(strength, 4)];
    strengthBar.style.width = widths[Math.min(strength, 4)];
    
    indicator.appendChild(strengthBar);
    input.parentNode.appendChild(indicator);
}

// Initialize password strength on page load
document.addEventListener('DOMContentLoaded', function() {
    initPasswordStrength();
});
