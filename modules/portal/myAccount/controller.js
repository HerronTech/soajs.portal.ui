"use strict";
var myAccountApp = soajsApp.components;

myAccountApp.controller('changeSecurityPortalCtrl', ['$scope', '$timeout', '$modal', 'ngDataApi', function ($scope, $timeout, $modal, ngDataApi) {
	$scope.$parent.isUserLoggedIn();
	$scope.$parent.$on('xferData', function (event, args) {
		$scope.memberData = args.memberData;
	});
	$scope.changeEmail = function () {
		var config = changeEmailConfig.formConf;
		var options = {
			form: config,
			'timeout': $timeout,
			'name': 'changeEmail',
			'label': translation.changeEmail[LANG],
			'actions': [
				{
					'type': 'submit',
					'label': translation.changeEmail[LANG],
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'email': formData.email
						};
						overlayLoading.show();
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"headers": {
								"key": apiConfiguration.key
							},
							"routeName": "/urac/account/changeEmail",
							"params": { "uId": $scope.memberData._id },
							"data": postData
						}, function (error) {
							overlayLoading.hide();
							if (error) {
								$scope.form.displayAlert('danger', error.code, true, 'urac', error.message);
							}
							else {
								$scope.$parent.displayAlert('success', translation.successMsgChangeEmail[LANG]);
								$scope.modalInstance.close();
								$scope.form.formData = {};
							}
						});
					}
				},
				{
					'type': 'reset',
					'label': translation.cancel[LANG],
					'btn': 'danger',
					'action': function () {
						$scope.modalInstance.dismiss('cancel');
						$scope.form.formData = {};
					}
				}
			]
		};
		buildFormWithModal($scope, $modal, options);
	};
	
	$scope.changePassword = function () {
		var config = changePwConfig.formConf;
		var options = {
			form: config,
			'timeout': $timeout,
			'name': 'changePassword',
			'label': translation.changePassword[LANG],
			'actions': [
				{
					'type': 'submit',
					'label': translation.changePassword[LANG],
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'password': formData.password,
							'oldPassword': formData.oldPassword,
							'confirmation': formData.confirmPassword
						};
						if (formData.password != formData.confirmPassword) {
							$scope.form.displayAlert('danger', translation.errorMessageChangePassword[LANG]);
							return;
						}
						overlayLoading.show();
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"headers": {
								"key": apiConfiguration.key
							},
							"routeName": "/urac/account/changePassword",
							"params": { "uId": $scope.memberData._id },
							"data": postData
						}, function (error) {
							overlayLoading.hide();
							if (error) {
								$scope.form.displayAlert('danger', error.code, true, 'urac', error.message);
							}
							else {
								$scope.$parent.displayAlert('success', translation.successMsgChangePassword[LANG]);
								$scope.modalInstance.close();
								$scope.form.formData = {};
							}
						});
					}
				},
				{
					'type': 'reset',
					'label': translation.cancel[LANG],
					'btn': 'danger',
					'action': function () {
						$scope.modalInstance.dismiss('cancel');
						$scope.form.formData = {};
					}
				}
			]
		};
		buildFormWithModal($scope, $modal, options);
	};
}]);

