let sequence1, square;
let melody1 = ["C3", ["E3", "G3", "D3", "C3"],
"A3", "B2", "C2", "E3",
["A2", "G2"],
 "C4"];
let colors = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#800080', // Purple
  '#A52A2A', // Brown
  '#FFFFFF', // White
  '#000000'  // Black
];
let selectedColor = colors[0]; // Initial selected color
let squareSize = 35;
let isDrawing = false;
let prevX, prevY;

function setup() {
  createCanvas(700, 500); // Main canvas wider
  background(255); // Set background to white
  drawColorPalette(); // Drawing the color palette on the main canvas
  
  Tone.start();
  Tone.Transport.bpm.value = 205;
  Tone.Transport.timeSignature = [3,4];

  let clearButton = createButton('Clear');
  clearButton.position(10, height + 20);
  clearButton.mousePressed(clearCanvas); 

  let fillButton = createButton('Fill');
  fillButton.position(70, height + 20);
  fillButton.mousePressed(fillCanvas);


  square = new Tone.Synth({
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.4,
      decay: 0.2,
      release: 0.3
    }
  }).toDestination();

  sequence1 = new Tone.Sequence(function(time, note){
    square.triggerAttackRelease(note,0.8);
  }, melody1, "8n");
  sequence1.loop = true;
  sequence1.playbackRate = 1;

  Tone.Transport.start();
}

function draw() {
  if (isDrawing && mouseX > 50) { // Ensure drawing only on the main canvas
    strokeWeight(5); // Thickness of the line
    stroke(color(selectedColor));
    line(prevX, prevY, mouseX, mouseY);
    prevX = mouseX;
    prevY = mouseY;
  } else {
    // Draw instruction text when not drawing
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Click for paint and sound!', width * (3/5), height * (3/5));
  }
}

function drawColorPalette() {
  for (let i = 0; i < colors.length; i++) {
    fill(color(colors[i]));
    rect(10, i * squareSize, squareSize, squareSize);
  }
}

function mouseClicked() {
  if (mouseX > 10 && mouseX < squareSize + 10 && mouseY > 0 && mouseY < colors.length * squareSize) {
    let index = Math.floor(mouseY / squareSize);
    selectedColor = colors[index];
  }
}

function mousePressed() {
  if (mouseX > 50 && mouseX < width && mouseY > 0 && mouseY < height) { // Ensure drawing only on the main canvas
    isDrawing = true;
    prevX = mouseX;
    prevY = mouseY;
    sequence1.start();
  }
}

function mouseReleased() {
  isDrawing = false;
  sequence1.stop();
}

function clearCanvas() {
  // Clear only the drawing area
  fill(255);
  rect(50, 0, width - 50, height);
  // Start the sequence again
  sequence1.start();
  // Play the "B2" note
  square.triggerAttackRelease("B2", 0.8);
}

function fillCanvas() {
  // Fill the entire canvas with the selected color
  fill(selectedColor);
  rect(50, 0, width - 50, height);
  // Play the "C3" note
  square.triggerAttackRelease("C3", 0.8);
}