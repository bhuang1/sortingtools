$(document).ready(function () {
    /* Globals that configure state space */
    function Globals() {
        this.SELECT_MOVE = 30,
        this.SELECT_SPEED = 100,
        this.WINDOW_WIDTH =  $(window).width(),
        this.NUM_CARDS =  13,
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

    // Create instructions
    var nums = [];
    for (var i = 0; i < globals.cardArray.length; i++) {
        nums.push(globals.cardArray[i].num);
    }
    var instructions = autoSort(nums, globals.targetValue);


    $('#hintButton').click(function() {
        if ($(this).text() == 'Restart') {
            window.location.reload();
        } else {
            // Disable until animation finishes
            $(this).prop('disabled', true);
            animate_cards(instructions, globals);
            $(this).prop('disabled', false);
        }
    });
});
