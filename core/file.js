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

"use strict";

  /**
   * File
   *
   * @class File
   * @static
   */
  CORE.File = function() {};

  CORE.File.prototype = CORE.File;

  /**
   * Collect data
   *
   * @method getData
   * @static
   */
  CORE.File.prototype.getData = function() {

    var cellData = '"Cells":' + JSON.stringify(CORE.Cells) + ",";
    var cellSizes = '"CellSizes":' + JSON.stringify(CORE.Grid.customCellSizes) + ",";
    var cellStack = '"CellStack":' + JSON.stringify(ENGEL.STACK.VAR) + ",";
    var coreSettings = '"CoreSettings":' + JSON.stringify(CORE.Settings) + ",";
    var gridSettings = '"GridSettings":' + JSON.stringify(CORE.Grid.Settings);

    return ("{" + cellData + cellSizes + cellStack + coreSettings + gridSettings + "}");

  };

  /**
   * Import a file
   *
   * @method import
   * @static
   */
  CORE.File.prototype.import = function() {

    var data = JSON.parse(JSON.parse(arguments[0]));

    /** Update resized cells */
    CORE.Grid.customCellSizes = data.CellSizes;

    /** Update grid settings */
    CORE.Grid.Settings = data.GridSettings;

    /** Update used cells */
    CORE.Cells = data.Cells;

    /** Update variable stack */
    ENGEL.STACK.VAR = data.CellStack;

    /** Update everything */
    CORE.Event.resize();

  };

  /**
   * Export a file
   *
   * @method export
   * @static
   */
  CORE.File.prototype.export = function() {

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
  CORE.File.prototype.exportImage = function() {

    AJAX.POST(this.getData(), "server/base64ToImage.php", function(response) {

      var img = new Image();
          img.src = "server/uploads/" + response;

      CORE.DOM.FileOutput.innerHTML = "";
      CORE.DOM.FileOutput.appendChild(img);
      CORE_UI.MODAL.FileImageOutput.$.style.display = "block";

    });

  };