// @pjs preload must be used to preload the image
/* @pjs font="ffscala.ttf"; */
/* @pjs preload="card_back_blue.png, card_back_red.png, 2_of_diamonds.png, 3_of_diamonds.png, 4_of_diamonds.png, 5_of_diamonds.png, 6_of_diamonds.png, 7_of_diamonds.png, 8_of_diamonds.png, 9_of_diamonds.png, 10_of_diamonds.png"; */

NUM_CARDS = 9;

PImage[] images = new PImage[NUM_CARDS  +2];
int imgWidth = 140;
int imgHeight = 190;

int WINDOW_WIDTH = 1300;
int WINDOW_HEIGHT = 500;
int[] cardXPosStart = new int[NUM_CARDS];

//represents index in images array to load
int[] indices = new int[NUM_CARDS];

int hoverCardIndex;
int randIndex = 0;

boolean reset = false;

PFont font;
String wantCardStr;


void setup() {

    //preload images 
    images[0] = loadImage("card_back_blue.png",140,190);
    images[1] = loadImage("card_back_red.png",140,190);

    for(int k = 2; k < images.length; k++) {
        String filename = k.toString() + '_of_diamonds.png';
        images[k] = loadImage(filename,140,190);
    }


    for(int i = 0; i < NUM_CARDS; i++) {
        indices[i] = 0;
        cardXPosStart[i] = i*140;
        }      
    size(WINDOW_WIDTH, WINDOW_HEIGHT);

    //generate random card to find
    randIndex = Math.floor(Math.random() * NUM_CARDS) + 2;

    //load font
    wantCardStr = 'Find the ' + randIndex + ' card!';
    font = loadFont("FFScala.ttf"); 
    textFont(font); 
    text(wantCardStr, 50, 215);
    
}


//called continuously
void draw() {
    for (int i = 0; i < NUM_CARDS; i++) {
     image(images[indices[i]], cardXPosStart[i], 0, imgWidth, imgHeight);
     }
    hoverCardIndex = Math.floor(mouseX / imgWidth);

 //   if (mouseY <= imgHeight)
       // rect(cardXPosStart[hoverCardIndex], 0, imgWidth, imgHeight);
}

void mousePressed() {
    hoverCardIndex = Math.floor(mouseX / imgWidth);

    if (mouseY <= imgHeight) {
        if (indices[hoverCardIndex] == 0)
            indices[hoverCardIndex] = 2 + hoverCardIndex;
        else
            indices[hoverCardIndex] = 0;
    }

    if (indices[hoverCardIndex] == randIndex) {
        text("You found it! Click anywhere to reset.", 60, 230);
        reset = true;
        }

  //  else if (reset) {
     //   resetCards();
  //  }



    //println("index[hoverCardIndex+2] is " + (2+hoverCardIndex).toString());

}

void resetCards() {
    for (int i = 0; i < NUM_CARDS; i++) {
        indices[i] = 0;
     }   


}






