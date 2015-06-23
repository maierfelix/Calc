/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * File
   *
   * @class File
   * @static
   */
  NOVAE.File = function() {};

  NOVAE.File.prototype = NOVAE.File;

  /**
   * Collect data
   *
   * @method getData
   * @static
   */
  NOVAE.File.prototype.getData = function() {

    var cellData = '"Cells":' + JSON.stringify(NOVAE.Cells) + ",";
    var cellSizes = '"CellSizes":' + JSON.stringify(NOVAE.Grid.customCellSizes) + ",";
    var cellStack = '"CellStack":' + JSON.stringify(ENGEL.STACK.VAR) + ",";
    var coreSettings = '"CoreSettings":' + JSON.stringify(NOVAE.Settings) + ",";
    var gridSettings = '"GridSettings":' + JSON.stringify(NOVAE.Grid.Settings);

    return ("{" + cellData + cellSizes + cellStack + coreSettings + gridSettings + "}");

  };

  /**
   * Import a file
   *
   * @method import
   * @static
   */
  NOVAE.File.prototype.import = function() {

    var data = JSON.parse(JSON.parse(arguments[0]));

    /** Update resized cells */
    NOVAE.Grid.customCellSizes = data.CellSizes;

    /** Update grid settings */
    NOVAE.Grid.Settings = data.GridSettings;

    /** Update used cells */
    NOVAE.Cells = data.Cells;

    /** Update variable stack */
    ENGEL.STACK.VAR = data.CellStack;

    /** Update everything */
    NOVAE.Event.resize();

  };

  /**
   * Export a file
   *
   * @method export
   * @static
   */
  NOVAE.File.prototype.export = function() {

    var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";

    var json = JSON.stringify(this.getData()),
        blob = new Blob([json], {type: "application/json"}),
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "Untitled.nvc";
        a.click();
        window.URL.revokeObjectURL(url);
  };

  /**
   * Export a image
   *
   * @method exportImage
   * @static
   */
  NOVAE.File.prototype.exportImage = function() {

    AJAX.POST(this.getData(), "server/base64ToImage.php", function(response) {

      var img = new Image();
          img.src = "server/uploads/" + response;

      NOVAE.DOM.FileOutput.innerHTML = "";
      NOVAE.DOM.FileOutput.appendChild(img);
      NOVAE_UI.MODAL.FileImageOutput.$.style.display = "block";

    });

  };