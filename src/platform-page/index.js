const componentName = "platformPage";
module.exports = componentName;

const service = require('../app-service');

angular.module(componentName, ['ngRoute', 'angularUtils.directives.dirPagination', service])
.component("platformPage", {
    controller: PlatformController,
    controllerAs: "self",
    template: require("./template.html"),
    style: require("./style.css")
});

/////////////////// Get list platform /////////////////////////////
function getPlatform($http) {

    let getPlatformsReq = {
        method: 'GET',
        url: 'https://fb-members.sellpro.vn/api/v1/platforms',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.token
        }
    } 

    let platforms = [];

    $http(getPlatformsReq).then(function (res) {

        platforms.push(res.data.data.platforms);

    }, function (res) {
        self.res = res.status;
        console.log(self.res);
    });

    return platforms;
}

function PlatformController($location, FacebookPlatformService, $rootScope, $http) {

    let self = this;
    self.hidden = true;

    const socket = io('https://fb-members.sellpro.vn/', {
                query: {
                    token: localStorage.token,
                }
            });
            socket.on("connect.ok", (data) => console.log(data));
            socket.on("group.status.change", function(){
                let getlistReq = {
                    method: 'GET',
                    url: 'https://fb-members.sellpro.vn/api/v1/groups/' + self.platform_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.token
                    }
                } 
            
                $http(getlistReq).then(function (res) {
                    self.list = res.data.data.groups;
                    
                    // console.log(self.list);
            
                }, function (res) {
                    self.res = res.status;
                    console.log(self.res);
                });
            });
            socket.on("error", (data) => console.log(data));

    // console.log(localStorage.token);   

    self.platforms = getPlatform($http);

    //////////////////////////////////////////////////////////

    self.platform_id = 1;

    self.setPlatformId = function (id) {
        self.platform_id = id;
        // console.log(self.platform_id);
    }

    ////////////////////////////////////////////////////////

    let getlistReq = {
        method: 'GET',
        url: 'https://fb-members.sellpro.vn/api/v1/groups/' + self.platform_id,
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.token
        }
    } 

    $http(getlistReq).then(function (res) {
        self.list = res.data.data.groups;
        
        // console.log(self.list);

    }, function (res) {
        self.res = res.status;
        console.log(self.res);
    });
    // self.list = getListGroup($http);
    // console.log(self.list);

    //////////////////////////////////////////////////////////

    self.csv_link = null;

    self.getCsvFile = function (group_id) {
        self.group_id = group_id;

        let getCsvFileReq = {
        method: 'GET',
        url: 'https://fb-members.sellpro.vn/api/v1/members/' + group_id,
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.token
        }
    }

    $http(getCsvFileReq).then(function (res) {
        // console.log(res.data.data.csv_link);
        self.csv_link = res.data.data.csv_link;
    }, function (res) {
        self.res = res.status;
        console.log(self.res);
    });
    }
    //////////////////////////////////////////////////////////

    self.deleteGroup = function (id) {

        let req = {
            method: 'DELETE',
            url: 'https://fb-members.sellpro.vn/api/v1/groups/' + id,
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }

        }
        $http(req).then(function (res) {
            // console.log(res.data);
            // console.log(req);
            location.reload();
        }, function (res) {
            self.res = res.status;
            console.log(self.res);
        });
}

    //////////////////////////////////////////////////////////

    self.sendCookie = function () {
        self.cookie = JSON.parse(self.cookie);
        // console.log(self.cookie);
        FacebookPlatformService.SendCookie(self.cookie, self.platform_id, function (response) {
            if (response.data.success) {
                
                self.hidden = false;
                self.typeAlert = true;
                self.iconMsg = 'fas fa-check-circle';
                self.msg = "Success!";
                self.cookie = null;
                // console.log(response.data);
                location.reload();
            } else {
                self.hidden = false;
                self.typeAlert = false;
                self.iconMsg = 'fas fa-exclamation-triangle';
                self.msg = response.data.reason;
                // console.log(response.data);
            }
        });

        
    };

    ////////////////////////////////////////////////////////////////

    self.sendLink = function () {
        FacebookPlatformService.SendLink(self.link, self.platform_id, function (response) {
            if (response.data.success) {
                self.hidden = false;
                self.typeAlert = true;
                self.iconMsg = 'fas fa-check-circle';
                self.msg = 'Success!';
                self.link = null;
                // console.log(response.data);
                location.reload();

                let getlistReq = {
                    method: 'GET',
                    url: 'https://fb-members.sellpro.vn/api/v1/groups/' + self.platform_id,
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.token
                    }
                } 

                $http(getlistReq).then(function (res) {
                    self.list = res.data.data.groups;

                }, function (res) {
                    self.res = res.status;
                    console.log(self.res);
                });
                
            } else {
                self.hidden = false;
                self.typeAlert = false;
                self.iconMsg = 'fas fa-exclamation-triangle';
                self.msg = response.data.reason;
                // console.log(response.data);
            }
        });

        //event.preventDefault();
    };


    self.updateUrl = function (id) {

        let req = {
            method: 'PUT',
            url: 'https://fb-members.sellpro.vn/api/v1/groups/' + id,
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            data: {
                'newUrl': self.url
            }
        }
    
        console.log(req);
    
        $http(req).then(function (res) {
            // console.log(res.data);
            location.reload();
        }, function (res) {
            self.res = res.status;
            console.log(self.res);
        });
    
    }

}

///////////////////////////////////////////////////////////////
{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"> </script>
        <script src="http://code.jquery.com/jquery-latest.min.js"> </script>
        <script>
            const socket = io('https://fb-members.sellpro.vn/', {
                query: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImVtYWlsIjoiYUBnbWFpbC5jb20iLCJpYXQiOjE1Nzg1NTUyNDYsImV4cCI6MTU4MTE0NzI0Nn0.pqBSGlgh14V8TEfgowAlcaOjiq6XfPFYjKBoJa5ue88",
                }
            });
            socket.on("connect.ok", (data) => console.log(data));
            socket.on("group.status.change", () => console.log("group changed"));
            socket.on("error", (data) => console.log(data));
</script> */}