let canvas, canvasContext;

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

let keyHeld_Gas = false;
let keyHeld_Reverse = false;
let keyHeld_TurnLeft = false;
let keyHeld_TurnRight = false;

let mouseX = 0;
let mouseY = 0;

function setupInput() {
  canvas.addEventListener("mousemove", updateMousePos);

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);
}

function updateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  // cheat / hack to test car in any position
  // carX = mouseX;
  // carY = mouseY;
  // carSpeedX = 4;
  // carSpeedY = -4;
}

function keyPressed(evt) {
  // console.log("evt.keyCode");
  if (evt.keyCode == KEY_LEFT_ARROW) {
    keyHeld_TurnLeft = true;
  }
  if (evt.keyCode == KEY_RIGHT_ARROW) {
    keyHeld_TurnRight = true;
  }
  if (evt.keyCode == KEY_UP_ARROW) {
    keyHeld_Gas = true;
  }
  if (evt.keyCode == KEY_DOWN_ARROW) {
    keyHeld_Reverse = true;
  }
}

function keyReleased(evt) {
  if (evt.keyCode == KEY_LEFT_ARROW) {
    keyHeld_TurnLeft = false;
  }
  if (evt.keyCode == KEY_RIGHT_ARROW) {
    keyHeld_TurnRight = false;
  }
  if (evt.keyCode == KEY_UP_ARROW) {
    keyHeld_Gas = false;
  }
  if (evt.keyCode == KEY_DOWN_ARROW) {
    keyHeld_Reverse = false;
  }
}
