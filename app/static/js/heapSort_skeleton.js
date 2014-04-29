$(document).ready(function () {
    /* Globals that configure state space */
    function Globals(){
        this.SELECT_MOVE = 30,
        this.SELECT_SPEED = 100,
        this.WINDOW_WIDTH =  $(window).width(),
        this.NUM_CARDS =  13,
        this.CARD_WIDTH =  120,
        this.PADDING =  120,
        this.SPACE =  Math.floor((this.WINDOW_WIDTH - this.CARD_WIDTH - 2 * this.PADDING) / (this.NUM_CARDS - 1)),
        this.totFlip =  0,
        this.ops =  0,
        this.mem =  0,
        this.maxCard = undefined,
		this.leftBound = 0;
		this.rightBound = 1;
		this.nextCard = -1;
		this.nextCardSeen = false;
		this.cardAbbreviations = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
		this.swapCardValue = -1;
		this.swapCardIndex = -1;
		this.BACKGROUND = 'http://openclipart.org/people/nicubunu/nicubunu_Card_backs_grid_blue.svg';
		this.SORTED_BACKGROUND = 'http://openclipart.org/people/nicubunu/nicubunu_Card_backs_grid_red.svg';
    }

    var globals = new Globals();

    // Create the cards
    createCards(globals);
    createCardHTML(globals, '.sort-area');

    // Hover over a card
    handleHover(globals, '.card');

    // Double click
    handleDoubleClick(globals, '.card', chainSort);

    // Right click
    handleRightClick(globals, '.droppable', '.card', chainSort);

    // Handle drag and drop
    handleDragDrop(globals, '.sort-area', legalMove, chainSort);
	
	// Handle swap
	handleNodeHover(globals, '.node');
	handleSwap(globals, '.node');
	handleNodeRightClick(globals, '.node');
	
    // handle the popping
    popHintsHTML();
    popHints();
    hideHints();
});
