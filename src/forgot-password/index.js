const componentName = "forgotPassword";
module.exports = componentName;

const service = require('../app-service');

angular.module(componentName, ['ngRoute', service])
  .component("forgotPassword", {
    controller: ForgotPasswordController,
    controllerAs: "self",
    template: require("./template.html"),
    style: require("./style.css")
  });

function ForgotPasswordController($scope, $location, AuthenticationService, $rootScope) {
   console.log("forgotPassword works!")

}