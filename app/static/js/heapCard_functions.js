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
        newCard.frontFace = FOREGROUND + cardNumbers[i] + '_of_' + cardSuits[i] + '.svg';
        cardArray.push(newCard);
        cards[i] = newCard;
    }

    // Randomize ordering of cardArray
    var temporaryValue, randomIndex;
	for (currentIndex = cardArray.length-1; currentIndex >= 0; currentIndex--) {
		randomIndex = Math.floor(Math.random() * (currentIndex+1));
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
  //      newHTML.push('<div class="card" id="' + cardArray[i].num + '" style="background-image:url(' + globals.BACKGROUND + '); position:absolute; top:0px; left:' + cardArray[i].xPos + 'px; z-index:' + cardArray[i].zIndex + '"></div>');
  //  }
		newHTML.push('<div class="card" id="' + cardArray[i].num + '" style="background-image:url(' + globals.BACKGROUND + '); position:absolute; top:0px; left:' + cardArray[i].xPos + 'px; z-index:' + cardArray[i].zIndex + '"><div class="overlay" style="background-image:url(' + cardArray[i].frontFace + ');"></div></div>');
    }

    $(divElem).html(newHTML.join(''));
}

/**
 * Detects mouse hovering over card object and animates.
 * @param globals   - object containing global variables
 * @param cardClass - HTML class representing card div elements
 */
function handleHover(globals, cardClass) {
	var cardIndex;

    $(cardClass).hover(function () {
		cardIndex = $('#' + this.id).css("z-index")-globals.leftBound;
        if (!$(this).is(":animated")) {
            // Card goes up when mouse enters
            $(this).animate({top:'-=' + globals.SELECT_MOVE}, globals.SELECT_SPEED);
			$("#node" + cardIndex).css({"background": "#3366FF"});
        }
    }, function () {
        // Card sinks down when mouse leaves
        $(this).animate({top:'0px'}, globals.SELECT_SPEED);
        if (globals.maxCard != undefined){
            maxPosition(globals);
        }
		$("#node" + cardIndex).css({"background": "none"});
    });
}

/**
 * Flips over a card if it was revealed.
 * @param globals - the object containing global variables
 * @param id    - the id of the div element to be flipped over
 */
function flipOver(globals, id) {
    // Only do something if it was already revealed
    if (globals.cards[id].flipped) {
		var cardPosition = $('#' + id).css("z-index") - globals.leftBound;
        globals.totFlip--;
        $('#' + id).css({
            backgroundImage:'url(' + globals.BACKGROUND + ')'
        }); 
		$("#node" + cardPosition).html('');
    }

    globals.cards[id].flipped = false;
}

/**
 * Sets the card to sorted and changes the background
 * @param globals - the object containing global variables
 * @param id - the id of the div element to be set to sorted
 */
