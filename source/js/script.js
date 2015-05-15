// JavaScript Documet

var blsh = true;

var show = function(){
	if(blsh){
		$('#svgTips').hide('slide');
		$('#svgMivit3').hide('slide');
		$('#svgHome').hide('slide');
		blsh = false;
	} else {
		$('#svgTips').show('slide');
		$('#svgMivit3').show('slide');
		$('#svgHome').show('slide');
		blsh = true;
	}
};

var hoverIn = function( aux ){
	$('#'+aux)[0].style.fill = "rgb(100,0,200)";
	$("#"+aux+"Img")[0].setAttribute("xlink:href","source/img/"+ aux +"White.png");
};

var hoverOut = function( aux ){
	$("#"+aux)[0].style.fill = "rgb(238,238,238)";
	$("#"+aux+"Img")[0].setAttribute("xlink:href","source/img/"+ aux +".png");
};

var hoverInCol= function( aux ){
	$("#"+aux)[0].style.fill = "rgb(100,0,200)";
	$("#"+aux)[0].style.stroke = "rgb(100,0,200)";
	$("#"+aux+"Img")[0].setAttribute("xlink:href","source/img/B"+ aux +".png");
}

var hoverOutCol = function( aux ){
	$("#"+aux)[0].style.fill = "rgb(255,255,255)";
	$("#"+aux)[0].style.stroke = "rgb(51,51,51)";
	$("#"+aux+"Img")[0].setAttribute("xlink:href","source/img/"+ aux +".png");
}

$( window ).scroll(function() {

  //$( "header" ).css( "background", "rgb(100,0,200)" ).fadeOut( "slow" );
});