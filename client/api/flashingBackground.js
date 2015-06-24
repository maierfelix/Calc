/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

/**
 * Flashes the background with random colors
 */
function flashingBackground() {

  /** Create a new range */
  var range = new sheet.Range("A1:S50");

  /** Direct range property change */
  var value1 = Math.floor(Math.random() * 255) + 1;
  var value2 = Math.floor(Math.random() * 255) + 1;
  var value3 = Math.floor(Math.random() * 255) + 1;

  range.set("BackgroundColor", "rgb(" + value1 + "," + value2 +", " + value3 + ")");

  /** Redraw the sheet, since changes were made */
  sheet.redraw();

}

flashingBackground();

setInterval(flashingBackground, 1000);