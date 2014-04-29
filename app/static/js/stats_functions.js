/**
 * Tracks sorting statistics like memory and operation count.
 * Defines common functions used for all stat tracking.
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
 * Set HTML to the new memory value.
 * @param globals - object containing global variables
 */
function setNewMem(globals) {
    $("#mem").val(globals.mem);
}

/**
 * Increment operations performed.
 * @param globals - object containing global variables
 */
function incrementOps(globals){
    globals.ops++;
    $("#ops").val(globals.ops);
}

/**
 * Set new maximum memory usage.
 * @param globals - object containing global variables
 */
function maxMem(globals) {
    globals.mem = Math.max(globals.totFlip, globals.mem);
}
