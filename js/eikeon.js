(function($) {
    var body = $('body');

    $('.nav-toggle').on('click', function() {
	body
            .removeClass('loading')
            .toggleClass('nav-open');
    });
 
    $('.wrapper').find('[role="main"]').on('click', function(e) {
	if ( body.hasClass('nav-open') ) {
            body
		.removeClass('nav-open')
		.blur();
            e.preventDefault();     
	}
    });
})(jQuery);    
    
(function($) {
    function initPage() {
        $('ul.nav > li > a[href="' + document.location.pathname + '"]').parent().addClass('active');
        $('a').tooltip();
    }
    $(initPage);

})(jQuery);

window.fbAsyncInit = function() {
    FB.init({
        appId      : '255665227781659', // App ID
        //channelUrl : '//www.eikeon.com/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    // Additional initialization code here

};

// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));
