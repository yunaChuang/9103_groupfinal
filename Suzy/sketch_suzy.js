let doveImage;
let bgColor;

function preload() {
  doveImage = loadImage('assets/dovefinal.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(255);
  imageMode(CENTER);
}

function draw() {
  background(bgColor);

  // 显示鸽子图片在画布中心
  image(doveImage, width / 2, height / 2, 200, 150);

  // 橄榄枝跟随鼠标
  stroke(34, 139, 34);
  strokeWeight(3);
  line(mouseX, mouseY, mouseX + 30, mouseY + 10);
  fill(34, 139, 34);
  ellipse(mouseX + 10, mouseY + 5, 6, 12);
  ellipse(mouseX + 20, mouseY + 7, 6, 12);
}

function mousePressed() {
  // 点击变换背景色
  bgColor = color(random(200, 255), random(200, 255), random(200, 255));
}
