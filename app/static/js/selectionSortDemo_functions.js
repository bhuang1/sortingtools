/**
 * Removes an element from an array.
 */
Array.prototype.remove= function() {
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
}

/*
 * Automatically performs selection sort.
 * @param cards - the list of cards
 * @return The steps needed to sort the cards
 */
function autoSort(cards) {
    var steps = [];
    var toInsert = 0;
    var currentMin = Number.MAX_VALUE;
    var minIndex = Number.MAX_VALUE;

    var length = cards.length;
    for (var i = 0; i < length; i++) {
        // Find the minimum
        for (var j = toInsert; j < length; j++) {
            steps.push('consider:'+j);
            if (cards[j] < currentMin) {
                if (minIndex != Number.MAX_VALUE) {
                    steps.push('unmarkMin:'+minIndex)
                }
                steps.push('markMin:'+j);
                currentMin = cards[j];
                minIndex = j;
            }
            steps.push('unconsider:'+j);
        }

        // Move min to correct place
        steps.push('move:'+minIndex+';to;'+toInsert);
        steps.push('markSorted:'+minIndex);
        cards.remove(cards[minIndex]);
        cards.splice(toInsert, 0, currentMin);
        cards.join();
        toInsert++;
        currentMin = Number.MAX_VALUE;
        minIndex = Number.MAX_VALUE;
    }
    return steps;
}


/**
 * Adds animations to a queue.
 * @param theQueue       - the queue to which animations are added
 * @param selector       - the jQuery selector
 * @param animationProps - what animation to perform
 */
function animToQueue(theQueue, selector, animationprops) {
    theQueue.queue(function(next) {
        $(selector).animate(animationprops, next);
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
        if (typeof fn === 'function' && fn != undefined) {
            console.log('index: ' + i + ' for real instructions: ' + instructions[i]);
            console.log('index: ' + i + ' for real fn: ' + fn);
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
    animToQueue(q, '#' + params, {top:'-=' + globals.SELECT_MOVE});
}


/**
 * Stop considering a card
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function unconsider(globals, params, q) {
    animToQueue(q, '#' + params, {top:'0px'});
}

/**
 * Mark a card as the new minimum.
 * @param globals - the globals
 * @param params  - the parameters of the string command
 * @param q       - the queue of animations
 */
function markMin(global, params, q) {
}
