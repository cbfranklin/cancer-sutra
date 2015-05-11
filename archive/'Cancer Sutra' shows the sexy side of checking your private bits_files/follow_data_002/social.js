var Social = function() {

	var version = "0.1";
	var user = null;
	var startActions = {};
	var authActions = {};
	var I_AM_ALIVE_URL_PREFIX = "https://social.meerkatapp.co/users/i-am-alive?v=";
	var ready = false;
	this.init = function () {

		if (typeof(localStorage.myUser) != typeof(nothing)) {
			this.user = new User(JSON.parse(localStorage.myUser));
			if (typeof(localStorage.followingIds) != typeof(nothing) && localStorage.followingIds != "") {
				this.following = JSON.parse(localStorage.followingIds);
			}
		}
		if (this.user == null) {
			Twitter.loadCredentials();

			if (Twitter.hasToken()) {
				this.IAmAlive(function () {
					Social.login(function (user) {
						Twitter.clearSignCookies();
						Social.ready = true;
					});
				});
			} else {
				this.ready = true;
			}
		} else {
			this.ready = true;
		}
		this.setMixpanelPeople();
	};

	this.setMixpanelPeople = function (){
		$(document).ready(function() {
			if(typeof Social.user !== "undefined") {
				mixpanel.register({
											"user_id": Social.user.id,
											"twitter_id": Social.user.twitterId,
											"handle": Social.user.username,
											"username": Social.user.username,
											"name": Social.user.displayName,
											"platform": "web" })
				mixpanel.people.set({
											"user_id": Social.user.id,
											"twitter_id": Social.user.twitterId,
											"username": Social.user.username,
											"handle": Social.user.username,
											"name": Social.user.displayName,
											"platform": "web" });
				mixpanel.identify(Social.user.id)
			}
		});

	};

	this.IAmAlive = function (done) {
		$.get(I_AM_ALIVE_URL_PREFIX+version, {}, function(json) {
			var response = new Response(json);
			Social.startActions = new StartActions(response.getFollowUpActions());
			done(startActions);
			return false;
		},'json');
	};

	this.login = function (done) {

		if (typeof(localStorage.myUser) != typeof(nothing)) {

			Social.user = new User(JSON.parse(localStorage.myUser));
			if (typeof(localStorage.followingIds) != typeof(nothing) && localStorage.followingIds != "") {
				Social.following = JSON.parse(localStorage.followingIds);
			}
			this.auth(Social.user.rawJson,done);
			return;
		}

		Twitter.loadCredentials()

		Social.startActions.meerkatSignIn(Twitter.credentials.id,Twitter.credentials.token,Twitter.credentials.tokenSecret, function (response) {

			if (response.status == 422) {
	    		Social.signUp(done);
	    	} else if (typeof(response.followupActions) != typeof(nothing)) {
	    		Social.auth(response,function (user) {
	    			done(user);
	    		});
	    	} else {
	    		console.log(response);
	    	}
		});
	};

	this.signUp = function (done) {



		Social.startActions.meerkatSignUp(Twitter.credentials.id,Twitter.credentials.token,Twitter.credentials.tokenSecret,Twitter.credentials.username, Twitter.bio, Twitter.fullname,function(response){

			Social.auth(response,function (user) {

				mixpanel.track("sign up", { "handle": Social.user.username, "username": Social.user.username, platform: "web", "user_id": Social.user.id, "twitter_id": Social.user.twitterId });

				Social.user.actions.uploadProfileImage(Twitter.profileImageUrl);
    		done(user);

//     			if (typeof(localStorage.twitterFriends) != typeof(nothing)) {
//     				var twitterFriends = JSON.parse(localStorage.twitterFriends);
//     				self.user.actions.sendTwitterSignupFriends(twitterFriends,function(response){});
//     			}

    		});
		});
	};

	this.auth = function(authActionsJson,done) {

		if (typeof(authActionsJson.followupActions) != typeof(nothing)) {
			Social.authActions = new FollowUpActions(authActionsJson.followupActions);
			Social.authActions.performAcion("authorize", "PUT", {"notificationId": "web_"+Twitter.credentials.id, "version": "web"}, "json", function (userJson) {
				Social.user = new User(userJson);
				Social.user.store();
				done(Social.user);
			});
		}

	};

	this.hasUser = function() {
		if (Social.user != null) {
			return true;
		}
		return false;
	};

	this.retweet = function(favorite_url) {
		$.ajax("/stream/retweet", {
			method: "POST",
			data: {tweet_id: tweetId, broadcast_id: broadcastId},
			dataType: "json",
			error: function(error) {
				console.log("Error in updating retweet " + error)
			},
			success: function(data) {
				console.log("Retweet update: Success")
			}
		})
	}

	this.subscribe = function(tweetId, broadcastId) {
		$.ajax("/stream/subscriptions", {
			method: "POST",
			data: {tweet_id: tweetId, broadcast_id: broadcastId},
			dataType: "json",
			success: function(data) {
				console.log("Retweet update: Success")
			}
		})
	}

	this.unsubscribe = function(tweetId, broadcastId) {
		$.ajax("/stream/subscriptions/" + tweetId, {
			method: "DELETE",
			data: { broadcast_id: broadcastId },
			dataType: "json",
			success: function(data) {
				console.log("Retweet update: Success")
			}
		})
	}

	this.restreamBroadcast = function (streamObj) {

		if (streamObj != undefined) {
			var authToken = Social.user.authToken;
			var likeUrl = streamObj.followupActions.likes + "?auth="+ authToken;

			$.post(likeUrl,{},function (response) {},'json');

		}

	}
	this.init();

	return this;
};
var User = function(json) {

	this.rawJson = json;
	this.id = json.result.user.id;
	this.displayName = json.result.user.displayName;
	this.username = json.result.user.username;
	this.twitterId = json.result.user.twitterId;

	this.authToken = json.result.auth;
	this.actions = new UserActions(json.followupActions);
	this.profileImage = this.actions.getProfileImageUrl();

	this.store = function() {
		localStorage.myUser = JSON.stringify(this.rawJson);
	};

	return this;

};

