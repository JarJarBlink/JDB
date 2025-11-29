$(function (){

	
	$(".scl_top").click(function(){
		$("html,body").stop().animate({scrollTop:0},{duration:800,easing:'swing'});
		return false;
	});
	

	$('#pagetop a').click(function () {
		
		
		$('#pagetop').addClass("move_fly01");
		$('body,html').stop().animate({scrollTop:0},800,'swing', function(){
			$('#pagetop').removeClass();
		});0
		
		return false;
	});
	
	
	window.addEventListener("load", function(){
		var page_h = $(document).height();
		var window_h = $(window).height();

		//console.log("page_h: " + page_h);
		//console.log("window_h: " + window_h);
		//console.log("h: " + (page_h - window_h));
		//console.log("top: " + top);
		
		$(window).resize(function(){
			page_h = $(document).height();
			window_h = $(window).height();
		});


		$(window).scroll(function () {
			
			if(!$('#pagetop').attr("class")){
				if ($(this).scrollTop() >= page_h - window_h -100) {
					$('#pagetop').addClass("move_up01");
				}
			}
			
		});

	});//addEventListener("load", function()
	
	
	
});