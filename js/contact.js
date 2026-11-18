/**
 * STACKLY — Contact & Consultation Page Engine
 * File: js/contact.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other accordions
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        // Toggle current
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // 2. Contact Form Client-side Validation & Feedback
  const contactForm = document.getElementById('contact-form');
  const responseBox = document.getElementById('contact-response-box');

  // Clear error on input
  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    if (input) {
      input.classList.remove('is-invalid');
      const errorEl = input.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.textContent = '';
    }
  }

  if (contactForm) {
    // Clear errors on input
    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => clearFieldError(id));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      let hasError = false;

      // Validate name
      const nameInput = document.getElementById('contact-name');
      const nameError = nameInput?.parentElement.querySelector('.field-error');
      if (!name) {
        if (nameInput) nameInput.classList.add('is-invalid');
        if (nameError) nameError.textContent = 'Please enter your full name.';
        hasError = true;
      }

      // Validate email
      const emailInput = document.getElementById('contact-email');
      const emailError = emailInput?.parentElement.querySelector('.field-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        if (emailInput) emailInput.classList.add('is-invalid');
        if (emailError) emailError.textContent = 'Please enter your email address.';
        hasError = true;
      } else if (!emailRegex.test(email)) {
        if (emailInput) emailInput.classList.add('is-invalid');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      }

      // Validate subject
      const subjectInput = document.getElementById('contact-subject');
      const subjectError = subjectInput?.parentElement.querySelector('.field-error');
      if (!subject) {
        if (subjectInput) subjectInput.classList.add('is-invalid');
        if (subjectError) subjectError.textContent = 'Please enter a subject for your inquiry.';
        hasError = true;
      }

      // Validate message
      const messageInput = document.getElementById('contact-message');
      const messageError = messageInput?.parentElement.querySelector('.field-error');
      if (!message) {
        if (messageInput) messageInput.classList.add('is-invalid');
        if (messageError) messageError.textContent = 'Please enter your message.';
        hasError = true;
      }

      if (hasError) return;

      // Success state (client-side demo)
      if (responseBox) {
        responseBox.style.display = 'block';
        responseBox.innerHTML = `
          <div style="background: rgba(63, 117, 83, 0.12); border-left: 3px solid var(--color-accent-green); padding: 1.2rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
            <h4 style="color: var(--color-accent-green); margin-bottom: 0.3rem;">Message Received (Demo Mode)</h4>
            <p style="font-size: 0.9rem; color: var(--color-secondary); margin: 0;">
              Thank you, <strong>${name}</strong>. Your consultation inquiry regarding "<em>${subject}</em>" has been validated and recorded locally. A STACKLY eyewear stylist will respond to <em>${email}</em>.
            </p>
          </div>
        `;
      }

      if (window.STACKLY_MAIN) {
        window.location.href='./404.html'
      }

      contactForm.reset();
      // Clear all error states on reset
      ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => clearFieldError(id));
    });
  }
});