var Response = function(json) {

	var self = json;

	self.actions = new FollowUpActions(self.followupActions);

	self.getResult = function() {
		return self.result;
	};

	self.getFollowUpActions = function() {
		return self.actions;
	};

	return self;
};

function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

var StartActions = function(json) {

	var SIGN_IN = "signIn";
	var SIGN_UP = "signUp";

	var self = new FollowUpActions(json);

	self.meerkatSignIn = function(twitterId,oauth_token,oauth_secret, done) {

		var twitterCredentials = {id:twitterId, token:oauth_token,tokenSecret: "testtesttest"};
		if (Twitter.credentials.origin == "facebook") {
			var params = {facebookSignin: twitterCredentials};
		} else {
			var params = {twitterSignin: twitterCredentials};
		}
		self.performJsonAction(SIGN_IN,"PUT",params,function (response) {
			done(response);
		});
		return false;
	};

	self.meerkatSignUp = function(twitterId,oauth_token,oauth_secret, username, bio, fullname, done) {
		var twitterAuth = {id:twitterId, token:oauth_token,tokenSecret:oauth_secret, bio: bio, website:"", fullname:fullname};
		if (Twitter.credentials.origin == "facebook") {
			var params = {email: "", deviceId:"", username: username,facebookAuth: twitterAuth};
		} else {
			var params = {email: "", deviceId:"", username: username,twitterAuth: twitterAuth};
		}
		self.performJsonAction(SIGN_UP,"POST",params,function (response) {
			done(response);
		});
	};

	return self;

};

