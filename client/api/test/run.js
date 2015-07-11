module = {
  "name": "MainScript",
  "description": "The main script",
  "import": ["Helper", "FlashingBackground", "FillContent"]
};

/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

/** Flash the background frequently */
setInterval(function() {

  /** Refresh view range on each interval step */
  var range = new sheet.Range(sheet.getView());

  flashBackgroundColor(range);

  fillContent(range);

  /** Redraw the sheet, since changes were made */
  sheet.redraw();

}, 1000);

/** Resize grid to a pixel raster */
(function() {

  /** Resize all columns */
  var range = new sheet.Range(sheet.getView());

  range.resizeColumns(-80);

  range.resizeRows(-5);

  /** Redraw the sheet */
  sheet.redraw();

})();