myAccountApp.controller('myAccountPortalCtrl', ['$scope', '$timeout', '$modal', 'ngDataApi', '$cookies', '$localStorage',
	function ($scope, $timeout, $modal, ngDataApi, $cookies, $localStorage) {
		$scope.$parent.isUserLoggedIn();
		var userCookie = $localStorage.soajs_user;
		
		var formConfig = {
			'timeout': $timeout,
			'name': 'editProfile',
			'label': translation.editProfile[LANG],
			'entries': [
				{
					'name': 'firstName',
					'label': translation.firstName[LANG],
					'type': 'text',
					'placeholder': translation.enterFirstName[LANG],
					'value': '',
					'tooltip': translation.enterFirstNameUser[LANG],
					'required': true
				},
				{
					'name': 'lastName',
					'label': translation.lastName[LANG],
					'type': 'text',
					'placeholder': translation.enterLastName[LANG],
					'value': '',
					'tooltip': translation.enterLastNameUser[LANG],
					'required': true
				},
				{
					'name': 'email',
					'label': translation.email[LANG],
					'type': 'readonly',
					'placeholder': translation.enterEmail[LANG],
					'value': '',
					'tooltip': translation.emailToolTip[LANG],
					'required': true
				},
				{
					'name': 'username',
					'label': translation.username[LANG],
					'type': 'text',
					'placeholder': translation.enterUsername[LANG],
					'value': '',
					'tooltip': translation.usernamesToolTip[LANG],
					'required': true
				},
				{
					'name': 'profile',
					'label': translation.profile[LANG],
					'type': 'jsoneditor',
					'options': {
						'mode': 'code',
						'availableModes': [{ 'v': 'code', 'l': 'Code View' }, {
							'v': 'tree',
							'l': 'Tree View'
						}, { 'v': 'form', 'l': 'Form View' }]
					},
					'height': '300px',
					"value": {},
					'required': false,
					'tooltip': translation.fillYourAdditionalProfileInformation[LANG]
				}
			],
			'data': {},
			'actions': [
				{
					'type': 'submit',
					'label': translation.editProfile[LANG],
					'btn': 'primary',
					'action': function (formData) {
						var profileObj = (formData.profile) ? formData.profile : {};
						
						var postData = {
							'username': formData.username,
							'firstName': formData.firstName,
							'lastName': formData.lastName,
							'profile': profileObj
						};
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"routeName": "/urac/account/editProfile",
							"headers": {
								"key": apiConfiguration.key
							},
							"params": { "uId": $scope.uId },
							"data": postData
						}, function (error) {
							if (error) {
								$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
							}
							else {
								$scope.$parent.displayAlert('success', translation.profileUpdatedSuccessfully[LANG]);
								userCookie.firstName = formData.firstName;
								userCookie.username = formData.username;
								userCookie.lastName = formData.lastName;
								userCookie.profile = profileObj;
								
								$localStorage.soajs_user = userCookie;
								$scope.$parent.$emit('refreshWelcome', {});
							}
						});
					}
				}
			],
			form: profileConfig.formConf
		};
		
		$scope.getProfile = function (username) {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"headers": {
					"key": apiConfiguration.key
				},
				"routeName": "/urac/account/getUser",
				"params": { "username": username }
			}, function (error, response) {
				if (error) {
					$scope.$parent.displayAlert("danger", error.code, true, 'urac', error.message);
				}
				else {
					$scope.uId = response._id;
					var p = response.profile;
					formConfig.data = response;
					formConfig.data.profile = p;
					buildForm($scope, null, formConfig);
					
					$scope.$parent.$emit('xferData', { 'memberData': response });
				}
			});
		};
		
		if ((typeof(userCookie) !== "undefined") && (typeof(userCookie) === "object")) {
			var uname = userCookie.username;
			$scope.getProfile(uname);
		}
		else {
			$scope.$parent.displayAlert("danger", translation.youNeedToLoginFirst[LANG]);
			$scope.$parent.go("/");
		}
		
	}]);

myAccountApp.controller('validatePortalCtrl', ['$scope', 'ngDataApi', '$route', 'isUserLoggedIn', function ($scope, ngDataApi, $route, isUserLoggedIn) {
	
	$scope.valiadteJoin = function () {
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/urac/join/validate",
			"params": { "token": $route.current.params.token }
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayAlert('danger', error.message);
			}
			else {
				$scope.$parent.displayAlert('success', 'Your Email was Validated Successfully. You can login now');
				$scope.$parent.go("/login");
			}
		});
	};
	
	$scope.validateChangeEmail = function () {
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/urac/changeEmail/validate",
			"params": { "token": $route.current.params.token }
		}, function (error) {
			if (error) {
				$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
			}
			else {
				$scope.$parent.displayAlert('success', translation.yourEmailValidatedChangedSuccessfully[LANG]);
				setTimeout(function () {
					$scope.$parent.go("/myaccount");
				}, 2000);
			}
		});
	};
	
	if ($route.current.originalPath === '/join/validate') {
		$scope.valiadteJoin();
	}
	else if ($route.current.originalPath === '/changeEmail/validate') {
		$scope.validateChangeEmail();
	}
}]);

