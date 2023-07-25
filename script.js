// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, textFont, loadFont,
          fontItalic, keyPressed, SPACEBAR, clear, frameRate, preload, noFill, osc, midiToFreq, 
          getAudioContext, round, tint, noTint, pmouseX, pmouseY, mouseOver, createButton,
          p5, input, createInput, floor, map, mouseButton, LEFT, triangle*/

let backgroundColor,
  notesImg,
  pianoImg,
  imgWidth,
  imgHeight,
  octaveIsChosen,
  keyNote,
  played,
  returnButton,
  randomNote,
  storage;

let choice = "nothing";
let correct = true;
let winCount = 0;

//  [C, C#, D,  D#, E,   F, F#, G,  G#, A,  A#, B]
let notes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // notes will store the note value of the chosen octave
let octave1 = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]; //C2
let octave2 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]; //C3
let octave3 = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]; //C4
let octave4 = [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]; //C5
let octave5 = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]; //C6

const keyWidth = 400;
const keyHeight = 350;

function preload() {
  notesImg = loadImage(
    "https://cdn.glitch.com/593e6173-2f11-4d2c-aaf6-5ebe62a079bb%2Fnotes.png?v=1595703329809"
  );
  pianoImg = loadImage(
    "https://cdn.glitch.com/593e6173-2f11-4d2c-aaf6-5ebe62a079bb%2FpianoKeyBoard.png?v=1595868436326"
  );

  osc = new p5.SinOsc();
  osc.start();
  osc.amp(0); // when the program starts there is no noise
}

function setup() {
  // Canvas & color settings
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 10;
  randomNote = 0;
  octaveIsChosen = false; // if true, draw mini keyboard for people to input answers
  keyNote = 0; // stores the value of what note (position in the octave array) in an octave is played
  played = false;
  returnButton = createButton("Return to Home");
  returnButton.mouseClicked(setupAndDisplay);
  returnButton.position(50, height - 100);
}

function draw() {
  background(backgroundColor);
  intro();
  keyPressed();
  if (octaveIsChosen && played) {
    drawKeyBoard(notes);
    notePlayed(notes);
  }
}

function intro() {
  background(10);
  noStroke();
  fill(217, 1, 86);
  textSize(100);
  textFont("Times New Roman");
  text("WELCOME", 50, height / 2 - 50);
  textSize(15);
  textFont("Times New Roman");
  text(
    "In this website, you will be able to practice your pitch in an octave of your choice.",
    100,
    height / 2
  );
  text(
    "After selecting your octave, a note will be played which you will have to identify.",
    100,
    height / 2 + 20
  );

  text("Click anywhere to get started.", width / 2 - 75, height - 100);

  fill(0);
  image(notesImg, width / 2 + 50, height / 2 - 150, 600, 300);
}

function mousePressed() {
  getAudioContext().resume();
  octaveDisplay();

  if (octaveIsChosen) {
    if (
      mouseY <= height / 2 + ((keyHeight - 1) * 7) / 12 &&
      mouseY >= height / 2 &&
      mouseX >= 250 &&
      mouseX < keyWidth + 250
    ) {
      keyNote = floor(map(mouseX, 250, keyWidth + 250, 0, octave1.length));
    } else if (mouseY > ((keyHeight - 1) * 7) / 12) {
      keyNote = floor(map(mouseX, 250, keyWidth + 250, 0, 7));
      if (keyNote === 1) {
        keyNote = 2;
      } else if (keyNote === 2) {
        keyNote = 4;
      } else if (keyNote === 3) {
        keyNote = 5;
      } else if (keyNote === 4) {
        keyNote = 7;
      } else if (keyNote === 5) {
        keyNote = 9;
      } else if (keyNote === 6) {
        keyNote = 11;
      }
    }

    console.log("keyNote in the mousepressed function");
    console.log(keyNote);

    if (
      mouseX >= 250 &&
      mouseX < keyWidth + 250 &&
      mouseY >= height / 2 &&
      mouseY <= height / 2 + keyHeight
    ) {
      playNote(notes[keyNote]);
    }
  }

  if (correct == false && octaveIsChosen && played) {
    notePlayed(notes);
  }
}

function octaveDisplay() {
  background(backgroundColor);
  fill(0);
  imgWidth = 240;
  imgHeight = 200;

  //tint(0, 153, 204, 126);
  image(pianoImg, 50, 90, 240, 200);
  image(pianoImg, 290, 90, 240, 200);
  image(pianoImg, 530, 90, 240, 200); //C4 octave
  image(pianoImg, 770, 90, 240, 200);
  image(pianoImg, 1010, 90, 240, 200);

  chooseOctave();
}

function setupAndDisplay() {
  console.log(backgroundColor);
  setup();
  intro();
}

function playNote(n) {
  getAudioContext().resume();
  osc.freq(midiToFreq(n));
  osc.fade(0.5, 0.2);
}

