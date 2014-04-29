/*
 * Handles all common card manipulation functions.
 * @author Betty Huang
 * @author Sucharita Jayanti
 * @author Matthew Joyce
 * @author Mehdi Oulmakki
 * @author Chandrasekar Ramesh
 * @date February 13, 2014
 * @version 0.1
 * @since 0.1
 */


/**
 * Create array of card objects and mapping from id to card object
 * Randomize the array for initial configuration
 * @param globals - the globals object
 */
function createCards(globals) {
    var BACKGROUND = 'http://openclipart.org/people/nicubunu/nicubunu_Card_backs_grid_blue.svg';
    var SORTED_BACKGROUND = 'http://openclipart.org/people/nicubunu/nicubunu_Card_backs_grid_red.svg';
    var FOREGROUND = 'http://openclipart.org/people/nicubunu/nicubunu_Ornamental_deck_';
    var cardNumbers = ['King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    var values = [13,12,11,10,9,8,7,6,5,4,3,2];
    var cardSuits = ['clubs', 'diamonds'];

    // Randomized array of cards
    var cardArray = [];
    // Maps card number to actual card struct
    var cards = {};

    // Populate cards and cardArray with card objects
    var randomVal;
    var i = 0;
    while (i < globals.NUM_CARDS) {
        randomVal = (Math.floor(Math.random() * 10) %2) + 1;
        for (var j = 0; j < randomVal && i+j < globals.NUM_CARDS; j++){
            var newCard = {};
            newCard.num = i+j;
            newCard.flipped = false;
            newCard.sorted = false;
            newCard.value = values[i];
            newCard.normalBack = BACKGROUND;
            newCard.sortedBack = SORTED_BACKGROUND;
            newCard.frontFace = FOREGROUND + cardNumbers[i] + '_of_'
		+ cardSuits[(i+j)%2] + '.svg';
            cardArray.push(newCard);
            cards[i+j] = newCard;
        }
        i = i + randomVal;
    }
	
    // Set zIndex and xPos values based on randomized positions
    for (i = 0; i < globals.NUM_CARDS; i++) {
        var num = cardArray[i].num;
        cards[num].zIndex = i;
        cards[num].xPos = globals.PADDING + globals.SPACE * i;
    }

    globals.cardArray = cardArray;
    globals.cards = cards;
    var targetIndex = Math.ceil(Math.random() * 10) % globals.NUM_CARDS;
    globals.targetValue = cards[targetIndex].value;
	var target_message = [];
	target_message.push('You are looking for the ' + cardNumbers[values.indexOf(globals.targetValue)]);
	$(".target-message").html(target_message.join(''));
}


/**
 * Creates the HTML within the sorted area div element
 * @param globals - the object containing all globals
 * @param divElem - the class of the div element containing all the cards
 */
function createCardHTML(globals, divElem) {
    var newHTML = [];
    var cardArray = globals.cardArray;
    for (var i = 0; i < globals.NUM_CARDS; i++) {
        newHTML.push('<div class="card" id="' + cardArray[i].num +
		'" style="background-image:url(' + cardArray[i].normalBack +
		'); position:absolute; top:0px; left:' + cardArray[i].xPos +
		'px; z-index:' + cardArray[i].zIndex +
		'"></div>');
    }

    $(divElem).html(newHTML.join(''));
}


/**
 * Creates the hidden arrow divs.
 * @param globals - the globals object
 * @param divElem - 
 */
function setUpArrows(globals, divElem){
    var newHTML = [];
    var cardArray = globals.cardArray;
    for (var i = 0; i < globals.NUM_CARDS; i++) {
        newHTML.push('<span class="glyphicon glyphicon-arrow-right" id="r' + i
                + '" style="display: none; position:absolute; top:0px; left:' +
                (cardArray[i].xPos + 0.5*globals.CARD_WIDTH) + 'px"></span>');
        newHTML.push('<span class="glyphicon glyphicon-arrow-left" id="l' +
                (i + globals.NUM_CARDS) +
                '" style="display: none; position:absolute; top:0px; left:' +
                (cardArray[i].xPos + 0.5*globals.CARD_WIDTH) + 'px"></span>');
    }
    $(divElem).html(newHTML.join(''));
}


/**
 * Detects mouse hovering over card object and animates.
 * @param globals   - object containing global variables
 * @param cardClass - HTML class representing card div elements
 */
function handleHover(globals, cardClass) {
    var speed = globals.SELECT_SPEED;
    var move = globals.SELECT_MOVE;

    $(cardClass).hover(function () {
        if (!$(this).is(":animated")) {
            // Card goes up when mouse enters
            $(this).animate({top:'-=' + move}, speed);
        }
    }, function () {
        // Card sinks down when mouse leaves
        $(this).animate({top:'0px'}, speed);
    });
}


/**
 * Flips over a card if it was revealed.
 * @param globals - the object containing global variables
 * @param id      - the id of the div element to be flipped over
 */
function flipOver(globals, id) {
    var cards = globals.cards;
    // Only do something if it was already revealed
    if (globals.cards[id].flipped) {
        globals.totFlip--;
        $('#' + id).css({
            backgroundImage:'url(' + cards[id].normalBack + ')'
        }); 
    }

    cards[id].flipped = false;
}


/**
 * Reveals the face of the card if fewer than MAX_FLIP cards are face-up
 * @param globals - object containing global variables
 * @param id      - id of div element that was double clicked
 */
function reveal(globals, id) {
    if (globals.totFlip < globals.MAX_FLIP) {
        globals.cards[id].flipped = true;
        globals.totFlip++;
        maxMem(globals);
        setNewMem(globals);
        $('#' + id).css({
            backgroundImage: 'url(' + globals.cards[id].frontFace + ')'
        });
    }
}


/**
 * Is the given card the target.
 * @param globals   - the global object
 * @param cardIndex - the card in question
 */
function isTarget(globals, cardIndex){
    var cardValue = globals.cards[cardIndex].value
    return globals.targetValue == cardValue;
}


/**
 * Display the hidden div arrow.
 * @param globals   - the global object
 * @param cardIndex - which card the arrow corresponds to
 */
function showArrow(globals, cardIndex) {
    var cardValue = globals.cards[cardIndex].value

    if (globals.targetValue < cardValue){
        $("#r"+ cardIndex).show();
    } else{
        $("#l"+ (parseInt(cardIndex) + globals.NUM_CARDS)).show(); 
    }
}


/**
 * handler function for double click
 * @param globals   - object containing global variables
 * @param cardClass - HTML class representing div elements with cards
 * @param isSorted  - sorted function to be passed 
 * @param chainSort - function to propagate sorting if other cards are in place
 */
function handleClick(globals, cardClass) {
    $(cardClass).mousedown(function(event) {
        var cardIndex = this.id;
		
		switch(event.which) {
			case 1:
				// If it's face up, make face down
				if (globals.cards[cardIndex].flipped) {
					flipOver(globals, cardIndex);
				} 
				// if it's face down
				else if (globals.totFlip < globals.MAX_FLIP) {
					incrementOps(globals);
					reveal(globals, cardIndex);
					
					// Sort this and all others that can be sorted
					if (isTarget(globals, cardIndex)) {
						showFinish();
					} else {
						showArrow(globals, cardIndex);
					}
				}
			break;
		}
    });
}

/**
 * handler function for double click
 * @param globals   - object containing global variables
 * @param cardClass - HTML class representing div elements with cards
 * @param isSorted  - sorted function to be passed 
 * @param chainSort - function to propagate sorting if other cards are in place
 
function handleDoubleClick(globals, cardClass) {
    $(cardClass).dblclick(function () {
        var cardIndex = this.id;
        // If it's face up, make face down
        if (globals.cards[cardIndex].flipped) {
            flipOver(globals, cardIndex);
        } 
        // if it's face down
        else if (globals.totFlip < globals.MAX_FLIP) {
            incrementOps(globals);
            reveal(globals, cardIndex);
			
            // Sort this and all others that can be sorted
            if (detectFinish(globals, cardIndex)) {
                showFinish();
            } else {
                showArrow(globals, cardIndex);
            }
        }
    });
}
*/
