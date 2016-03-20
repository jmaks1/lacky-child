"use strict";

/**
 * User main file
 */

var GJ = require('./gj');

/**
 * User Class
 *
 * @constructor
 */
function User() {
    this.guest = true;
    this.userid = 0;
    this.name = __('Guest');
    this.surname = '';
    this.gender = false;
    this.avatar = '';
    this.captchaId = 0;

    this.forms = {
        register: {
            urlForm: '/ajax/register_form',
            urlRequest: '/user/register',
            id: 'register-form',
            msg: {
                success: __('On the specified e-mail was sent a letter with further instructions')
            }
        },
        recovery: {
            urlForm: '/ajax/password_recovery_form',
            urlRequest: '/user/recovery',
            id: 'recovery-form',
            msg: {
                success: __('On the specified e-mail was sent a letter with further instructions')
            }
        },
        login: {
            urlForm: '/ajax/login_form',
            urlRequest: '/user/login',
            id: 'login-form',
            msg: {
                success: __('Success')
            }
        },
        none: {
            msg: {
                success: __('Success')
            }
        }
    };
}

/**
 * Check all inputs
 *
 * @param arr
 * @param parent
 * @returns {boolean}
 */
User.prototype.beforeHandler = function(arr, parent) {
    var self = this;
    var passwords = [];
    var checkout = true;

    parent.find('button[type="submit"]').button('loading');

    arr.forEach(function(item, id, arr) {
        // check passwords
        if (item.type === 'password') passwords[passwords.length] = item;
        // for old browser without html 5 support
        if (!item.value && item.required) {
            parent.find('input[name="' + item.name + '"]').parents('.form-group').addClass('has-error');
            checkout = false;
            $.jGrowl(__('Fill in the required fields'), {group: 'alert-danger'});
        }
        // check captcha
        if (!item.value && item.name === 'g-recaptcha-response') {
            checkout = false;
            $.jGrowl(__("Prove that you're not a robot"), {group: 'alert-danger'});
        }
    });

    // check passwords for equality and length
    if (passwords.length > 1 && passwords[0].value !== passwords[1].value) {
        parent.find('input[name="' + passwords[1].name + '"]').parents('.form-group').addClass('has-error');
        checkout = false;

        $.jGrowl(__('Passwords do not match'), {group: 'alert-danger'});
    } else if(passwords.length > 0 && passwords[0].value.length < 6) {
        passwords.forEach(function(item, id, arr) {
            parent.find('input[name="' + item.name + '"]').parents('.form-group').addClass('has-error');
        });
        checkout = false;

        $.jGrowl(__('The password should be at least 6 characters'), {group: 'alert-danger'});
    }


    if (!checkout) {
        parent.find('button[type="submit"]').button('reset');
    }
    return checkout;
};

/**
 * Processing server response
 *
 * @param response
 * @param parent
 * @param name
 * @param form
 */
User.prototype.afterHandler = function(response, parent, name, form) {
    var self = this;
    var form = form || false;
    var name = name || 'none';

    setTimeout(function() {
        parent.find('button[type="submit"]').button('reset');
    }, 300);

    // incorrect response
    if (typeof response.error !== 'boolean') {
        $.jGrowl('incorrect response', {group: 'alert-danger'});
        if (form) form.modal._parent.modal('hide');
        return false;
    }
    // process response
    if (!!response.error) {
        if (response.data instanceof Object && Object.keys(response.data).length > 0) {
            for(var item in response.data) {
                parent.find('input[name="' + name + '[' + item + ']"]').parents('.form-group').addClass('has-error');
                $.jGrowl(response.data[item], {group: 'alert-danger'});
            }
        } else if(typeof response.data === 'string') {
            parent.find('input[name="' + response.data + '"]').parents('.form-group').addClass('has-error');
            $.jGrowl(response.msg, {group: 'alert-danger'});
        } else {
            $.jGrowl(response.msg, {group: 'alert-danger'});
        }
    } else {
        $.jGrowl(response.msg || self.forms[name].msg.success, {group: 'alert-success'});
        if (form) form.modal._parent.modal('hide');
    }

    if (window.grecaptcha instanceof Object && parent.find('#re-captcha').length > 0) {
        window.grecaptcha.reset(self.captchaId);
    }
};

/**
 * Render forms
 *
 * @param name
 */
User.prototype.renderForm = function(name) {
    var self = this;


    $.get((GJ.lang == 'en' ? '/en' : '') + self.forms[name].urlForm, {}, function (data) {
        require.ensure([], function(require) {
            var modal = require('./modal');
            var form = {};

            require('jquery-form');
            require('jGrowl');

            GJ.loadCss('/bower_components/jGrowl/jquery.jgrowl.min.css');

            form.modal = modal.createModal(self.forms[name].id, false, 'modal-sm');
            form.modal._content.html(data);

            if (window.grecaptcha instanceof Object) {
                self.captchaId = window.grecaptcha.render('re-captcha', {
                    'sitekey' : '6LevKRkTAAAAAOou456dDWKv0q7EQyhHdqxvIPpk'
                });
            }


            form.modal._parent.find('form').ajaxForm({
                url: self.forms[name].urlRequest,
                type: 'POST',
                dataType: 'json',
                beforeSubmit: function (arr, parent) {return self.beforeHandler(arr, parent);},
                success: function(response, status, xhr, parent) {self.afterHandler(response, parent, name, form);}
            });
        });
    });
};

module.exports = new User();