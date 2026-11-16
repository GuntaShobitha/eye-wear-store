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

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        if (window.STACKLY_MAIN) {
          window.STACKLY_MAIN.showToast('Please complete all contact form fields.', 'error');
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (window.STACKLY_MAIN) {
          window.STACKLY_MAIN.showToast('Please enter a valid email address.', 'error');
        }
        return;
      }

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
        window.STACKLY_MAIN.showToast(`Thank you, ${name}! Your inquiry has been submitted.`, 'success');
      }

      contactForm.reset();
    });
  }
});
