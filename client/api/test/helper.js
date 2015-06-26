module = {
  "name": "Helper",
  "description": "Provides various helper functions"
};

/** Return a random RGB compatible number */
function randomRgbColor() {
  return (Math.floor(Math.random() * 255) + 1);
};

/** Return a random number */
function randomNumber() {
  return (Math.ceil(Math.random()*1000));
};