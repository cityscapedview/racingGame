let carPic = document.createElement("img");
let roadPic = document.createElement("img");
let wallPic = document.createElement("img");

let picsToLoad = 3;

function countLoadedImagesandLaunchIfReady() {
  picsToLoad--;
  console.log();
  if (picsToLoad == 0) {
    imageLoadingDoneSoStartGame();
  }
}

function carImageLoad() {
  carPic.onload = countLoadedImagesandLaunchIfReady;
  carPic.src = "akira.png";
}
function trackLoadImages() {
  roadPic.onload = countLoadedImagesandLaunchIfReady;
  wallPic.onload = countLoadedImagesandLaunchIfReady;
  roadPic.src = "track.png";
  wallPic.src = "singleBuilding.png";
}

function loadImages() {
  carImageLoad();
  trackLoadImages();
}
