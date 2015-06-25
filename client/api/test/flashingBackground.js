############################
#   Flashing_Background    #
#  Random flashing colors  #
#     include <Helper>     #
############################

/**
 * Flashes the background with random colors
 */
function flashBackgroundColor(range) {

  range.set("BackgroundColor", "rgb(" + randomRgbColor() + "," + randomRgbColor() +", " + randomRgbColor() + ")");

}