############################
#       Fill_Content       #
#      Random content      #
#     include <Helper>     #
############################

/**
 * Fill sheet range with random content
 */
function fillContent(range) {

  /** Create a new array which holds some new background colors */
  var newValues = [];

  /** Get length of the range */
  var length = range.getLength();

  /** Fill the array with some random content */
  for (var ii = 0; ii < length; ++ii) {
    newValues[ii] = randomNumber();
  }

  /** Change content of the range with a length matching array holding new values */
  range.setValues('Content', newValues);

};