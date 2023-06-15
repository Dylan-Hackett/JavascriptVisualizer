let song;
let dusty = [];
let input;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  // Get the file input element
  input = select('#fileinput');

  // Attach an event listener that calls loadFile when the user selects a file
  input.changed(loadFile);
}

function loadFile() {
  // If there's a previous song playing, stop it
  if (song) {
    song.stop();
  }

  // Load the selected file
  song = loadSound(input.elt.files[0], songLoaded);
}

function songLoaded() {
  song.loop();

  // Create a new FFT analyzer
  song.fft = new p5.FFT();

  // Remove the file input
  input.remove();
}


function draw() {
  if (!song) {
    // If no song is loaded yet, don't try to visualize it
    return;
  }

  background(0);
  stroke(0,240,15);
  noFill();

  translate(width/2, height/2);

  song.fft.analyze();
  let amplitude = song.fft.getEnergy(20,300);
  let wave = song.fft.waveform();
  let rotation = song.currentTime();
  rotation *= 5;
  rotate(rotation);

  for (let t = -1; t<= 1; t+=2){
    // First shape
    beginShape();
    for(let i = 0; i<=80; i++) {
      let index = floor(map(i,0,180,0,wave.length-1));
      let r = map(wave[index],0,1,10,350);
      let x = (r * -sin(i) * t)*1.3;
      let y = (r * cos(i)%80)*1.3;
      point(x,y);
    }
    endShape();

    // Second shape
    beginShape();
    for(let i = 0; i<=180; i++) {
      let index = floor(map(i,0,180,0,wave.length-1))%20;
      let r = map(wave[index],-1,1,150,350);
      let x = (r * -sin(i) * t%80)*2.4;
      let y = (r * cos(i))*1.4;
      vertex(x,y);
    }
    endShape();

    // Third shape
    beginShape();
    for(let i = 0; i<=180; i++) {
      let index = floor(map(i,0,180,0,wave.length-1))%10;
      let r = map(wave[index],-1,1,150,350);
      let x = (r * -sin(i) * t%80)*1.9;
      let y = (r * cos(i))*1.4;
      point(y,x);
    }
    endShape();

    // Fourth shape
    beginShape();
    for(let i = 0; i<=180; i++) {
      let index = floor(map(i,-1,180,1,wave.length-1))%70;
      let r = map(wave[index],-1,1,10,350);
      let x = (r * -sin(i) * t)*2.;
      let y = (r * cos(i))*2.;
      point(x,y);
    }
    endShape();
  }
  if (dusty.length < 1000) { // Limit particle count
    let d = new Dust();
    dusty.push(d);
  }

  for(let i = dusty.length - 1; i >= 0; i--){
    if (!dusty[i].edges()){
      dusty[i].update(amplitude > 220); // use 'amplitude' here instead of 'amp'
      dusty[i].show();
    } else {
      dusty.splice(i, 1);
    }
  }
}

class Dust {
  constructor(){
    this.position = p5.Vector.random2D().mult(250);
    this.velocity = createVector(0,0);
    this.accelerate = this.position.copy().mult(random(0.0001,0.0001));
  }

  update(cond){
    this.velocity.add(this.accelerate);
    this.position.add(this.velocity);
    if (cond){
      this.position.add(this.velocity);
      this.position.add(this.velocity);
      this.position.add(this.velocity);
    }
  }

  edges(){
    return this.position.x < -width/2 || this.position.x > width/2 || this.position.y < -height/2 || this.position.y > height/2;
  }

  show(){
    noStroke();
    fill(0,240,105);
    ellipse(this.position.x,this.position.y, 4);
  }
}

function mouseClicked() {
  if (song && song.isPlaying()) {
    song.pause();
    noLoop();
  } else if (song) {
    song.play();
    loop();
  }
}