var UserActions = function(json) {

	var AUTH = 						"authorize";
	var PROFILE_IMAGE = 			"profileImage";
	var PROFILE = 					"profile";
	var PROFILE_TEMPLATE = 			"profileTemplate";
	var UPDATE_IMAGE = 				"updateImage";
	var TWITTER_FRIENDS = 			"twitterFriends";
	var TWITTER_FRIENDS_SIGNUP = 	"twitterFriendsSignUp";
	var SIGN_OUT = 					"signOut";
	var ADD_WATCHER = 				"addWatcherTemplate";
	var REMOVE_WATCHER = 	    "/watchers/"
	var SOCIAL_MAIN_URL = 			"https://social.meerkatapp.co/"
	var FOLLOWERS_SUFFIX = 			"/followers"
	var FOLLOWING_SUFFIX = 			"/following"
	var USERS_ENDPOINT = 			"users/"

	var self = new FollowUpActions(json);


	self.getProfileImageUrl = function () {
		return this.getAction(PROFILE_IMAGE);
	};

	self.sendTwitterSignupFriends = function (friends, done) {

		var twitterLinks = {platform:"twitter", name:"",action:"follow", linkTo: friends};
		self.performJsonAction(TWITTER_FRIENDS_SIGNUP,"POST",twitterLinks,function (response) {
			done(response);
		});

	};

	self.uploadProfileImage = function (imagePath) {
		Twitter.loadCredentials()
		jQuery.ajax ({
		    url: "/photos/",
		    type: "POST",
		    data: {"imageURL":Twitter.profileImageUrl,userUploadEndpoint: self.getAction(UPDATE_IMAGE)},
		    success: function (response) {
//		    	console.log(response);
		    },
		    error: function (error) {
//		    	console.log(error);
		    }
		});

	}
	self.following = null;
	self.followingList = null;

	self.getFollowing = function (userId, auth,done) {
		if (self.following == null) {
			if (typeof(localStorage.followingIds) == typeof(nothing) || localStorage.followingIds == "") {
				var followingURL = SOCIAL_MAIN_URL+USERS_ENDPOINT+userId+FOLLOWING_SUFFIX+"?v=1&auth="+auth;
				self.performActionFromReadyUrl(followingURL,"GET",{},function (response) {
					self.followingList = response.result;
					self.following = [];
					for (index in self.followingList) {
						self.following.push(self.followingList[index].id);
					}
					localStorage.followingIds = JSON.stringify(self.following);
					done(self.following);
				});
			} else {
				self.following = JSON.parse(localStorage.followingIds)
				done(self.following);

			}

		} else {
			done(self.following);
		}


	}

	self.followUser = function (userId, auth, done) {


		var followURL = SOCIAL_MAIN_URL+USERS_ENDPOINT+userId+FOLLOWERS_SUFFIX+"?v=1&auth="+auth;
		mixpanel.track("follow", { "follower id": userId });
		self.performActionFromReadyUrl(followURL,"POST",{"mute":false},function (response) {

/*
			if (self.following != null) {
				self.following.push(userId);
				localStorage.followingIds = JSON.stringify(self.following);
			}
*/
			localStorage.followingIds = ""; //invalidation sort of;
			done(response);
		});

	}


	self.unFollowUser = function (userId, auth, done) {


		var followURL = SOCIAL_MAIN_URL+USERS_ENDPOINT+userId+FOLLOWERS_SUFFIX+"?v=1&auth="+auth;
		mixpanel.track("unfollow", { "follower id": userId });
		self.performActionFromReadyUrl(followURL,"DELETE",{"mute":false},function (response) {

			localStorage.followingIds = ""; //invalidation sort of;
			done(response);

		});

	}
	self.addWatcherForBroadcast = function (broadcastId, authToken) {

		var responseObject = {}
		var action = self.getAction(ADD_WATCHER).replace("{broadcastId}",broadcastId);
		$.ajax({
		  type: "POST",
		  url: action,
		  data: {},
			async: false,
		  success: function (response) {
				responseObject = response;
			}
		});

		return responseObject;
	};

	self.removeWatcherForBroadcast = function (broadcastId, authToken) {

		jQuery.ajax ({
				url: "/watchers/" + broadcastId + "/" + authToken + "?unwatchURL=" + escape(self.getAction(ADD_WATCHER).replace("{broadcastId}", broadcastId)),
				data: {},
				crossDomain: true,
				type: "DELETE",
				async: false,
				success: function (response) {
	//		    	console.log(response);
				},
				error: function (error, message, bla) {
			    	console.log(bla);
				}
		});

	};


	return self;

};
var FollowUpActions = function(json) {

	var self = json;

	self.hasAction = function (action) {
		if (typeof(self[action]) != typeof(nothing)) {
			return true;
		}
		return false;
	};

	self.getAction = function (action) {
		if (typeof(self[action]) != typeof(nothing)) {
			return self[action];
		} else {
			return false;
		}
	};

	self.performActionFromReadyUrl = function(url,method,params,done) {
		jQuery.ajax ({
		    url: url,
		    type: method,
		    data: params,
		    dataType: "json",
		    success: done,
		    error: done
		});
	}

	self.performAcion = function(action, method, jsonParams, dataType, done) {
		//Use Default xx-form-url-encoded somthing parameters serialization
		if (self.hasAction(action)) {
			var actionURL = self.getAction(action);
			jQuery.ajax ({
			    url: actionURL,
			    type: method,
			    data: jsonParams,
			    dataType: dataType,
			    success: done,
			    error: done
			});
		} else {
//			console.log("action "+action+" not found");
//			console.log(self);
		}
	};

	self.performJsonAction = function(action, method, jsonParams, done) {
		//Use Json serialization (serializes as string)
		if (self.hasAction(action)) {
			var actionURL = self.getAction(action);
			jQuery.ajax ({
			    url: actionURL,
			    type: method,
			    data: JSON.stringify(jsonParams),
			    dataType: "json",
			    contentType: "application/json",
			    success: done,
			    error: done
			});
		}
	};

	return self;
};
var Social = new Social();
