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
	//var cardNumbers = ['2','3','4','5','6','7','8','9','10','Jack','Queen', 'King', 'Ace', '2', '3', '4'];
	//var values = [1,2,3,4,5,6,7,8,9,10,11,12,13];
	var cardNumbers = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace', 'King', 'Queen'];	
	var values = [13,12,11,10,9,8,7,6,5,4,3,2,1];	
	var cardSuits = ['spades', 'clubs', 'diamonds', 'hearts', 'spades', 'clubs', 'diamonds', 'hearts', 'spades', 'clubs', 'diamonds', 'diamonds', 'spades', 'clubs', 'diamonds', 'hearts'];

    // Randomized array of cards
    var cardArray = [];
    // Maps card number to actual card struct
    var cards = {};

    // Populate cards and cardArray with card objects
    for (var i = 0; i < globals.NUM_CARDS; i++) {
        var newCard = {};
        newCard.num = i;
        newCard.flipped = false;
        newCard.sorted = false;
        newCard.normalBack = BACKGROUND;
        newCard.sortedBack = SORTED_BACKGROUND;
		newCard.value = values[i];
        
		newCard.frontFace = FOREGROUND + cardNumbers[i] + '_of_' + cardSuits[i] + '.svg';
        newCard.rightPivot = globals.NUM_CARDS;
		newCard.leftPivot = -1;
		
		cardArray.push(newCard);
        cards[i] = newCard;
		
    }

    // Randomize ordering of cardArray
    var currentIndex, temporaryValue, randomIndex;
    currentIndex = cardArray.length;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = cardArray[currentIndex];
        cardArray[currentIndex] = cardArray[randomIndex];
        cardArray[randomIndex] = temporaryValue;
    }

    // Set zIndex and xPos values based on randomized positions
    for (i = 0; i < globals.NUM_CARDS; i++) {
        var num = cardArray[i].num;
        cards[num].zIndex = i;
        cards[num].xPos = globals.PADDING + globals.SPACE * i;
    }

    globals.cardArray = cardArray;
    globals.cards = cards;
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
		newHTML.push('<div class="card" id="' + cardArray[i].num + '" style="background-image:url(' + cardArray[i].frontFace + '); position:absolute; top:0px; left:' + cardArray[i].xPos + 'px; z-index:' + cardArray[i].zIndex + '"></div>');
    }cardArray

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
    var maxCard = globals.maxCard;

    $(cardClass).hover(function () {
        if (!$(this).is(":animated")) {
            // Card goes up when mouse enters
            $(this).animate({top:'-=' + move}, speed);
        }
    }, function () {
        // Card sinks down when mouse leaves
        $(this).animate({top:'0px'}, speed);
        if (globals.maxCard != undefined){
            maxPosition(globals);
        }
    });
}
	
/**
 * Flips over a card if it was revealed.
 * @param globals - the object containing global variables
 * @param id    - the id of the div element to be flipped over
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
 * Sets the card to sorted and changes the background
 * @param globals - the object containing global variables
 */
function setSorted(globals, id) {
	alert(id);
    var cards = globals.cards;
    cards[id].sorted = true;
    cards[id].flipped = false;
    globals.totFlip--;
    $('#' + id).css({
        backgroundImage:'url(' + globals.cards[id].sortedBack + ')'
    })
}

/**
 * After moving cards around, change all card positions
 * @param globals - object containing global variables
 */
function spacifyCards(globals) {
    for (var i = 0; i < globals.NUM_CARDS; i++) {
        $('#' + i).css({
            'z-index':$('#' + i).index(),
            'left':(globals.SPACE*$('#' + i).index()+globals.PADDING)+'px',
            'top':'0px'
        });
    }
}

/**
 * handler function for right click
 * @param globals   - object containing global variables
 * @param maxClass  - HTML class representing card that is maxCard
 * @param cardClass - HTML class representing div elements with cards
 * @param chainSort - function to propagate sorting if other cards are in place
 */
 
