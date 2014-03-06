/**
 * Handles all pseudo-code turnstyle / popup functions
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
 * Links the popover command to the hint button.
 */
function popHints() {
    $('#hintButton').popover();
}

/****
 * Set the HTML of the popover.
 */
function popHintsHTML() {
    $('#hintButton').popover({
        html: true,
        content: $('#popover_content_wrapper').html()
    });
}

/**
 * Hide alert upon pressing close.
 */
function hideHints() {
    $("[data-hide]").on("click", function(){
        $("." + $(this).attr("data-hide")).hide();
    });
}
