const componentName = "app";
module.exports = componentName;

const Login = require('./login-page');
const Register = require('./register-page');
const Platform = require('./platform-page');
const ForgotPassword = require('./forgot-password');

angular.module(componentName, ['ngRoute', Login, Register, Platform, ForgotPassword]);


