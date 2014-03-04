# sortingtools

## Purpose

This is a website designed to teach sorting to new students.

Presenting with a set of sorting cards, the students must sort them using the algorithm currently selected.

There are three play styles:

* Demo - This is merely to illustrate the concept of the sort. No input is required from the user.
* Assisted - A smaller set of features where all non-optimal moves are disabled. This helps drill the concept of how to sort really works.
* Manual - Most moves are enabled. A counter of operations and memory used are also keeping track to see if the user has sorted with optimality.

A variety of sorting algorithms are supported with new ones being added.

In order to be easily integrated into lectures, we have also developed an iFrame model which is a stripped down verison without the menu that only has the exercise at hand. Thus, students can easily solve the puzzles on the lecture page itself.

Often times instructors may wish to gauge the class's understanding of a particular sorting algorithm. For this purpose, students can send their results back to the database, and the instructor can take a glance at how many students sorted within the optimal number of operations.

## Technologies Used

Front end:

* JQuery 2.0.2
* JQuery UI 1.10.3
* Bootstrap 3.1.1

Back end:

* Python Flask
* SQLite