myAccountApp.controller('loginPortalCtrl', ['$scope', 'ngDataApi', '$cookies', 'isUserLoggedIn', '$localStorage', function ($scope, ngDataApi, $cookies, isUserLoggedIn, $localStorage) {
	var formConfig = loginConfig.formConf;
	formConfig.actions = [{
		'type': 'submit',
		'label': translation.login[LANG],
		'btn': 'primary',
		'action': function (formData) {
			var postData = {
				'username': formData.username,
				'password': formData.password,
				'grant_type': "password"
			};
			overlayLoading.show();
			var authValue;
			
			function loginOauth() {
				var options1 = {
					"token": false,
					"method": "get",
					"routeName": "/oauth/authorization"
				};
				getSendDataFromServer($scope, ngDataApi, options1, function (error, response) {
					if (error) {
						overlayLoading.hide();
						$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
					}
					else {
						authValue = response.data;
						
						var options2 = {
							"method": "post",
							"routeName": "/oauth/token",
							"data": postData,
							"headers": {
								'accept': '*/*',
								"Authorization": authValue
							}
						};
						getSendDataFromServer($scope, ngDataApi, options2, function (error, response) {
							if (error) {
								overlayLoading.hide();
								$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
							}
							else {
								if (Object.hasOwnProperty.call(response, "access_token")) {
									$cookies.put('access_token', response.access_token, { 'domain': interfaceDomain });
									$cookies.put('refresh_token', response.refresh_token, { 'domain': interfaceDomain });
								}
								uracLogin();
							}
						});
						
					}
				});
			}
			
			loginOauth();
			
			function uracLogin() {
				var options = {
					"method": "get",
					"routeName": "/urac/account/getUser",
					"params": {
						'username': formData.username
					}
				};
				getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
					if (error) {
						overlayLoading.hide();
						ngDataApi.logoutUser($scope);
						$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
					}
					else {
						$localStorage.soajs_user = response;
						//get dashboard keys
						getKeys();
					}
				});
			}
			
			function getKeys() {
				getSendDataFromServer($scope, ngDataApi, {
					"method": "get",
					"routeName": "/key/permission/get",
					"params": { "main": false }
				}, function (error, response) {
					if (error) {
						overlayLoading.hide();
						ngDataApi.logoutUser($scope);
						$scope.$parent.displayAlert('danger', error.code, true, 'dashboard', error.message);
					}
					else {
						$cookies.put("soajs_dashboard_key", response.extKey, { 'domain': interfaceDomain });
						getPermissions();
					}
				});
			}
			
			function getPermissions() {
				getSendDataFromServer($scope, ngDataApi, {
					"method": "get",
					"routeName": "/key/permission/get"
				}, function (error, response) {
					overlayLoading.hide();
					if (error) {
						if(error.code === 600){
							$localStorage.soajs_user = null;
							$scope.$parent.displayAlert('danger', error.code, true, 'dashboard', "Login Failed !");
							ngDataApi.logoutUser($scope);
						}
						else {
							$scope.$parent.displayAlert('danger', error.code, true, 'dashboard', error.message);
						}
					}
					else {
						$localStorage.acl_access = response.acl;
						$localStorage.environments = response.environments;
						if (response.environments && response.environments[0]) {
							$cookies.putObject("myEnv", response.environments[0], { 'domain': interfaceDomain });
						}
						$scope.$parent.$emit("loadUserInterface", {});
						$scope.$parent.$emit('refreshWelcome', {});
					}
				});
			}
		}
	}];
	
	if (!isUserLoggedIn($scope)) {
		buildForm($scope, null, formConfig);
	}
	else {
		//$scope.$parent.displayAlert('danger', translation.youAreAlreadyLoggedIn[LANG]);
		var gotoUrl = $scope.$parent.mainMenu.links[0].entries[0].url.replace("#", "");
		$scope.$parent.go(gotoUrl);
	}
	
}]);

myAccountApp.controller('forgotPwPortalCtrl', ['$scope', 'ngDataApi', 'isUserLoggedIn', function ($scope, ngDataApi, isUserLoggedIn) {
	var formConfig = forgetPwConfig.formConf;
	formConfig.actions = [{
		'type': 'submit',
		'label': translation.submit[LANG],
		'btn': 'primary',
		'action': function (formData) {
			var postData = {
				'username': formData.username
			};
			overlayLoading.show();
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/forgotPassword",
				"params": postData
			}, function (error) {
				overlayLoading.hide();
				if (error) {
					$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
				}
				else {
					$scope.$parent.displayAlert('success', translation.resetLinkSentYourEmailAddress[LANG]);
					$scope.$parent.go("/login");
				}
			});
		}
	}];
	
	if (!isUserLoggedIn($scope)) {
		buildForm($scope, null, formConfig);
	}
	else {
		$scope.$parent.displayAlert('danger', translation.youAlreadyLoggedInLogOutFirst[LANG]);
		$scope.$parent.go($scope.$parent.mainMenu.links[0].url.replace("#", ""));
	}
}]);

