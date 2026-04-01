const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
	const statusEl = contactForm.querySelector('[data-form-status]');
	const submitButton = contactForm.querySelector('button[type="submit"]');
	const defaultButtonText = submitButton ? submitButton.textContent : 'Submit Inquiry';
	const endpoint = contactForm.dataset.endpoint;

	const setStatus = (message, type) => {
		if (!statusEl) {
			return;
		}

		statusEl.textContent = message;
		statusEl.classList.remove('is-success', 'is-error');

		if (type) {
			statusEl.classList.add(type);
		}
	};

	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (!endpoint) {
			setStatus('Form endpoint is not configured.', 'is-error');
			return;
		}

		const formData = new FormData(contactForm);
		setStatus('Sending your request...', '');

		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = 'Sending...';
		}

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Submission failed.');
			}

			setStatus('Request sent successfully. We will contact you soon.', 'is-success');
			contactForm.reset();
		} catch (error) {
			setStatus('Unable to send right now. Please try again in a moment.', 'is-error');
		} finally {
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.textContent = defaultButtonText;
			}
		}
	});
}
