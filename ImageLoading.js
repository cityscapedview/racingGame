var carPic = document.createElement("img");
var carPicLoaded = false;
let roadPic = document.createElement("img");
let wallPic = document.createElement("img");

function carImageLoad() {
  carPic.onload = function () {
    carPicLoaded = true;
  };
  carPic.src = "akira.png";
}
function trackLoadImages() {
  roadPic.src = "track.png";
  wallPic.src = "singleBuilding.png";
}

function loadImages() {
  carImageLoad();
  trackLoadImages();
}
