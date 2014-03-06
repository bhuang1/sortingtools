/*
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

/*
 * Returns true if it was sorted
 * @param globals - globals object
 */
function detectFinish(globals) {
        var numCards = globals.NUM_CARDS;
        var cards = globals.cards;
        return cards[numCards - 1].sorted;
}

/*
 *Show finish message
 */
function showFinish() {
    $('.alert').show();
    $('#submitStats').show();
}


function resetCards(globals) {
    $('#submitStats').click(function()  {      
        $('.sort-area').html("");
        createCards(globals);
        createCardHTML(globals, '.sort-area');
        globals.totFlip = 0;
        globals.ops = 0;
        globals.mem = 0;
        handleHover(globals, '.card');
        handleDoubleClick(globals, '.card', isSorted, chainSort);
        handleRightClick(globals, isSorted, '.droppable', '.card', chainSort);
        handleDragDrop(globals, '.sort-area', legalMove, isSorted, chainSort); 
        popHintsHTML();
        popHints();
        hideHints();
        $('#submitStats').hide();
    });   
}