function setSorted(globals, id) {
    globals.cards[id].sorted = true;
    globals.cards[id].flipped = false;
    globals.totFlip--;
    $('#' + id).css({
        backgroundImage:'url(' + globals.SORTED_BACKGROUND + ')'
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
 
function handleRightClick(globals, maxClass, cardClass, chainSort) {
    $(cardClass).mousedown(function(event) {
        var cardIndex = this.id;

        switch (event.which) {
            // Value for right click
            case 3:
                if (!($(this).index() > globals.rightBound)) {
                    if (this != globals.maxCard) {
                        incrementOps(globals);
						// Charge two cards if no max has been selected yet
						if (globals.maxCard === undefined) {
							globals.totFlip++;
							maxMem(globals);
							setNewMem(globals);
						}
                    }

                    // Change maxCard values and positions
                    resetPosition(globals);
					globals.maxCard = this;
                    maxPosition(globals);
					
					if (cardIndex == globals.nextCard && !globals.nextCardSeen && chainSort(globals)) {
						if (globals.rightBound < globals.cardArray.length-1) {
							globals.rightBound = globals.rightBound+1;
							globals.nextCard = globals.cardArray[globals.rightBound].num;
							globals.nextCardSeen = false;
						}
						else {
							globals.leftBound = globals.leftBound+1;
							setSorted(globals, globals.cardArray[0].num);
							globals.cardArray = globals.cardArray.slice(1);
							for (var i = 0; i <= globals.rightBound-globals.leftBound; i++) {
								if (globals.cardArray[i].flipped) {
									$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
								}
								else {
									$("#node" + i).html('');
								}
							}
							for (var i = globals.rightBound-globals.leftBound+1; i <= globals.rightBound; i++) {
								$("#node" + i).html('');
							}
						}
					}
					
					if (!globals.cards[cardIndex].flipped && !globals.cards[cardIndex].sorted) {
						reveal(globals, cardIndex);
					}

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
	if (id == globals.nextCard) {
		globals.nextCardSeen = true;
	}
	var cardPosition = $('#' + id).css("z-index") - globals.leftBound;
	globals.cards[id].flipped = true;
	globals.totFlip++;
	maxMem(globals);
	setNewMem(globals);
	$('#' + id).css({
		backgroundImage: 'url(' + globals.cards[id].frontFace + ')'
	});
	$("#node" + cardPosition).html(globals.cardAbbreviations[globals.cardArray[cardPosition].num]);
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
        if (globals.cards[cardIndex].sorted || $(this).index() > globals.rightBound) {}
        // If it's face up, make face down
        else if (globals.cards[cardIndex].flipped) {
            flipOver(globals, cardIndex);
        } 
        // if it's face down and within the subarray to be sorted
        else {
            incrementOps(globals);
			
			if (cardIndex == globals.nextCard && !globals.nextCardSeen && chainSort(globals)) {
				if (globals.rightBound < globals.cardArray.length-1) {
					globals.rightBound = globals.rightBound+1;
					globals.nextCard = globals.cardArray[globals.rightBound].num;
					globals.nextCardSeen = false;
				}
				else {
					globals.leftBound = globals.leftBound+1;
					setSorted(globals, globals.cardArray[0].num);
					globals.cardArray = globals.cardArray.slice(1);
					for (var i = 0; i <= globals.rightBound-globals.leftBound; i++) {
						if (globals.cardArray[i].flipped) {
							$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
						}
						else {
							$("#node" + i).html('');
						}
					}
					for (var i = globals.rightBound-globals.leftBound+1; i <= globals.rightBound; i++) {
						$("#node" + i).html('');
					}
				}
			}
			reveal(globals, cardIndex);
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
			startIndex = startIndex - globals.leftBound;
        }, 
        stop: function (event, ui) {
			endIndex = $(ui.item).index() - globals.leftBound;
			
            if (legalMove(globals, ui, startIndex+globals.leftBound, endIndex+globals.leftBound)) {
				// Stats
                incrementOps(globals);
                // Move cards
                spacifyCards(globals);
				// Update position in cardArray
				var movedCard = globals.cardArray[startIndex];
				if (endIndex > startIndex) {
					for (var i = startIndex; i < endIndex; i++) {
						globals.cardArray[i] = globals.cardArray[i+1];
						if (globals.cardArray[i].flipped) {
							$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
						}
						else {
							$("#node" + i).html('');
						}
					}
					globals.cardArray[endIndex] = movedCard;
					if (globals.cardArray[endIndex].flipped) {
						$("#node" + endIndex).html(globals.cardAbbreviations[globals.cardArray[endIndex].num]);
					}
					else {
						$("#node" + endIndex).html('');
					}
				}
				else {
					for (var i = startIndex; i > endIndex; i--) {
						globals.cardArray[i] = globals.cardArray[i-1];
						if (globals.cardArray[i].flipped) {
							$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
						}
						else {
							$("#node" + i).html('');
						}
					}
					globals.cardArray[endIndex] = movedCard;
					if (globals.cardArray[endIndex].flipped) {
						$("#node" + endIndex).html(globals.cardAbbreviations[globals.cardArray[endIndex].num]);
					}
					else {
						$("#node" + endIndex).html('');
					}
				}
				
				// Extra call to chainsort, allows us to sort cards that get swapped into place
				// Added the check as a bug fix for https://trello.com/c/hFZl4hab
				// still working as we expected for swapping.
				if (globals.nextCardSeen && chainSort(globals)) {
					if (globals.rightBound < globals.cardArray.length-1) {
						globals.rightBound = globals.rightBound+1;
						globals.nextCard = globals.cardArray[globals.rightBound].num;
						globals.nextCardSeen = false;
					}
					else {
						globals.leftBound = globals.leftBound+1;
						setSorted(globals, globals.cardArray[0].num);
						globals.cardArray = globals.cardArray.slice(1);
						for (var i = 0; i <= globals.rightBound-globals.leftBound; i++) {
							if (globals.cardArray[i].flipped) {
								$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
							}
							else {
								$("#node" + i).html('');
							}
						}
						for (var i = globals.rightBound-globals.leftBound+1; i <= globals.rightBound; i++) {
							$("#node" + i).html('');
						}
						if (detectFinish(globals)) {
							showFinish();
						}
					}
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
        }
    });
}

function handleSwap(globals, swapClass) {
	$(swapClass).click( function () {
		if(globals.swapCardValue == -1 && this.id.slice(4) <= globals.rightBound) {
			globals.swapCardValue = globals.cardArray[this.id.slice(4)].num;
			globals.swapCardIndex = Number(this.id.slice(4));
		}
		//check if swap is allowed
		else if(this.id.slice(4) != globals.swapCardIndex && this.id.slice(4) <= globals.rightBound 
		&& (Number(this.id.slice(4)) == globals.swapCardIndex*2 + 1 || Number(this.id.slice(4)) == globals.swapCardIndex*2 + 2 ||
		globals.swapCardIndex == Number(this.id.slice(4))*2 + 1 || globals.swapCardIndex == Number(this.id.slice(4))*2 + 2)){
			//change positions in sort area
			if(this.id.slice(4) == globals.swapCardIndex + 1) {
				$("#" + globals.swapCardValue).insertAfter($("#" + globals.cardArray[this.id.slice(4)].num));
			}
			else if(this.id.slice(4) == globals.swapCardIndex - 1) {
				$("#" + globals.cardArray[this.id.slice(4)].num).insertAfter($("#" + globals.swapCardValue));
			}
			else if(this.id.slice(4) != 0) {
				$("#" + globals.cardArray[this.id.slice(4)].num).insertAfter($("#" + globals.swapCardValue));
				$("#" + globals.swapCardValue).insertAfter($("#" + globals.cardArray[this.id.slice(4)-1].num));
			}
			else {
				$("#" + globals.swapCardValue).insertAfter($("#" + globals.cardArray[this.id.slice(4)].num));
				$("#" + globals.cardArray[this.id.slice(4)].num).insertAfter($("#" + globals.cardArray[globals.swapCardIndex-1].num));
			}
			spacifyCards(globals);
			//change positions in globals.cardArray
			var temp = globals.cardArray[this.id.slice(4)];
			globals.cardArray[this.id.slice(4)] = globals.cardArray[globals.swapCardIndex];
			globals.cardArray[globals.swapCardIndex] = temp;
			//change positions in heap image
			temp = $("#node" + globals.swapCardIndex).html();
			$("#node" + globals.swapCardIndex).html($("#node" + this.id.slice(4)).html());
			$("#node" + this.id.slice(4)).html(temp);
			if (globals.nextCardSeen && chainSort(globals)) {
				if (globals.rightBound < globals.cardArray.length-1) {
					globals.rightBound = globals.rightBound+1;
					globals.nextCard = globals.cardArray[globals.rightBound].num;
					globals.nextCardSeen = false;
				}
				else {
					globals.leftBound = globals.leftBound+1;
					setSorted(globals, globals.cardArray[0].num);
					globals.cardArray = globals.cardArray.slice(1);
					for (var i = 0; i <= globals.rightBound-globals.leftBound; i++) {
						if (globals.cardArray[i].flipped) {
							$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
						}
						else {
							$("#node" + i).html('');
						}
					}
					for (var i = globals.rightBound-globals.leftBound+1; i <= globals.rightBound; i++) {
						$("#node" + i).html('');
					}
				}
				if (detectFinish(globals)) {
					showFinish();
				}
			}
			//charge for the swap
			incrementOps(globals);
			globals.swapCardValue = -1;
			
		}
		else {
			globals.swapCardValue = -1;
		}
	});
}

function handleNodeRightClick(globals, flipClass) {
    $(flipClass).mousedown(function () {
		 switch (event.which) {
			// Value for right click
			case 3:
				var cardIndex = globals.cardArray[this.id.slice(4)].num;
				// If it's sorted do nothing
				if (globals.cards[cardIndex].sorted || $('#' + cardIndex).css("z-index") > globals.rightBound) {}
				// If it's face up, make face down
				else if (globals.cards[cardIndex].flipped) {
					flipOver(globals, cardIndex);
				} 
				// if it's face down and within the subarray to be sorted
				else {
					incrementOps(globals);
					
					if (cardIndex == globals.nextCard && !globals.nextCardSeen && chainSort(globals)) {
						if (globals.rightBound < globals.cardArray.length-1) {
							globals.rightBound = globals.rightBound+1;
							globals.nextCard = globals.cardArray[globals.rightBound].num;
							globals.nextCardSeen = false;
						}
						else {
							globals.leftBound = globals.leftBound+1;
							setSorted(globals, globals.cardArray[0].num);
							globals.cardArray = globals.cardArray.slice(1);
							for (var i = 0; i <= globals.rightBound-globals.leftBound; i++) {
								if (globals.cardArray[i].flipped) {
									$("#node" + i).html(globals.cardAbbreviations[globals.cardArray[i].num]);
								}
								else {
									$("#node" + i).html('');
								}
							}
							for (var i = globals.rightBound-globals.leftBound+1; i <= globals.rightBound; i++) {
								$("#node" + i).html('');
							}
						}
					}
					
					
					reveal(globals, cardIndex);
				}
				break;
		}
    });
}

function handleNodeHover(globals, nodeClass) {
	var cardId;

    $(nodeClass).hover(function () {
		cardId = globals.cardArray[this.id.slice(4)].num;
        if (!$("#" + cardId).is(":animated")) {
            // Card goes up when mouse enters
            $("#" + cardId).animate({top:'-=' + globals.SELECT_MOVE}, globals.SELECT_SPEED);
			$(this).css({"background": "#3366FF"});
        }
    }, function () {
        // Card sinks down when mouse leaves
        $("#" + cardId).animate({top:'0px'}, globals.SELECT_SPEED);
        if (globals.maxCard != undefined){
            maxPosition(globals);
        }
		$(this).css({"background": "none"});
    });
}
	