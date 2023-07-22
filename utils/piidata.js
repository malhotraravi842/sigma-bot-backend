const { AsyncRedactor } = require("redact-pii");
const redactor = new AsyncRedactor({
  builtInRedactors: {
    credentials: {
      replaceWith: "CREDENTIAL",
    },
    creditCardNumber: {
      replaceWith: "CARD_NUMBER",
    },
    emailAddress: {
      replaceWith: "EMAIL_ADDRESS",
    },
    ipAddress: {
      replaceWith: "IP_ADDRESS",
    },
    names: {
      replaceWith: "NAMES",
    },
    password: {
      replaceWith: "PASSWORD",
    },
    phoneNumber: {
      replaceWith: "PHONENUMBER",
    },
    streetAddress: {
      replaceWith: "ADDRESS",
    },
    username: {
      replaceWith: "USERNAME",
    },
    usSocialSecurityNumber: {
      replaceWith: "SECURITY_NUMBER",
    },
    zipcode: {
      replaceWith: "ZIP_CODE",
    },
    url: {
      replaceWith: "URL",
    },
    digits: {
      enabled: false,
    },
  },
});

module.exports = redactor;
