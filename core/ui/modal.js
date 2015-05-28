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

"use strict"

  /** Create DOM Object */
  CORE_UI.MODAL = {};

  /** Select and prepare the file image output container */
  CORE_UI.MODAL.FileImageOutput = {
    $: document.querySelector("#file_image_output"),
    open: false,
    close: document.querySelector("#file_image_output_close")
  };

  /** Close button for file image export */
  CORE_UI.MODAL.init = function() {
    CORE_UI.MODAL.FileImageOutput.close.addEventListener('click', function() {
      if (CORE_UI.MODAL.FileImageOutput.open) {
        CORE_UI.MODAL.FileImageOutput.$.style.display = "block";
        CORE_UI.MODAL.FileImageOutput.open = true;
      } else if (!CORE_UI.MODAL.FileImageOutput.open) {
        CORE_UI.MODAL.FileImageOutput.$.style.display = "none";
        CORE_UI.MODAL.FileImageOutput.open = false;
      }
    });
  };