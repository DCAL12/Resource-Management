var config = require('../config');

exports.setCookieMaxAge = function(session) {
	if (session) {
		session.cookie.maxAge = daysToMilliseconds(config.siteInfo.cookieMaxAgeDays);	
	}
	
	function daysToMilliseconds(days) {
		// milliseconds = days * 24hrs * 60min * 60sec * 1000
		return days * 24 * 60 * 60 * 1000;	
	}
};

