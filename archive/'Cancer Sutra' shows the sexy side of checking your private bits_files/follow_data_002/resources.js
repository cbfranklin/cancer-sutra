var API_URL = "https://resources.meerkatapp.co/";

var Resources = function () {

	var self = this;//for inner use

	this.getBroadcast = function(id,done) {

		if (id.indexOf("-") != -1) {
			$.get(API_URL+"broadcasts/"+id+"/summary",{},function(broadcastSummary) {
				done(broadcastSummary);
			},'json');
		}

	};

	this.getSchedule = function(id,done) {

		if (id.indexOf("-") != -1) {
			if (id.indexOf("sch-") != -1) { id = id.replace("sch-",""); }
				$.get(API_URL+"schedules/"+id+"/summary",{},function(scheduleRaw) {
					var schedule = Resources.parseTextToJson(scheduleRaw);
					//var schedule = JSON.parse(scheduleRaw)
					done(schedule);
				},'text');

		}
	};

	this.parseTextToJson = function (text) {
		//hack for http://stackoverflow.com/questions/15689790/parse-json-in-javascript-long-numbers-get-rounded
		var toMatch = '"tweetId":';
		if (text.indexOf('"tweetId":0') != -1 || text.indexOf(toMatch) == -1) {
			return JSON.parse(text);
		}
		var toMatch = '"tweetId":';
		var tweetIdLocation = text.indexOf(toMatch) + toMatch.length;
		helper = text.substring(tweetIdLocation, text.length);
		var indexOfNextDelimiter = helper.indexOf(",");
		if (helper.indexOf("}") != -1 && helper.indexOf("}") < indexOfNextDelimiter) {
			indexOfNextDelimiter = helper.indexOf("}");
		}
		tweetId = helper.substring(0, indexOfNextDelimiter);
		text = text.replace(tweetId,'"'+tweetId+'"');
		var json = JSON.parse(text);
		return json;
	};

	this.getUserLiveBroadcast = function (userId,done) {
		$.get(API_URL+"broadcasts?v=web",{}, function (liveList) {
			var broadcastSource = self.getLiveBroadcastForUser(liveList,userId);
			if (broadcastSource != null) {
				done(true,broadcastSource);
			} else {
				done(false,null);
			}
		},'json');
	};

	this.getUserbyId = function (userId, done) {
		$.get(API_URL+"users/"+userId+"/profile?v=web",{}, function (user) {
			done(user);
		},'json');

	};

	this.getLiveBroadcastForUser = function(liveList, userId) {
		var broadcastSource = null;
		for (var index in liveList.result) {
			var influencers = liveList.result[index].influencers;
			for (var jindex in influencers) {
				var influencer = influencers[jindex];
				var influencerValues = influencer.split(":");
				if (influencerValues[0] == "b" && influencerValues[1] == userId) {
					broadcastSource = liveList.result[index];
					break;
				}
			}
		}
		return broadcastSource;
	};

	this.getUserIdByName = function(name, done) {
		var searchURL = "https://resources.meerkatapp.co/users/search?v=0.1";
		var actions = new FollowUpActions({"search":searchURL});
		actions.performJsonAction("search", "PUT", {"username":name}, function (response) {
			if (typeof(response.result) != typeof(nothing) && typeof(response.result[0]) != typeof(nothing)) {
				done(response.result[0]);
			} else {
				done(null);
			}

		});
	};

	return this;
};
var Resources = new Resources();
