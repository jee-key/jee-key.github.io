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

Array.from(document.querySelectorAll('.js-form')).forEach(function(form) {
    form.addEventListener('submit', function(e) {
        submitForm(e, form);
    });
});

function submitForm(e, form) {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    var name = form.querySelector('.js-field-name').value.trim();
    var email = form.querySelector('.js-field-email').value.trim();
    var message = form.querySelector('.js-field-message').value.trim();
    var recipient = 'galinka@me.com';
    var subject = 'Contact form message from ' + name;
    var body = [
        'Name: ' + name,
        'Email: ' + email,
        '',
        message
    ].join('\n');

    window.location.href = 'mailto:' + recipient +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
}
