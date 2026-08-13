"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long.' };
    }
    return { isValid: true, message: '' };
};
exports.validatePassword = validatePassword;
const validateName = (name) => {
    return name.trim().length >= 2;
};
exports.validateName = validateName;