myAccountApp.controller('setPasswordPortalCtrl', ['$scope', 'ngDataApi', '$routeParams', 'isUserLoggedIn', function ($scope, ngDataApi, $routeParams, isUserLoggedIn) {
	var formConfig = setPasswordConfig.formConf;
	formConfig.actions = [{
		'type': 'submit',
		'label': translation.submit[LANG],
		'btn': 'primary',
		'action': function (formData) {
			var postData = {
				'password': formData.password, 'confirmation': formData.confirmPassword
			};
			if (formData.password != formData.confirmPassword) {
				$scope.$parent.displayAlert('danger', translation.errorMessageChangePassword[LANG]);
				return;
			}
			getSendDataFromServer($scope, ngDataApi, {
				"method": "send",
				"headers": {
					"key": apiConfiguration.key
				},
				"routeName": "/urac/resetPassword",
				"params": { "token": $routeParams.token },
				"data": postData
			}, function (error) {
				if (error) {
					$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
				}
				else {
					$scope.$parent.displayAlert('success', translation.passwordSetSuccessfully[LANG]);
					$scope.$parent.go("/login");
				}
			});
		}
	}];
	
	if (!isUserLoggedIn($scope)) {
		buildForm($scope, null, formConfig);
	}
	else {
		$scope.$parent.displayAlert('danger', translation.youAlreadyLoggedInLogOutFirst[LANG]);
		var url = $scope.$parent.mainMenu.links[0].entries[0].url;
		$scope.$parent.go(url.replace("#", ""));
	}
}]);

myAccountApp.controller('resetPwPortalCtrl', ['$scope', 'ngDataApi', '$routeParams', 'isUserLoggedIn', function ($scope, ngDataApi, $routeParams, isUserLoggedIn) {
	var formConfig = resetPwConfig.formConf;
	formConfig.actions = [{
		'type': 'submit',
		'label': translation.submit[LANG],
		'btn': 'primary',
		'action': function (formData) {
			var postData = {
				'password': formData.password, 'confirmation': formData.confirmPassword
			};
			if (formData.password != formData.confirmPassword) {
				$scope.$parent.displayAlert('danger', translation.passwordConfirmFieldsNotMatch[LANG]);
				return;
			}
			getSendDataFromServer($scope, ngDataApi, {
				"method": "send",
				"routeName": "/urac/resetPassword",
				"params": { "token": $routeParams.token },
				"data": postData
			}, function (error) {
				if (error) {
					$scope.$parent.displayAlert('danger', error.code, true, 'urac', error.message);
				}
				else {
					$scope.$parent.displayAlert('success', translation.yourPasswordReset[LANG]);
					$scope.$parent.go("/login");
				}
			});
		}
	}];
	
	if (!isUserLoggedIn($scope)) {
		buildForm($scope, null, formConfig);
	}
	else {
		$scope.$parent.displayAlert('danger', translation.youAlreadyLoggedInLogOutFirst[LANG]);
		$scope.$parent.go($scope.$parent.mainMenu.links[0].entries[0].url.replace("#", ""));
	}
}]);

myAccountApp.controller('registerPortalCtrl', ['$scope', 'ngDataApi', 'isUserLoggedIn', function ($scope, ngDataApi, isUserLoggedIn) {
	
	var formConfig = registerConfig.formConf;
	
	formConfig.actions = [
		{
			'type': 'submit',
			'label': translation.submit[LANG],
			'btn': 'primary',
			'action': function (formData) {
				if (formData.password != formData.confirmPassword) {
					$scope.$parent.displayAlert('danger', 'Your password and confirm password fields do not match!');
					return;
				}
				var postData = {
					'username': formData.username,
					'firstName': formData.firstName,
					'lastName': formData.lastName,
					'email': formData.email,
					'password': formData.password
				};
				getSendDataFromServer($scope, ngDataApi, {
					"method": "send",
					"routeName": "/urac/join",
					"data": postData
				}, function (error, response) {
					if (error) {
						$scope.$parent.displayAlert('danger', error.message);
					}
					else {
						$scope.$parent.displayAlert('success', 'Profile Created Successfully. We will send a link to valiadte your email address. Please check your Email');
						$scope.$parent.go("/login");
					}
				});
			}
		}
	];
	
	if (!isUserLoggedIn($scope)) {
		buildForm($scope, null, formConfig);
	}
	else {
		$scope.$parent.displayAlert('danger', 'You are already logged in. Log out first');
		$scope.$parent.go("/dashboard");
	}
}]);