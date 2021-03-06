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
    var cardNum = parseInt($(ui.item).attr('id'));
	//alert(globals.rightBound);
	//alert($(ui.item).index());
	//alert(!($(ui.item).index() == start));
	//alert(($(ui.item).index() >= globals.leftBound));
	//alert(($(ui.item).index() <= globals.rightBound));
    return (cardNum == globals.nextCard && !(end == start) && end >= globals.leftBound && start >= globals.leftBound && end <= globals.rightBound && start <= globals.rightBound);
}

/*
 * Checks if card is sorted or not so as to set the .sorted var
 * @param globals - object containing global variables
 * @param id      - id of the div element to check
 */
function isSorted(globals, id) {
//	return globals.cards[id].sorted || (globals.cards[id].flipped && ((id == 0 && card.index() == 0)
//        || (card.index() == id && isSorted(globals, id - 1))));
		// alert(globals.cards[id - 1].sorted);
	//return ((globals.cards[id].flipped || globals.maxCard.value.id == id) && ((id == 0 && card.index() == 0)
	//		|| (!isNaN(parseInt(card.prev().attr('id'))) && globals.cards[id - 1].sorted && parseInt(card.prev().attr('id')) === id-1)));

    var card = $('#' + id);
    return globals.cards[id].sorted || ((globals.cards[id].flipped || globals.maxCard.value.id == id) && ((id == 0 && card.index() == 0) || (card.index() == id && isSorted(globals, id - 1))));

}

/*
 * Starting at the card with index cardIndex, sets all following
 * cards that happen to be sorted as sorted
 * @param globals   - object containing global variables
 * @param cardIndex - index of the card at which chainSort starts
 */
 
function chainSort(globals) {
    //var cards = globals.cards;
    // Propagates card flips
	var sortedCount = 0;
	var currentCard = globals.leftBound;
    while (globals.cardArray[currentCard].num < globals.cardArray[currentCard+1].num) {
        sortedCount++;
		currentCard++;
    }
	return sortedCount >= (globals.rightBound-globals.leftBound);
}
