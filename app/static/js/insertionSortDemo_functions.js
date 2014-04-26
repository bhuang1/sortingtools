/**
 * Moves elements inside an array from one location to another.
 * @param from - source location
 * @param to   - destination
 */
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};


/*
 * Automatically performs selection sort.
 * @param cards - the list of cards
 * @return The steps needed to sort the cards
 */
function autoSort(cards) {
    var steps = ['consider:0', 'markSorted:0'];
    // First element not-inside the sorted subarray
    var sortedArrayEnd = 1;  
    var length = cards.length;

    for (var i = 1; i < length; i++) {
        steps.push('consider:'+i);

        // Find the insert location of card
        for (var j = 0; j < i; j++) {
            if (cards[j] > cards[i]) {
                break;
            }
        }

        steps.push('move:'+i+';to;'+j);
        steps.push('markSorted:'+j);
        cards.move(i, j);
        sortedArrayEnd++;
    }
    return steps;
}


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
            var select = '#' + globals.cardArray[params].num;  // race condition
            $(select).css({
                backgroundImage: 'url(' + globals.cardArray[params].frontFace + ')'
            });
        // Flip it back over
        } else if (css === "flip") {
            var select = '#' + globals.cardArray[params].num;  // race condition
            $(select).css({
                backgroundImage: 'url(' + globals.cardArray[params].normalBack + ')'
            });
        // Set card as sorted
        } else if (css == "sort") {
            var select = '#' + globals.cardArray[params].num;
            spacifyCards(globals);
            //$(selector).css({
            //    backgroundImage:'url(' + globals.cardArray[params].sortedBack + ')'
            //});
        } else if (css == "move") {
            var to = params.split(';')[2];
            var from = params.split(';')[0];
            var select = '#' + globals.cardArray[from].num;
            $(select).insertBefore($('#' + globals.cardArray[to].num));
            // Update globals.cardArray
            globals.cardArray.move(from, to);
        }

        // Animation
        $(select).animate(props, next);
    });
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
 * Mark a card as the new minimum.
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function markMin(globals, params, q) {
    animToQueue(q, '#' + globals.cardArray[params].num,
            {top:globals.SELECT_MOVE}, "min", globals, params);
}


/**
 * Unmark a card as the minimum.
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function unmarkMin(globals, params, q) {
    animToQueue(q, '#' + globals.cardArray[params].num,
            {top:'0px'}, "unmin", globals, params);
}


/**
 * Mark a card as sorted.
 * @param globals - the globals
 * @param params  - the parameter of the string command
 * @param q       - the queue of animations
 */
function markSorted(globals, params, q) {
    animToQueue(q, '#' + globals.cardArray[params].num,
            {top:'0px'}, "sort", globals, params);
}


/**
 * Moves a card.
 * @param globals - the globals
 * @param params  - the parameter of the string command
 * @param q       - the queue of animations
 */
function move(globals, params, q) {
    var from = params.split(';')[0];
    var to = params.split(';')[2];
    animToQueue(q, '#' + globals.cardArray[from].num,
            {'left':globals.SPACE * to + globals.PADDING},
            "move", globals, params);
}
