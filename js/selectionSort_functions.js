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
function legalMove(globals, ui, start) {
    var cardNum = parseInt($(ui.item).attr('id'));
    return (!globals.cards[cardNum].sorted &&
        !globals.cards[parseInt($(ui.item).next().attr('id'))].sorted &&
		!($(ui.item).index() == start));
}

/*
 * Checks if card is sorted or not so as to set the .sorted var
 * @param globals - object containing global variables
 * @param id      - id of the div element to check
 */
function isSorted(globals, id) {
	var card = $('#' + id);
	return (globals.cards[id].flipped || globals.maxCard.value.id == id)
          && ((id == 0 && card.index() == 0) ||
              (!isNaN(parseInt(card.prev().attr('id'))) &&
               globals.cards[id - 1].sorted &&
               parseInt(card.prev().attr('id')) === id-1));
}

/*
 * Starting at the card with index cardIndex, sets all following
 * cards that happen to be sorted as sorted
 * @param globals   - object containing global variables
 * @param cardIndex - index of the card at which chainSort starts
 */
function chainSort(globals, cardIndex) {
    // Propagates card flips
    while (true) {
        ++cardIndex;
        if ($('#' + cardIndex).index() == cardIndex &&
            globals.cards[cardIndex].flipped &&
            $('#' + (cardIndex-1)).index() == cardIndex-1) {

            globals.cards[cardIndex].sorted = true;
            $('#' + cardIndex).css({
                backgroundImage:'url('+globals.cards[cardIndex].sortedBack+')'
            });
        } else {
            if (detectFinish(globals)) {
                showFinish();
            }
            break;
        }
    }
}
