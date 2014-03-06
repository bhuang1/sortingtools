/**
 * Functions for when sorting is complete.
 * @author Betty Huang
 * @author Sucharita Jayanti
 * @author Matthew Joyce
 * @author Mehdi Oulmakki
 * @author Chandrasekar Ramesh
 * @date February 13, 2014
 * @version 0.1
 * @since 0.1
 */

 /** 
  * Enables or disables the menu, the purpose is to make it simpler to use as an iframe
  */
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