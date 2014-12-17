//STICKY NAV THAT DOESN'T SUCK
jQuery.fn.extend({
    sticky: function() {
        var offsetTop = $(this).offset().top;
        var offsetLeft = $(this).offset().left;
        var width = $(this).width();
        var position = $(window).scrollTop();
        var el = $(this)
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > offsetTop) {
                el.attr('style', 'position:fixed;top:0px;left:' + offsetLeft + 'px;width:' + width + 'px');
            } else {
                el.attr('style', '');
            }
        });
    }
});
//SHOWY
//show title on scroll
var showy = function(){
    $(window).on('scroll', function() {
        if($(window).scrollTop() > 10){
            $('.device-menu').addClass('scrolling');
        }
        else{
            $('.device-menu').removeClass('scrolling');
        }
    });
}
//DELAY
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
//SET STICKIES
var setStickies = function(){
    if($(window).width() < 990){
        $('nav').sticky();
        showy();
    }
    else{
        $(window).off('scroll');
    }
};