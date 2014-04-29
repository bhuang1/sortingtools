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
function legalMove(globals, ui, start, end) {
    return (!(end == start) && end >= globals.leftBound && start >= globals.leftBound && end <= globals.rightBound && start <= globals.rightBound);
}

/*
 * Starting at the card with index cardIndex, sets all following
 * cards that happen to be sorted as sorted
 * @param globals   - object containing global variables
 * @param cardIndex - index of the card at which chainSort starts
 */
 
function chainSort(globals) {
	var parent, leftChild, rightChild;
	for (var i = 0; i < (globals.rightBound - globals.leftBound)/2; i++) {
		parent = globals.cardArray[i];
		leftChild = globals.cardArray[(i*2)+1];
		rightChild = globals.cardArray[(i*2)+2];
		if (!(parent.num < leftChild.num && (((i*2)+2) > (globals.rightBound - globals.leftBound) || parent.num < rightChild.num))) {
			return false;
		}
	}
	return true;
}
