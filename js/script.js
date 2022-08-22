
$(document).ready(function() {



    $('.menu_top a[href*="#"]').anchor({
        transitionDuration : 1200
    });



    $(".menu_top .burger.on").click(function(){
        $(".menu_top .burger.on").hide();
        $(".menu_top .burger.of").show();
        $(".menu_left").animate({left: "0px"}, 300);
    });


    $(".menu_top .burger.of").click(function(){
        $(".menu_top .burger.of").hide();
        $(".menu_top .burger.on").show();
        $(".menu_left").animate({left: "-100%"}, 300);
    });


    $('.menu_left a[href*="#"]').anchor({
        transitionDuration : 1200
    });
    $(".menu_left a").click(function(){
        $(".menu_left").animate({left: "-100%"}, 300);
        $(".menu_top .burger.of").hide();
        $(".menu_top .burger.on").show();
    });



});