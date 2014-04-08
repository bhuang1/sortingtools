/**
 * Handles all functions related to maximum slot.
 * @author Betty Huang
 * @author Sucharita Jayanti
 * @author Matthew Joyce
 * @author Mehdi Oulmakki
 * @author Chandrasekar Ramesh
 * @date February 13, 2014
 * @version 0.1
 * @since 0.1
 */
 
 /** Creates / sets new maxCard object */
 function MaxCard(maxCard){
	this.value = maxCard;
 } 
 
 /** Reset the old maxCard's position */
 function resetPosition(globals){
    if (globals.maxCard !== undefined){
	$(globals.maxCard.value).stop(true, true).animate(
		{top: '0px'},
		globals.SELECT_SPEED);
    }
 }
 
 /** Select a new maxCard and set its position */
 function maxPosition(globals){
    if (globals.maxCard !== undefined){
	$(globals.maxCard.value).stop(true, true).animate(
		{top:globals.SELECT_MOVE},
		globals.SELECT_SPEED);
	}
 }
 
 /** Set the background for maxCard */
function setMaxCardValue(maxClass, cardNum, globals) {
    $(maxClass).css('background-image',
		    'url(' + globals.cards[cardNum].frontFace+ ')');
}
