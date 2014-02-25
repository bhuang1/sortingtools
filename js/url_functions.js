$(document).ready(function () {
	//get URL
	var url = window.location.pathname;
	//see if "nomenu" is part of URL
	var posNoMenu = url.search("nomenu");
	//if "nomenu" is in URL 
	if (posNoMenu != -1) 
	{
		$("nav").remove();
		$("#hintButton").remove();
	}
	//else load as normal
	
});