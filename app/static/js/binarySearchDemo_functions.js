/**
 * Adds animations to a queue.
 * @param theQueue       - the queue to which animations are added
 * @param selector       - the jQuery selector
 * @param props          - what animation to perform
 * @param css            - which CSS change to perform between animations
 * @param globals        - the global objects
 * @param params         - the parameters for animation
 */
function animToQueue(theQueue, selector, props, css, globals, params) {
    theQueue.queue(function(next) {
        // CSS changes before animation

        // Reveal a card
        if (css === "reveal") {
            $(selector).css({
                backgroundImage: 'url(' +
                                     globals.cardArray[params].frontFace + ')'
            });
        // Flip it back over
        } else if (css === "flip") {
            $(selector).css({
                backgroundImage: 'url(' +
                                     globals.cardArray[params].normalBack + ')'
            });
        // Display arrow
        } else if (css == "arrow") {
            $(selector).show();
        }

        // Animation
        $(selector).animate(props, next);
    });
}


/*
 * Automatically performs binary search.
 * @param cards - the list of cards
 * @param goal  - the card to be found
 * @param return The stps needed to sort the cards
 */
function autoSort(cards, goal) {
    var steps = [];
    var start = 0;
    var end = cards.length;
    var guess = Math.floor((end + start)/2);
    var steps = ['consider:'+guess]
    for ( ; cards[guess] != goal; ) {
        if (cards[guess] > goal) {
            steps.push('arrow:l'+guess);
            end = guess;
        } else {
            steps.push('arrow:r'+guess);
            start = guess;
        }
        steps.push('unconsider:'+guess);
        guess = Math.floor((end + start)/2);
        steps.push('consider:'+guess);
    }

    return steps;
}


/**
 * Animates the cards
 * @param instructions - the list of instructions to do animations
 * @param globals      - the globals
 */
function animate_cards(instructions, globals) {
    var q = $({});

    for (var i = 0; i < instructions.length; i++) {
        var inst = instructions[i].split(':')[0];
        var params = instructions[i].split(':')[1];
        var fn = window[inst];
        if (typeof fn === 'function') {
            fn(globals, params, q);
        } else {
            console.log('Error- ' + inst + ' not a function');
        }
    }

    // Set button to 'Restart' at very end
    $('#hintButton').text('Restart').button('refresh');
}


/**
 * Moves a card up to mimic mouseover.
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function consider(globals, params, q) {
    animToQueue(q, '#' + globals.cardArray[params].num,
            {top:'-=' + globals.SELECT_MOVE}, "reveal", globals, params);
}


/**
 * Stop considering a card
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function unconsider(globals, params, q) {
    animToQueue(q, '#' + globals.cardArray[params].num,
            {top:'0px'}, "flip", globals, params);
}


/**
 * Display an arrow to guide the user.
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function arrow(globals, params, q) {
    animToQueue(q, '#' + params, {top:'0px'}, "arrow", globals, params);
}
