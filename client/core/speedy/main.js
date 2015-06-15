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
   * The Speedy Class
   *
   * @class Speedy
   * @static
   */
  CORE.Speedy = function() {};

  CORE.Speedy.prototype = CORE.Speedy;

  /**
   * Test the performance of the system
   *
   * @method runTest
   * @static
   */
  CORE.Speedy.prototype.runTest = function(callback) {

    /** Dont performe test on mobile devices */
    if (CORE.Settings.Mobile) {
      callback(1);
      return void 0;
    }

    /** Performance test already performed */
    if (localStorage.SystemSpeed) {
      CORE.SystemSpeed = ~~(localStorage.SystemSpeed);
      callback(1);
      return void 0;
    }

    var result = null;

    var start = performance.now();

    var selectedCells = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    /** Calculate speed based on huge array handle time */
    for (var xx = 0; xx < 1e4; ++xx) {
      selectedCells.push({
        letter: 1,
        number: xx
      });
    }

    /** Simulate scrolling */
    for (var ii = 1; ii <= 50; ++ii) {
      CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY = ii;
      CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = ii;
      CORE.Sheets[CORE.CurrentSheet].updateHeight("down", 1);
      CORE.Sheets[CORE.CurrentSheet].updateMenu();
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
    }

    var end = performance.now();

    var resultTime = end - start;

    /** 1 perfect, 5 slowest */
    if (resultTime < 200) {
      result = 1;
    } else if (resultTime < 400) {
      result = 1;
    } else if (resultTime < 500) {
      result = 2;
    } else if (resultTime > 500) {
      result = 2;
    } else if (resultTime > 600) {
      result = 3;
    } else if (resultTime > 700) {
      result = 4;
    } else if (resultTime > 800) {
      result = 5;
    } else result = 5;

    /** Save into localstorage to prevent unnecessary re-executions */
    localStorage.setItem("SystemSpeed", result);

    CORE.SystemSpeed = result;

    callback(1);

  };