function chooseOctave() {
  // Display
  textSize(40);
  fill(98);
  text("Octaves: select an octave to hear C", 50, 60);

  let i;
  rect(60, 300, 230, 20, 20);

  for (i = 60; i < 1070; i += 240) {
    rect(i, 300, 230, 20, 20);
  }

  textSize(15);
  fill(0);
  let t = 145;
  for (i = 2; i < 7; i++) {
    text(`Octave: C${i}`, t, 315);
    t = t + 240;
  }
  noFill();

  fill(225);
  colorChange();

  text(`You Selected: ${choice}`, 50, height - 420);

  randomNotePlayed(notes);
}

function colorChange() {
  // When an octave is selected the c note from that
  // octave is played

  if (60 < mouseX && mouseX < 290 && 300 < mouseY && mouseY < 320) {
    tint(0, 153, 204, 126);
    image(pianoImg, 50, 90, 240, 200);
    noTint();
    playNote(octave1[0]);
    notes = octave1;
    octaveIsChosen = true;
    choice = "C2";
  } else if (300 < mouseX && mouseX < 530 && 300 < mouseY && mouseY < 320) {
    tint(0, 153, 204, 126);
    image(pianoImg, 290, 90, 240, 200);
    noTint();
    playNote(octave2[0]);
    notes = octave2;
    octaveIsChosen = true;
    choice = "C3";
  } else if (540 < mouseX && mouseX < 770 && 300 < mouseY && mouseY < 320) {
    tint(0, 153, 204, 126);
    image(pianoImg, 530, 90, 240, 200);
    noTint();
    playNote(octave3[0]);
    notes = octave3;
    octaveIsChosen = true;
    choice = "C4";
  } else if (780 < mouseX && mouseX < 1010 && 300 < mouseY && mouseY < 320) {
    tint(0, 153, 204, 126);
    image(pianoImg, 770, 90, 240, 200);
    noTint();
    playNote(octave4[0]);
    notes = octave4;
    octaveIsChosen = true;
    choice = "C5";
  } else if (1020 < mouseX && mouseX < 1250 && 300 < mouseY && mouseY < 320) {
    tint(0, 153, 204, 126);
    image(pianoImg, 1010, 90, 240, 200);
    noTint();
    playNote(octave5[0]);
    notes = octave5;
    octaveIsChosen = true;
    choice = "C6";
  }
}

function randomNotePlayed(notes) {
  
  // create the shape that the user presses to play the note that they are trying to match
  rect(780, 400, 120, 90, 20);
  fill(10);
  triangle(810, 425, 810, 475, 840, 450);
  text("play sound", 810, 417);
  fill(225);
  text("Click The Play Button to Start", 760, 390);

  if (mouseX > 780 && mouseX < 900 && mouseY > 400 && mouseY < 490 && correct) {
    played = true;
    randomNote = random(0, notes.length - 1);
    randomNote = round(randomNote);
    storage = randomNote;

    playNote(notes[randomNote]);
    osc.fade(0.5, 0.5);

    correct = false;
  } else {
    noteReplay(notes);
  }

  if (octaveIsChosen && played) {
    drawKeyBoard(notes);
  }
}

function noteReplay(notes) {
  if (
    correct == false &&
    mouseX > 780 &&
    mouseX < 900 &&
    mouseY > 400 &&
    mouseY < 490
  ) {
    playNote(notes[storage]);
  }
}

function notePlayed(notes) {
  let previousWinCount = winCount;

  // console.log("keyNote in the notePlayed function")
  // console.log(keyNote)

  // console.log('storage value')
  //  console.log(storage)
  if (notes[keyNote] == notes[storage]) {
    console.log("entered win check");
    winCount = winCount + 1;
    correct = true;
    textSize(40);
    text(`Number correct so far: ${winCount}`, 760, 590);
    textSize(15);
    randomNotePlayed(notes);
  } else {
    correct = false;
    textSize(20);
    text("play back this note on the keyboard", 760, 590);
    textSize(15);
    noteReplay(notes);
  }
}

function mouseReleased() {
  osc.fade(0, 0.5);
}

function drawKeyBoard(notes) {
  let w = keyWidth / 7;

  for (let i = 0; i < notes.length; i++) {
    let x = i * w;

    let check = floor(map(mouseX, 250, keyWidth + 250, 0, octave1.length));

    if (
      mouseX > x + 250 &&
      mouseX < x + w + 250 &&
      mouseY < height &&
      mouseY >= height / 2 &&
      (check != 1 && check != 3 && check != 6 && check != 8 && check != 10)
    ) {
      console.log("highlighting check");
      if (mouseIsPressed) {
        fill(30, 255, 200);
      } else {
        fill(127);
      }
    } else {
      fill(255);
    }
    // Draw the key
    if (i != 1 || i != 3 || i != 6 || i != 8 || (i != 10 && i <= 7)) {
      if (i < 7) {
        rect(x + 250, height / 2, w - 1, keyHeight - 1);
      }
    }
    if (i == 1 || i == 3 || i == 6 || i == 8 || i == 10) {
      fill(0);
      rect(
        (x * 7) / 12 + 250,
        height / 2,
        (w * 7) / 12,
        ((keyHeight - 1) * 7) / 12
      );
    }
  }
}
