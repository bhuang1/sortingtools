/*
 * Handles all selection sort specific functions.
 * @author Betty Huang
 * @author Sucharita Jayanti
 * @author Matthew Joyce
 * @author Mehdi Oulmakki
 * @author Chandrasekar Ramesh
 * @date February 13, 2014
 * @version 0.1
 * @since 0.1
 */
 
 /*
 * Check if a move is legal in insertion sort.
 * @param globals - object containing global variables
 * @param ui      - JQuery ui element
 * @return Whether the attempted position is legal
 */
/*function legalMove(globals, ui, cardIndex) {
    var cardNum = parseInt($(ui.item).attr('id'));
    return (!globals.cards[cardNum].sorted && (globals.pivot_index !== undefined && cardIndex != globals.pivot_index));
}
*/

function legalMove(globals, ui, initPos, endPos) {
    return !globals.cardArray[initPos].sorted && globals.pivot_index !== undefined && initPos != globals.pivot_pos && (endPos < globals.cardArray[initPos].rightPivot && endPos > globals.cardArray[initPos].leftPivot);
}

 function isSorted(globals, cardIndex){
	return globals.cards[cardIndex].sorted;
 }
 
/*
 * Called when the last operation could lead to a card being sorted.
 * Based off the position of the current pivot, make sure that everything to its left, up to the first sorted card has value less than the pivot value
 * Similarly, iterate to the right, up to the first sorted card.
 * if Both tests succeed, then the pivot is sorted. 
 */
function chainSort(globals) {
	var pindex = globals.pivot_pos;
	var pval = globals.pivot_value;
	var cardArray = globals.cardArray;
	
	
	for (var i=pindex + 1; i < cardArray[pindex].rightPivot; i++){
		if (cardArray[i].value < pval){
			return false;
		}
	}
	
	for(var i=pindex - 1; i > cardArray[pindex].leftPivot ; i--){
		if (cardArray[i].value > pval) {
			return false;
		}
	}
	
	for (var i=pindex + 1; i < cardArray[pindex].rightPivot; i++){
		cardArray[i].leftPivot = pindex;
	}
	
	for(var i=pindex - 1; i > cardArray[pindex].leftPivot; i--){
		cardArray[i].rightPivot = pindex;
	}

	return true;
}
