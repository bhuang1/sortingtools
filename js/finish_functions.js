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

}


