# JavascriptVisualizer
Audio Reactive Evil Eye Visualizer
The Evil Eye Visualizer is an audio visualization application that creates a captivating visual spectacle based on the frequencies and amplitudes in an audio file. It utilizes the p5.js library and features a spectrum analyzer built with Fast Fourier Transform algorithms.

How it works
The visualizer reads the audio file provided by the user and analyzes the waveform and energy across different frequency bands. It then generates a series of dynamic particles ("dust") that move and transform according to the energy levels in the audio file.

Setup and Usage
Clone this repository or download the source code.

Open the HTML file in a web browser.

You will be presented with an upload button, use it to select the audio file from your local machine.

Click anywhere on the screen to start the audio playback and visualizer. If you want to pause the playback and visualizer, just click on the screen again.

Warning: This program uses flashing lights that may be intense for some users.

Code Explanation
The main script (usually contained in a sketch.js file) controls the setup, drawing and interactivity of the program. Here are the core functions:

setup(): This function is called once when the program starts. It's used to define initial environment properties such as screen size and input events and to load the audio file.

draw(): This function is executed after setup(), and it runs continuously until the program is stopped or noLoop() is called. It handles the rendering of particles and updates the animation based on the music.

handleParticles(): This function is responsible for creating, updating and removing particles.

drawShape(): This function is used to draw the shape of the particles on the canvas.

The Dust, DustLarge, and DustExtraLarge classes represent the particles that are drawn on the screen. They contain methods for updating the position of the particles based on the music's amplitude, checking whether the particles have hit the edges of the screen, and rendering the particles.
