$(document).ready(function () {
    /* Globals that configure state space */
    function Globals(){
        this.SELECT_MOVE = 30,
        this.SELECT_SPEED = 100,
        this.WINDOW_WIDTH =  $(window).width(),
        this.NUM_CARDS =  12,
        this.CARD_WIDTH =  120,
        this.PADDING =  120,
        this.SPACE =  Math.floor((this.WINDOW_WIDTH - this.CARD_WIDTH - 2 * this.PADDING) / (this.NUM_CARDS - 1)),
        this.MAX_FLIP =  16, 
        this.totFlip =  0,
        this.ops =  0,
        this.mem =  0,
        this.maxCard = undefined
    }

    var globals = new Globals();

    // Create the cards
    createCards(globals);
    createCardHTML(globals, '.card-area');
    setUpArrows(globals, '.arr-area');
	
    // Hover over a card
    handleHover(globals, '.card');
	
    // Double click
    handleClick(globals, '.card');
	
    // refresh page
    refreshPage('#resetButton');
    
    // handle the popping
    popHintsHTML();
    popHints();
    hideHints();

    $('#submitStats').hide();
    resetCards(globals);
});
