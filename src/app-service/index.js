const moduleName = "appService";
module.exports = moduleName;

angular.module(moduleName, [])

.factory('AuthenticationService', ['$http', '$rootScope', function ($http, $rootScope) {

    var service = {};

    service.Login = function (username, password, callback) {

        console.log('login service works.');

        var req = {
            method: 'POST',
            url: 'https://fb-members.sellpro.vn/api/v1/accounts/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                'user_name': username,
                'password' : password
            }
        }

        $http(req).then(function (res) {
            callback(res);

        }, function (res) {
            $scope.res = res.status;
            console.log($scope.res);
        }); 

    }

    service.Register = function (username, password, email, callback) {

        var req = {
            method: 'POST',
            url: 'https://fb-members.sellpro.vn/api/v1/accounts/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                'user_name': username,
                'password' : password,
                'email'    : email
            }
        }

        $http(req).then(function (res) {
            callback(res);

        }, function (res) {
            $scope.res = res.status;
            console.log($scope.res);
        }); 

    }

    return service;
    
}])

.factory('FacebookPlatformService', ['$http', '$rootScope', function ($http, $rootScope) {

    var service = {};

    service.SendCookie = function (cookie, platform_id, callback) {

        let sendCookieReq = {
            method: 'POST',
            url: 'https://fb-members.sellpro.vn/api/v1/cookies',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            data: {
                'cookie': cookie,
                'platform_id': platform_id
            }

        }

        $http(sendCookieReq).then(function (res) {
            callback(res);

        }, function (res) {
            $scope.res = res.status;
            console.log($scope.res);
        }); 

    }

    service.SendLink = function (url, platform_id, callback) {

        let sendLinkReq = {
            method: 'POST',
            url: 'https://fb-members.sellpro.vn/api/v1/groups',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            data: {
                'url': url,
                'platform_id': platform_id
            }

        }

        $http(sendLinkReq).then(function (res) {
            callback(res);

        }, function (res) {
            $scope.res = res.status;
            console.log($scope.res);
        }); 

    }

    return service;
    
}])

.config(function($routeProvider, $locationProvider) {  

    $routeProvider
    .when("/api/v1/accounts/login", {
        template : '<login-page></login-page>'
    })
    .when("/api/v1/accounts/register", {
        template : '<register-page></register-page>'
    })
    .when("/api/v1/accounts/forgot-password", {
        template : '<forgot-password></forgot-password>'
    })
    .when("/api/v1/platforms", {
        template : '<platform-page></platform-page>'
    })

    .otherwise({ redirectTo: '/api/v1/accounts/login' });
})

.run(['$rootScope', '$location', '$http',
    function ($rootScope, $location, $http) {
        $rootScope.login = false;
        $rootScope.register = false;
        $rootScope.status = true;

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() === '/api/v1/accounts/login' && $rootScope.login) {
                $location.path('/api/v1/platforms');
            } 

            if ($location.path() === '/api/v1/platforms') {
                $rootScope.login = false;
            }

            if ($location.path() === '/api/v1/accounts/login' && $rootScope.register) {
                $rootScope.status = false;
            } else {
                $rootScope.status = true;
            }

        });
    }]);