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
	return (globals.cards[id].flipped || (globals.maxCard !== undefined && globals.maxCard.value.id == id)) && ((id == 0 && card.index() == 0)
			|| (!isNaN(parseInt(card.prev().attr('id'))) && globals.cards[id - 1].sorted && parseInt(card.prev().attr('id')) === id-1));
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
        if ($('#' + cardIndex).index() == cardIndex && globals.cards[cardIndex].flipped && $('#' + (cardIndex-1)).index() == cardIndex-1) {
            setSorted(globals, cardIndex);
        } else {
            if (detectFinish(globals)) {
                showFinish();
            }
            break;
        }
    }
}

/*
 * Automatically performs selection sort.
 * @param cards - the list of cards
 * @return The steps needed to sort the cards
 */
function autoSort(cards) {
    var steps = [];
    var toInsert = 0;
    var currentMin = Number.MAX_VALUE;
    var minIndex = Number.MAX_VALUE;

    for (var i = 0; i < cards.length; i++) {
        // Find the minimum
        for (var j = toInsert; j < cards.length; j++) {
            steps.push('consider:'+j);
            if (cards[j] < currentMin) {
                if (minIndex != Number.MAX_VALUE) {
                    steps.push('unmarkMin:'+minIndex)
                }
                steps.push('markMin:'+j);
                currentMin = cards[j];
                minIndex = j;
            }
            steps.push('unconsider:'+j);
        }

        // Move min to correct place
        steps.push('move:'+minIndex+';to;'+toInsert);
        steps.push('markSorted:'+minIndex);
        cards.remove(minIndex);
        cards.insert(toInsert, minIndex);
        toInsert++;
    }

    return steps;
}
