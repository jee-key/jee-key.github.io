'use strict';


//Validation forms
function validateForm(selector) {
    Array.from(document.querySelectorAll(selector)).forEach(item => {
        item.addEventListener('input', (e) => {
            if(e.target.value === ''){
            item.dataset.touched = false;
            }
        });
        item.addEventListener('invalid', () => {
            item.dataset.touched = true;
        });
        item.addEventListener('blur', () => {
            if (item.value !== '') item.dataset.touched = true;
        });
    });
};

validateForm('.js-form .form-field');

var minimumSubmitTime = 2500;

Array.from(document.querySelectorAll('.js-form')).forEach(function(form) {
    form.dataset.startedAt = Date.now();
    form.dataset.interacted = 'false';

    Array.from(form.querySelectorAll('.form-field')).forEach(function(field) {
        field.addEventListener('focus', function() {
            form.dataset.interacted = 'true';
        });
        field.addEventListener('input', function() {
            form.dataset.interacted = 'true';
        });
    });

    form.addEventListener('submit', function(e) {
        submitForm(e, form);
    });
});

function submitForm(e, form) {
    e.preventDefault();

    var status = form.querySelector('.js-form-status');
    var button = form.querySelector('button[type="submit"]');
    var originalButtonText = button.textContent;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (form.querySelector('[name="_honey"]').value !== '') {
        return;
    }

    if (form.dataset.interacted !== 'true' || Date.now() - Number(form.dataset.startedAt) < minimumSubmitTime) {
        status.textContent = 'Please try sending again.';
        status.className = 'contacts__form-status js-form-status contacts__form-status--error';
        return;
    }

    status.textContent = 'Sending...';
    status.className = 'contacts__form-status js-form-status';
    button.disabled = true;
    button.textContent = 'Sending';

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            Accept: 'application/json'
        }
    })
        .then(function(response) {
            return response.json().catch(function() {
                return {};
            }).then(function(data) {
                if (!response.ok) {
                    throw new Error(data.message || 'Could not send the message.');
                }

                return data;
            });
        })
        .then(function() {
            form.reset();
            status.textContent = 'Thanks, your message has been sent.';
            status.classList.add('contacts__form-status--success');
        })
        .catch(function(error) {
            status.textContent = error.message || 'Could not send the message. Please email me directly.';
            status.classList.add('contacts__form-status--error');
        })
        .finally(function() {
            button.disabled = false;
            button.textContent = originalButtonText;
        });
}
