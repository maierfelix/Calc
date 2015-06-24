/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

/** Create a new range */
var range = new sheet.Range('A1:Z10000');

/** Create a new array which holds some new background colors */
var newValues = [];

/** Get length of the range */
var length = range.getLength();

/** Fill the array with some random content */
for (var ii = 0; ii < length; ++ii) {
  newValues[ii] = Math.ceil(Math.random()*1000);
}

/** Change content of the range with a length matching array holding new values */
range.setValues('Content', newValues);

/** Redraw the sheet, since changes were made */
sheet.redraw();