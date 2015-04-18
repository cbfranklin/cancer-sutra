TODO
=====

TUMBLR/TWITTER/FACEBOOK BUTTONS:92101
-tumblr is direct JS (cool)
-facebook and twitter use OG
(1h)

INFO IN GOOGLE KEEP:
- nodejs backend for handling #/position/x requests if fb/tw bot
- nginx to replace apache and steer appropriate bot traffic to nodejs...maybe i can just use apache
- need to turn positions.js into valid json...could use separate positions.json since it's server-side
(3h)

POSTFIX FOR EMAIL FORWARDING AND SHARING (yikes). this is going to be interesting.
-OK, maybe nodemailer with amazon SES as the platform (SES allows 62k emails for free, up to 15GB)
(2h)



IE
-NEED TO DOWNLOAD MACHINE OR TWO FROM MODERN.IE::TONIGHT ON HOTEL WIFI!!
-IE9/10/11 tests
-get svg imgs to scale in IE9: http://stackoverflow.com/questions/9777143/svg-in-img-element-proportions-not-respected-in-ie9
	https://gist.github.com/larrybotha/7881691
	http://davidwalsh.name/svg-animation
-what other Modernizr tests do i need? [svg,position:fixed,history,nojs?] hopefully none.
(2h)



-FONTS >> figure out typekit OR rip them from somewhere
 proxima nova light for all buttons
(0.5h)

ADDITIONAL SUPPORT CTA FOR ALL POSITIONS PAGE
(0.2h)

NEW SUPPORT/EBOOK PAGE: fix stickiness
(0.5h)

FIX ALL POSITIONS NAV BUG
(0.2h)

CLEANUP AND LAUNCH:

compression, concatenation: 0.5h
deployment: 0.2h

and then theres the whole thing where i wont actually be available most of the time over the next 5-7 days...scary.

this is more than just a website, it's a social media campaign

-site support or changes post launch
-tech concerns with social media
-server scaling