const componentName = "registerPage";
module.exports = componentName;

const service = require('../app-service');

angular.module(componentName, ['ngRoute', service])
  .component("registerPage", {
    controller: RegisterController,
    controllerAs: "self",
    template: require("./template.html"),
    style: require("./style.css")
  });

function RegisterController($location, AuthenticationService, $rootScope) {
    let self = this;

    self.title = "Register";

    self.status = true;

    self.register = function () {

        AuthenticationService.Register(self.username, self.password, self.email, function (response) {
            if (response.data.success) {
                console.log(response.data);
                self.status = true;
                $rootScope.register = true;

                $location.path('/api/v1/accounts/login');
                
            } else {
                console.log(response.data);
                self.status = false;
                self.reason = response.data.reason;
            }
        });

        event.preventDefault();
    };

}
