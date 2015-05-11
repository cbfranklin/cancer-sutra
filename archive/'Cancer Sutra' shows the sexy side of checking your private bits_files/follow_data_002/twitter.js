var Twitter = function() {

	var API_ROOT = "https://api.twitter.com/1.1/";
	var AUTH_DOMAIN = "";
	//NO APP KEYS ON CLIENT!
	this.credentials = {};
	this.twitterFriends = {};
	this.profileImageUrl = "";
	this.bio = "";
	this.fullname = "";
	this.login = function(gobackURL) {

		var container = (window.location != window.parent.location) ? document.referrer: document.location;

		// var auth_redirect = getCookie("auth_redirect")
		//
		// if(typeof auth_redirect !== "undefined") {
		// 	delete_cookie("auth_redirect")
		// 	window.top.location.href = auth_redirect
		// } else {

			if($("base").length > 0) {
				var loginURL = "/twitter/connect?ref="+gobackURL+ "&source=" + $("body").data("source") + "&type=iframe&back_to=" + container;
				window.location.href = loginURL, "_blank"

			} else {
				var loginURL = "/twitter/connect?ref="+gobackURL+ "&source=" + $("body").data("source")
				window.location = loginURL;
			}
		// }
		return false;
	};

	this.loadCredentials = function () {

		if(getCookie("oauth_source") == "facebook") {
			this.loadFacebookCredentials()
		} else {
			var login_source = getCookie("LOGIN_SOURCE")

			var oauth_token = getCookie("oauth_token");
			var oauth_token_secret = getCookie("oauth_token_secret");
			var user_id = getCookie("twitter_user_id");
			var username = decodeURI(getCookie("username")).replace("+", " ");
			this.fullname = decodeURI(getCookie("fullname")).replace("+", " ");


			this.profileImageUrl = decodeURIComponent(getCookie("profile_image"));
			this.bio = decodeURI(getCookie("bio")).replace("+", " ");

			if (login_source != "") {
				if(typeof variable !== 'undefined'){
					mixpanel.people.set({
						"signup_webpage": login_source
					});
					mixpanel.identify(user_id)
				}
				delete_cookie("LOGIN_SOURCE");
			}
			if (typeof(this.fullname) != typeof(nothing)) {
				this.fullname = this.fullname.split("+").join(" ");
			}
			if (typeof(this.bio) != typeof(nothing)) {
				this.bio = this.bio.split("+").join(" ");
			}
			this.credentials = new Credentials(user_id, username, oauth_token, oauth_token_secret);
		}
// 		var twitterFriendsCookie = getCookie("twitter_friends");
// 		if (typeof(localStorage.twitterFriends) != typeof(nothing)) {
// 			this.twitterFriends = JSON.parse(localStorage.twitterFriends);
// 		} else if (typeof(twitterFriendsCookie) != typeof(nothing) && twitterFriendsCookie.length > 0) {
// 			this.twitterFriends = JSON.parse(decodeURIComponent(twitterFriendsCookie));
// 			localStorage.twitterFriends = JSON.stringify(this.twitterFriends);
// 		}

	};

	this.loadFacebookCredentials = function () {
		var oauth_token = getCookie("oauth_token");
		var oauth_token_secret = getCookie("oauth_token_secret");
		var user_id = getCookie("facebook_user_id");

		this.fullname = decodeURI(getCookie("fullname")).replace("+", " ");
		var username = this.fullname.replace(" ", "").toLowerCase() + user_id.slice(-7);
		this.profileImageUrl = decodeURIComponent(getCookie("profile_image"));
		this.bio = decodeURI(getCookie("bio")).replace("+", " ");

		if (typeof(this.fullname) != typeof(nothing)) {
			this.fullname = this.fullname.split("+").join(" ");
		}
		if (typeof(this.bio) != typeof(nothing)) {
			this.bio = this.bio.split("+").join(" ");
		}
		this.credentials = new Credentials(user_id, username, oauth_token, oauth_token_secret);
		this.credentials.origin = "facebook";
	}

	this.clearSignCookies = function () {

		delete_cookie("oauth_token");
		delete_cookie("oauth_token_secret");
		delete_cookie("twitter_profile_image");
		delete_cookie("profile_image");
		delete_cookie("username");
		delete_cookie("twitter_user_id");
		delete_cookie("facebook_user_id");
		delete_cookie("fullname");
		delete_cookie("temp_oauth_token");
		delete_cookie("temp_oauth_token_secret");

	}
	this.hasToken = function() {
		return typeof(this.credentials.token) != typeof(nothing);
	};
	return this;
};

var Credentials = function(twitterId,username,access_token, access_token_secret) {

	this.id = twitterId;
	this.username = username;
	this.token = access_token;
	this.tokenSecret = access_token_secret;
	this.origin = "twitter"

	this.toJson = function () {
		return {id:this.twitterId,token:this.token,tokenSecrect:this.tokenSecret, username: username};
	};

	return this;

};



function delete_cookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();

	}
}
var Twitter = new Twitter();
