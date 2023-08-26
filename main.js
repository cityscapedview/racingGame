var carPic = document.createElement("img");
var carPicLoaded = false;

let carX = 75;
let carY = 75;
let carAng = 0;
let carSpeed = 0;

const GROUNDSPEED_DECAY_MULT = 0.94;
const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.07;

const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
let trackGrid = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 2, 1, 0, 0, 1, 1,
  0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;

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

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  let framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", updateMousePos);

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);

  carPic.onload = function () {
    carPicLoaded = true;
  };
  carPic.src = "akira.png";

  carReset();
};

function updateAll() {
  moveAll();
  drawAll();
}

function carReset() {
  for (let eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

      if (trackGrid[arrayIndex] == TRACK_PLAYERSTART) {
        trackGrid[arrayIndex] = TRACK_ROAD;
        carAng = -Math.PI / 2;
        carX = eachCol * TRACK_W + TRACK_W / 2;
        carY = eachRow * TRACK_H + TRACK_H / 2;
      }
    }
  }
}

function carMove() {
  carSpeed *= GROUNDSPEED_DECAY_MULT;
  if (keyHeld_Gas) {
    carSpeed += DRIVE_POWER;
  }
  if (keyHeld_Reverse) {
    carSpeed -= REVERSE_POWER;
  }
  if (keyHeld_TurnLeft) {
    carAng -= TURN_RATE;
  }
  if (keyHeld_TurnRight) {
    carAng += TURN_RATE;
  }

  carX += Math.cos(carAng) * carSpeed;
  carY += Math.sin(carAng) * carSpeed;
}

function isWallAtColRow(col, row) {
  if (col >= 0 && col < TRACK_COLS && row >= 0 && row < TRACK_ROWS) {
    let trackIndexUnderCoord = rowColToArrayIndex(col, row);
    return trackGrid[trackIndexUnderCoord] == TRACK_WALL;
  } else {
    return false;
  }
}

function carTrackHandling() {
  let carTrackCol = Math.floor(carX / TRACK_W);
  let carTrackRow = Math.floor(carY / TRACK_H);
  let trackIndexUnderCall = rowColToArrayIndex(carTrackCol, carTrackRow);

  if (
    carTrackCol >= 0 &&
    carTrackCol < TRACK_COLS &&
    carTrackRow >= 0 &&
    carTrackRow < TRACK_ROWS
  ) {
    if (isWallAtColRow(carTrackCol, carTrackRow)) {
      carX -= Math.cos(carAng) * carSpeed;
      carY -= Math.sin(carAng) * carSpeed;

      carSpeed *= -0.5;
    } // end of track found
  } // end of valid col and row
} // end of carTrackHandling funcction

function moveAll() {
  carMove();

  carTrackHandling();
}

function rowColToArrayIndex(col, row) {
  return col + TRACK_COLS * row;
}

function drawTracks() {
  for (let eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

      if (trackGrid[arrayIndex] == TRACK_WALL) {
        colorRect(
          TRACK_W * eachCol,
          TRACK_H * eachRow,
          TRACK_W - TRACK_GAP,
          TRACK_H - TRACK_GAP,
          "blue"
        );
      } // end of is this track here
    } // end of for each track
  } // end of eachRow
} // end of drawTracks() func

function drawAll() {
  //clear screen
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //draw car
  // colorCircle(carX, carY, 10, "white");
  if (carPicLoaded) {
    drawBitmapWithRotation(carPic, carX, carY, carAng);
  }

  drawTracks();
}
