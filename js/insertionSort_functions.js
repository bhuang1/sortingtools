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
 * Check if a move is legal in manual mode.
 * @param globals - object containing global variables
 * @param ui      - JQuery ui element
 * @return Whether the attempted position is legal
 */
function legalMove(globals, ui, start) {
    return true;
}

/*
 * Check if a move is legal in assisted mode.
 * @param globals - object containing globals
 * @param ui      - JQuery ui element
 * @return Whether the attempted position is legal
 */
function assistedLegalMove(globals, ui, start) {
    return false;
}

/*
 * Checks if card is sorted or not so as to set the .sorted var
 * @param globals - object containing global variables
 * @param id      - id of the div element to check
 */
function isSorted(globals, id) {
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
