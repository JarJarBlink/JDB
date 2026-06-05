//Exodia JAR

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

	$(window).scroll(function () {
		var scrollTop = $(this).scrollTop();
		var windowH = $(window).height();
		var docH = $(document).height();

		if (!$('#pagetop').attr("class")) {
			if (scrollTop + windowH >= docH - 200) {
				$('#pagetop').addClass("move_up01");
			}
		}
	});
});