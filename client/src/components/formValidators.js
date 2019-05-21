// Validators
export const isRequired = (value) => {
    if (!value) return '*This field is required.';
    return true;
}

export const minLength = (value, minLength) => {
    if (value.length < minLength) return '*Minimum length: ' + minLength;
    return true;
}

export const maxLength = (value, maxLength) => {
    if (value.length > maxLength) return '*Maximum length: ' + maxLength;
    return true;
}

export const passwordsMatch = (value1, value2) => {
    if (value1 !== value2) return '*Passwords do not match.'
    return true;
}

export const isValidEmail = (value) => {
    let emailSplit = value.split('');
    let count = 0;

    for (let i = 0; i < emailSplit.length; i++) {
        if (emailSplit[i] === '@') count++;
    }

    if (count !== 1) return '*Please enter a valid email address.';
    return true;
}

export const isAlphaOnly = (value) => {
    var regex = new RegExp('^[a-zA-Z\s]*$');
    if (value && regex.test(value) === false) return '*This field only accepts letters of the alphabet.';
    return true;
}

export const isAlphaNumeric = (value) => {
    var regex = new RegExp('^[a-zA-Z0-9]+$');
    if (value && regex.test(value) === false) return '*This field only accepts alphanumeric characters.';
    return true;
}