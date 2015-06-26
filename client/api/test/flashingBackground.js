module = {
  "name": "FlashingBackground",
  "description": "Random flashing colors",
  "require": ["Helper"]
};

/**
 * Flashes the background with random colors
 */
function flashBackgroundColor(range) {

  range.set("BackgroundColor", "rgb(" + randomRgbColor() + "," + randomRgbColor() +", " + randomRgbColor() + ")");

};