function handleRightClick(globals, isSorted, maxClass, cardClass, chainSort) {
    $(cardClass).mousedown(function(event) {
        var cardIndex = this.id;
		globals.pivot_index = cardIndex;
        switch (event.which) {
            // Value for right click
            case 3:
									
                // If you're allowed to flip up any more cards
                if (globals.totFlip < globals.MAX_FLIP) {
                    if (this != globals.maxCard) {
                        incrementOps(globals);
                    }
					
					// Update stats
					if ((!globals.cards[cardIndex].flipped && globals.totFlip == 0) || (isSorted(globals, globals.pivot_pos))) {
						reveal(globals, cardIndex);
						globals.pivot_pos = $('#' + cardIndex).index();
						setMaxCardValue(maxClass, cardIndex, globals);
						globals.pivot_value = globals.cardArray[globals.pivot_pos].value;
						
						// Change maxCard values and positions
						resetPosition(globals);
						globals.maxCard = new MaxCard(this);
						maxPosition(globals);

						if (chainSort(globals)){setSorted(globals, globals.pivot_pos);};

					}
					
					else{
						alert("Finish sorting the current pivot before picking a new one!");
					}

					
					if (globals.maxCard === undefined) {
						globals.totFlip++;
						maxMem(globals);
						setNewMem(globals);
					}

                    
                    // Otherwise just reveal

                    
					
            }    
            break;
        } // switch
    });   // mousedown
}         // handleRightClick


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
 * handler function for double click
 * @param globals   - object containing global variables
 * @param cardClass - HTML class representing div elements with cards
 * @param chainSort - function to propagate sorting if other cards are in place
 */
function handleDoubleClick(globals, cardClass, chainSort) {
    $(cardClass).dblclick(function () {
        var cardIndex = this.id;
        // If it's sorted do nothing
        if (globals.cards[cardIndex].sorted) {}
        // If it's face up, make face down
        else if (globals.cards[cardIndex].flipped) {
            flipOver(globals, cardIndex);
        } 
        // if it's face down
        else if (globals.totFlip < globals.MAX_FLIP) {
            incrementOps(globals);
            reveal(globals, cardIndex);
			if (chainSort(globals)){setSorted(globals, globals.pivot_pos);};
        }
        
    });
}

/**
 * Handler for picking up and dropping cards within sortable
 * @param globals   - object containing global variables
 * @param sortClass - HTML class of the div element containing sortable
 * @param legalMove - function to be passed in to determine legal move
 * @param chainSort - function to propagate sorting if other cards are in place
 */ 
   
function handleDragDrop(globals, sortClass, legalMove, chainSort) {
    var space = globals.SPACE;
    var pad = globals.PADDING;
    var draggable_sibling;
	var startIndex, endindex;
	
    $(sortClass).sortable({
        tolerance: 'pointer',
        axis: 'x',
        start: function (event, ui) {
			startIndex = $(ui.item).index();
            draggable_sibling = $(ui.item).prev();
        }, 
        stop: function (event, ui) {
			endIndex = $(ui.item).index();
            var cardIndex = parseInt($(ui.item).attr('id'));
            if (legalMove(globals, ui, startIndex, endIndex)) {
                // Stats
                incrementOps(globals);

                // Move cards
                spacifyCards(globals);
				
				var movedCard = globals.cardArray[startIndex];
				if (endIndex > startIndex) {
					for (var i = startIndex; i < endIndex; i++) {
						globals.cardArray[i] = globals.cardArray[i+1];
						if (globals.cardArray[i].value == globals.pivot_value){
							globals.pivot_pos = i;
						}
					}
					globals.cardArray[endIndex] = movedCard;
				}
				else {
					for (var i = startIndex; i > endIndex; i--) {
						globals.cardArray[i] = globals.cardArray[i-1];
						if (globals.cardArray[i].value == globals.pivot_value){
							globals.pivot_pos = i;
						}

					}
					globals.cardArray[endIndex] = movedCard;
				}

				// Extra call to chainsort, allows us to sort cards that get swapped into place
				// Added the check as a bug fix for https://trello.com/c/hFZl4hab
				// still working as we expected for swapping.
				if (chainSort(globals)){setSorted(globals, globals.pivot_pos);};

			}
            // Not legal - return to previous position
            else {
                $(ui.item).insertAfter(draggable_sibling);
                $(ui.item).css({
                    'top': '0px'
                });
            }

            // Handle sortedness as a result of the drag / drop
            //    setSorted(globals, cardIndex);
            //    chainSort(globals, cardIndex);

        }
    });
}
