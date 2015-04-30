/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */
(function() { "use strict"

  /**
   * File
   *
   * @class File
   * @static
   */
  CORE.File = function() {};

  CORE.File.prototype = CORE.File;

  /**
   * Import a file
   *
   * @method import
   * @static
   */
  CORE.File.prototype.import = function() {
    console.log("Import!");
  };

  /**
   * Export a file
   *
   * @method export
   * @static
   */
  CORE.File.prototype.export = function() {
    var gridData = '"Grid":' + JSON.stringify(CORE.Grid) + ",";
    var CoreSettings = '"Settings":' + JSON.stringify(CORE.Settings);
    var result = JS2PNG.Encode("{" + gridData + CoreSettings + "}", "Filename").toDataURL();
    AJAX.POST(result, "server/base64ToImage.php", function(response) {

      var img = new Image();
          img.src = "server/uploads/" + response;

      CORE.DOM.FileOutput.innerHTML = "";
      CORE.DOM.FileOutput.appendChild(img);
      CORE_UI.MODAL.FileImageOutput.$.style.display = "block";
      /*
      JS2PNG.Decode(img, function(response) {
        console.log(response);
      });*/

    });
  };

}).call(this);