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
    var cardNumbers = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'Ace', 'King', 'Queen'];
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
        newCard.frontFace = FOREGROUND + cardNumbers[i] + '_of_' + cardSuits[i] + '.svg';
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
	globals.nextCard = cardArray[globals.rightBound].num;
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
  //      newHTML.push('<div class="card" id="' + cardArray[i].num + '" style="background-image:url(' + cardArray[i].normalBack + '); position:absolute; top:0px; left:' + cardArray[i].xPos + 'px; z-index:' + cardArray[i].zIndex + '"></div>');
  //  }
		newHTML.push('<div class="card" id="' + cardArray[i].num + '" style="background-image:url(' + cardArray[i].normalBack + '); position:absolute; top:0px; left:' + cardArray[i].xPos + 'px; z-index:' + cardArray[i].zIndex + '"><div class="overlay" style="background-image:url(' + cardArray[i].frontFace + ');"></div></div>');
    }

    $(divElem).html(newHTML.join(''));
}

function setUpArrows(globals, divElem){
	var newHTML = [];
	var cardArray = globals.cardArray;
	for (var i = 0; i < globals.NUM_CARDS; i++) {
		newHTML.push('<span class="glyphicon glyphicon-arrow-up" id="c' + i + '" style="display:none; position:absolute; top:0px; left:' + (cardArray[i].xPos + 0.5*globals.CARD_WIDTH) + 'px"></span>');
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
 * @param id - the id of the div element to be set to sorted
 */
function setSorted(globals, id) {
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
 * @param isSorted  - sorted function to be passed 
 * @param maxClass  - HTML class representing card that is maxCard
 * @param cardClass - HTML class representing div elements with cards
 * @param chainSort - function to propagate sorting if other cards are in place
 */
 
function handleRightClick(globals, isSorted, maxClass, cardClass, chainSort) {
    $(cardClass).mousedown(function(event) {
        var cardIndex = this.id;

        switch (event.which) {
            // Value for right click
            case 3:
                // If you're allowed to flip up any more cards
                if (globals.totFlip < globals.MAX_FLIP && !($('#' + cardIndex).css("z-index") > globals.rightBound)) {
                    if (this != globals.maxCard) {
                        incrementOps(globals);
                        setNewOps(globals);
                    }
					
					// Update stats
					if (!globals.cards[cardIndex].flipped) {
						reveal(globals, cardIndex);
					}
					
					if (globals.maxCard === undefined) {
						globals.totFlip++;
						maxMem(globals);
						setNewMem(globals);
					}

                    // Change maxCard values and positions
                    resetPosition(globals);
                    globals.maxCard = new MaxCard(this);
                    maxPosition(globals);
					
					if (cardIndex == globals.nextCard && chainSort(globals)) {
						alert("increment bound");
						moveArrow(globals);
						globals.rightBound = globals.rightBound+1;
						globals.nextCard = globals.cardArray[globals.rightBound].num;
					}

					/*
                    // if it's sorted as a result
                    if (isSorted(globals, cardIndex)) {
                        setSorted(globals, cardIndex);
                        chainSort(globals, cardIndex);
                        if (detectFinish(globals)) {
                            showFinish();
                        }
					*/
					
                    // Otherwise just reveal

                    setMaxCardValue(maxClass, cardIndex, globals);
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
 * @param isSorted  - sorted function to be passed 
 * @param chainSort - function to propagate sorting if other cards are in place
 */
function handleDoubleClick(globals, cardClass, isSorted, chainSort) {
    $(cardClass).dblclick(function () {
        var cardIndex = this.id;
        // If it's sorted do nothing
        if (globals.cards[cardIndex].sorted || $('#' + cardIndex).css("z-index") > globals.rightBound) {}
        // If it's face up, make face down
        else if (globals.cards[cardIndex].flipped) {
            flipOver(globals, cardIndex);
        } 
        // if it's face down and within the subarray to be sorted
        else if (globals.totFlip < globals.MAX_FLIP) {
            incrementOps(globals);
            setNewOps(globals);
            reveal(globals, cardIndex);
			
			if (globals.totFlip == 1){	
				$("#c1").show();
			}
			if (cardIndex == globals.nextCard && chainSort(globals)) {
				alert("increment bound");
				moveArrow(globals);
				globals.rightBound = globals.rightBound+1;
				globals.nextCard = globals.cardArray[globals.rightBound].num;
			}

            // Sort this and all others that can be sorted
			/*
            if (isSorted(globals, cardIndex)) {
                setSorted(globals, cardIndex);
                chainSort(globals, cardIndex);
            }
			*/
        }
    });
}

function moveArrow(globals){
	var bound = globals.rightBound;
	alert(bound);
	$("#c"+ bound).hide();
	if (bound + 1 < globals.NUM_CARDS)
		$("#c" + parseInt(bound+1)).show()
}

/**
 * Handler for picking up and dropping cards within sortable
 * @param globals   - object containing global variables
 * @param sortClass - HTML class of the div element containing sortable
 * @param legalMove - function to be passed in to determine legal move
 * @param isSorted  - sorted function to be passed 
 * @param chainSort - function to propagate sorting if other cards are in place
 */ 
   
function handleDragDrop(globals, sortClass, legalMove, isSorted, chainSort) {
    var space = globals.SPACE;
    var pad = globals.PADDING;
    var draggable_sibling;
	var startIndex, endIndex;
	var firstElement = false;
    $(sortClass).sortable({
        tolerance: 'pointer',
        axis: 'x',
        start: function (event, ui) {
			startIndex = $(ui.item).index();
			if (startIndex != 0) {
				draggable_sibling = $(ui.item).prev();
				firstElement = false;
			}
			else {
				firstElement = true;
			}
        }, 
        stop: function (event, ui) {
			endIndex = $(ui.item).index();
			
            if (legalMove(globals, ui, startIndex, endIndex)) {
				var cardIndex = parseInt($(ui.item).attr('id'));
                
				// Stats
                incrementOps(globals);
                setNewOps(globals);

                // Move cards
                spacifyCards(globals);
				
				// Update position in cardArray
				var movedCard = globals.cardArray[startIndex];
				if (endIndex > startIndex) {
					for (var i = startIndex; i < endIndex; i++) {
						globals.cardArray[i] = globals.cardArray[i+1];
					}
					globals.cardArray[endIndex] = movedCard;
				}
				else {
					for (var i = startIndex; i > endIndex; i--) {
						globals.cardArray[i] = globals.cardArray[i-1];
					}
					globals.cardArray[endIndex] = movedCard;
				}
				
				// Extra call to chainsort, allows us to sort cards that get swapped into place
				// Added the check as a bug fix for https://trello.com/c/hFZl4hab
				// still working as we expected for swapping.
				if (chainSort(globals)) {
					alert("increment bound");
					moveArrow(globals);
					globals.rightBound = globals.rightBound+1;
					globals.nextCard = globals.cardArray[globals.rightBound].num;
				}
            // Not legal - return to previous position
            } 
			else {
				if (!firstElement) {
					$(ui.item).insertAfter(draggable_sibling);
				}
				else {
					$(".sort-area").prepend(ui.item);
				}
                $(ui.item).css({
                    'top': '0px'
                });
            }

            // Handle sortedness as a result of the drag / drop
			/*
            if (isSorted(globals, cardIndex)) {

				setSorted(globals, cardIndex);
                chainSort(globals, cardIndex);

                if (detectFinish(globals.NUM_CARDS)) {
                    showFinish();
				}
            }
			*/
        }
    });
}
