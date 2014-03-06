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
        this.MAX_FLIP =  2,
        this.totFlip =  0,
        this.ops =  0,
        this.mem =  0,
        this.maxCard = undefined
    }

    var globals = new Globals();

    // Create the cards
    createCards(globals);
    createCardHTML(globals, '.sort-area');

    // Hover over a card
    handleHover(globals, '.card');

    // Double click
    handleDoubleClick(globals, '.card', isSorted, chainSort);

    // Right click
    handleRightClick(globals, isSorted, '.droppable', '.card', chainSort);

    // Handle drag and drop
    handleDragDrop(globals, '.sort-area', legalMove, isSorted, chainSort);
	
    // handle the popping
    popHintsHTML();
    popHints();
    hideHints();
});
