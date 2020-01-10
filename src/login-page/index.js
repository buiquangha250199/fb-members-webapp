const componentName = "loginPage";
module.exports = componentName;

const service = require('../app-service');

angular.module(componentName, ['ngRoute', service])
  .component("loginPage", {
    controller: LoginController,
    controllerAs: "self",
    template: require("./template.html"),
    style: require("./style.css")
  });

function LoginController($location, AuthenticationService, $rootScope) {

    let self = this;

    self.title = "Login";

    self.status = true;

    self.login = function () {

        AuthenticationService.Login(self.username, self.password, function (response) {
            if (response.data.success) {
                // console.log(response.data.data.token);
                localStorage.setItem("token", response.data.data.token);
                self.status = true;
                self.message = 'success';
                $rootScope.login = true;
                $location.path('/api/v1/platforms');
                
            } else {
                // console.log(response.data);
                self.status = false;
                self.message = 'error';
                self.reason = response.data.reason;
            }
        });

        event.preventDefault();
    };

}