########################################################
#                       MainScript                     #
#  include<Helper, Flashing_Background, Fill_Content>  #
########################################################

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