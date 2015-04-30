var Templates = function () {
	this.loadTemplate = function (name, done) {
		$.get("/assets/templates/"+name+".html",{},function (html) {
			done(html);
			return false;
		});
	};
};
var Templates = new Templates();

var FollowButton = function () {

	var userId = null;

	this.init = function (username) {

	};

	this.updateState = function () {

		if (Social.ready) {
			if (Social.user == null) {
				FollowButton.setStateNotFollowing();
			} else {

				if (FollowButton.userId  == Social.user.id) {
					FollowButton.thisIsMyPageFunctionality();
				} else {
					Social.user.actions.getFollowing(Social.user.id, Social.user.authToken, function (followingList) {

						if ( $.inArray(FollowButton.userId ,followingList) == -1) {
							if (typeof(localStorage.followId) != typeof(nothing) && localStorage.followId != "") {
								localStorage.followId = "";
								Social.user.actions.followUser(FollowButton.userId , Social.user.authToken,function (response) {
									FollowButton.setStateFollowing();
								});
							} else {
								FollowButton.setStateNotFollowing();
							}
						} else {
							FollowButton.setStateFollowing();
						}
					});
				}
			}
		} else {
			setTimeout(function() {
				FollowButton.updateState();
			},1000);
		}

	};

	this.setStateFollowing = function() {
		console.log("button: following")
		$("#follow-text").html("Following")
		$("#follow-button").unbind("click");
		$("#following").fadeIn('fast');
		$("#follow").hide();
		var followingText = $("#follow-button.embeded span").text().replace("Follow", "Following")
		$("#follow-button.embeded span").text(followingText)

		$("#follow-button").on("click", function(e){
			e.preventDefault();
			console.log("Unfollowing")
			FollowButton.finishUnFollowing();
		});
	};

	this.thisIsMyPageFunctionality = function() {
		console.log("button: my page")
		$("#follow").hide();
		$("#following").hide();
		$("#follow-button").unbind("click");

	};

	this.setStateNotFollowing = function() {
		console.log("button: not following")

		$("#follow-text").html("Follow me on Meerkat")
		$("#follow").show();
		$("#following").hide();
		// Embeded Follow button text
		var followingText = $("#follow-button.embeded span").text().replace("Following", "Follow")
		$("#follow-button.embeded span").text(followingText)

		$("#follow-button").on("click", function (e) {
			e.preventDefault();

			if (Social.user != null) {
				FollowButton.finishFollowing();
			} else {
				localStorage.followId = FollowButton.userId;
				Twitter.login();
			}
		});

	};

	this.finishFollowing = function() {

		if (Social.user != null) {
			Social.user.actions.getFollowing(Social.user.id, Social.user.authToken, function (followingList) {
				if (FollowButton.userId  == Social.user.id) {
					FollowButton.thisIsMyPageFunctionality();
				} else if ( $.inArray(FollowButton.userId ,followingList) == -1) {
					Social.user.actions.followUser(FollowButton.userId , Social.user.authToken,function (response) {
						FollowButton.setStateFollowing();
					});
				} else {
					FollowButton.setStateFollowing();
				}
			});
		}

	};


	this.finishUnFollowing = function() {

		if (Social.user != null) {
			Social.user.actions.getFollowing(Social.user.id, Social.user.authToken, function (followingList) {
				if (FollowButton.userId  == Social.user.id) {
					FollowButton.thisIsMyPageFunctionality();
				} else if ( $.inArray(FollowButton.userId ,followingList) != -1) {
					Social.user.actions.unFollowUser(FollowButton.userId , Social.user.authToken,function (response) {
						FollowButton.setStateNotFollowing();
					});
				} else {
					FollowButton.setStateNotFollowing();
				}
			});
		}

	};
};

/*
var SignInAction = function (action) {

	var action = null;

	this.run = function () {
		if (this.action != null) {
			this.action();
		}
	}

};
*/
