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

  /** Initialize the background settings menu */
  NOVAE_UI.initBackgroundChangeMenu = function() {

    /** Initialize color picker */
    var pickers = document.querySelector("#background_colorpicker");
    var picker = new EightBitColorPicker({el: pickers});

    /** Apply color change */
    picker.addEventListener('colorChange', function(e) {
      NOVAE.Styler.backgroundStyle(NOVAE.$.hexToRgba(e.detail.picker.getHexColor()));
    });

    /** Initialize cell background change menu */
    NOVAE.DOM.ChangeCellBackground.addEventListener('click', function(e) {

      /** Display the color picker */
      pickers.style.display = "block";
      picker.show();

    });

  };