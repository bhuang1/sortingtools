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
function detectFinish(globals, cardIndex) {
	var cardValue = globals.cards[cardIndex].value
	return globals.targetValue == cardValue;
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
		$('.arr-area').html("");
        createCards(globals);
        createCardHTML(globals, '.sort-area');
		setUpArrows(globals, '.arr-area');
        globals.totFlip = 0;
        globals.ops = 0;
        globals.mem = 0;
        handleHover(globals, '.card');
        handleDoubleClick(globals, '.card', isSorted, chainSort);
        popHintsHTML();
        popHints();
        hideHints();
        $('#submitStats').hide();
    });   
}

