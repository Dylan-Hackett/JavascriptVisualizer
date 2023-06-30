let song;
let dusty = [];
let dustyLarge = [];
let dustyExtraLarge = [];
let input;
let defaultButton;
let beginning = false;
let warningDisplayed = false;
let defaultSong = 'deceit.wav'; 
let defaultWindow = document.getElementById('loadDefault')

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  input = select('#fileinput');
  input.changed(loadFile);

  defaultButton = select('#loadDefault');
  defaultButton.mousePressed(loadDefault);
}

function loadFile() {
  if (song) {
    song.stop();
  }

  song = loadSound(input.elt.files[0], () => {
    warningDisplayed = true;
    redraw();
  });
}

function loadDefault() {
  if (song) {
    song.stop();
  }
  defaultWindow.style.display  = 'none'
  song = loadSound(defaultSong, () => {
    warningDisplayed = true;
    redraw();
  });
}
function drawShape(t, indexFunction, rFunction, xFunction, yFunction) {
  beginShape();
  for(let i = 0; i<=180; i++) {
    let index = indexFunction(i);
    let r = rFunction(index);
    let x = xFunction(i, r, t);
    let y = yFunction(i, r);
    point(x, y);
  }
  endShape();
}
function handleParticles(particles, ParticleClass, amplitude) {
  if (particles.length < 1000) { 
    let d = new ParticleClass();
    particles.push(d);
  }
  
  for(let i = particles.length - 1; i >= 0; i--){
    if (!particles[i].edges()){
      particles[i].update(amplitude, amplitude > 220);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function draw() {
  if (warningDisplayed) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Warning: Flashing lights. Click to start. (BRIGHTNESS UP!)", width / 2, height / 2);
    noLoop();
    return;
  }
  
  if (song && !song.isPlaying()) {
    return;
  }

  background(0);  
  stroke(0,255,0); 
  noFill();
  translate(width/2, height/2);
  song.fft.analyze();
  
  let wave = song.fft.waveform();
  let amplitude_mid = song.fft.getEnergy(1000,6000);
  let amplitude = song.fft.getEnergy(20,300);
  let rotation = song.currentTime()*5;
  rotation*=5
  rotate(rotation);

  for (let t = -1; t <= 1; t += 2) {
    drawShape(t,
      i => floor(map(i,0,180,0,wave.length-1)),
      index => map(wave[index]*(.7*Math.abs(amplitude_mid)),0,1,100,650),
      (i, r, t) => (r * -sin(i) * t)*1.3*(.7*Math.abs(amplitude_mid)),
      (i, r) => (r * cos(i*amplitude)%80)*1.3
    );

    drawShape(t,
      i => floor(map(i,0,180,0,wave.length-1))%20,
      index => map(wave[index]*(.7*Math.abs(amplitude_mid)),-1,1,150,350),
      (i, r, t) => (r * -sin(i) * t%80)*2.4,
      (i, r) => (r * cos(i))*1.4
    );

    drawShape(t,
      i => floor(map(i,0,180,0,wave.length-1))%10,
      index => map(wave[index]*(.7*Math.abs(amplitude_mid)),-1,1,150,750),
      (i, r, t) => (r * -sin(i) * t%80)*1.9,
      (i, r) => (r * cos(i))*1.4
    );

    drawShape(t,
      i => floor(map(i,-1,180,1,wave.length-1))%70,
      index => map(wave[index]*(.7*Math.abs(amplitude_mid)),-1,1,10,450),
      (i, r, t) => (r * -sin(i) * t)*2,
      (i, r) => (r * cos(i))*2
    );
  }
  handleParticles(dusty, Dust, amplitude);
  handleParticles(dustyLarge, DustLarge, amplitude);
  handleParticles(dustyExtraLarge, DustExtraLarge, amplitude);
}

function mouseClicked() {
  if (warningDisplayed) {
    warningDisplayed = false;
    song.loop();
    song.fft = new p5.FFT();
    input.remove();
    loop();

  } else if (song && song.isPlaying()) {
    song.pause();
    noLoop();

  } else if (song) {
    song.play();
    loop();
  }
}

class Dust {
  constructor(radiusMultiplier = 1, size = 1){  
    radiusMultiplier = (typeof radiusMultiplier === 'number' && isFinite(radiusMultiplier)) ? radiusMultiplier : 1;
    let randomValue = random(0.0001,0.0001);
    randomValue = (typeof randomValue === 'number' && isFinite(randomValue)) ? randomValue : 0.0001;
    this.position = p5.Vector.random2D().mult(radiusMultiplier);
    this.velocity = createVector(0,0);
    this.accelerate = this.position.copy().mult(randomValue);
    this.alpha = 255; 
    this.size = size;
  }

  update(amplitude, cond){
    let amp = map(amplitude, 0, 255, 0, 5); 
    let randomChange = p5.Vector.random2D().mult(random(0.1)).mult(amp);
    this.accelerate.add(randomChange);
    this.velocity.add(this.accelerate);
    this.position.add(this.velocity);
    if (cond){
      this.position.add(this.velocity);
      this.position.add(this.velocity);
      this.position.add(this.velocity);
    }
    this.alpha -= 0.001; 
  }

  edges(){
    return this.position.x < -width/2 || this.position.x > width/2 || this.position.y < -height/2 || this.position.y > height/2 || this.alpha < 0;
  }

  show() {
    noStroke();
    fill(0,255,0,this.alpha);
    ellipseMode(CENTER);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
}

class DustLarge extends Dust {
  constructor(){
    super(400, 4); 
  }
}
class DustExtraLarge extends Dust {
  constructor(){
    super(550, 6); 
  }
}






