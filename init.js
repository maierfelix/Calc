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

Import.scripts = [
  /** Libraries */
  "lib/fastclick.min.js",
  "lib/ajax.min.js",
  "lib/eight-bit-color-picker.min.js",
  "lib/socket.io.min.js",
  "lib/codemirror.js",
  "style/mui/js/mui.min.js",
  "lib/vm.min.js",
  "compiled.js"
];

Import.after = function() {
  ENGEL.init();
  NOVAE_Interpreter(function() {
    NOVAE.$.init();
    NOVAE_UI.init();
    setTimeout(function() {
      NOVAE.Speedy.runTest(function () {
        /** Add fade out animation, hide element */
        document.querySelector("#loader").classList.add("fadeOut");
        document.querySelector(".loader-background").style.display = "none";
        setTimeout( function() {
          document.querySelector("#loader").style.display = "none";
          document.querySelector("#loader-background");
        }, 750);
      });
    }, 250);
  });
};

Import.each = function(percent) {
  /** Update percentage in document */
  document.querySelector(".loader-title").innerHTML = percent + "%";
  if (percent >= 99) document.querySelector(".loader-wrapper").classList.add("fadeOut");
};

Import.me();