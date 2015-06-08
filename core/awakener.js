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
   * Awakener, to handle live cells
   *
   * @class Awakener
   * @static
   */
  CORE.Awakener = function() {

    /** Save all running live cells here */
    this.currentlyRunning = {};

  };

  CORE.Awakener.prototype = CORE.Awakener;

  /**
   * Process live cells
   *
   * @method evalLive
   * @static
   */
  CORE.Awakener.prototype.evalLive = function() {

    for (var ii in CORE.Cells.Live) {
      /** Check for valid url */
      if (CORE.Cells.Live[ii].Url) {
        this.asleep(ii);
        this.awake(ii);
      }
    }

  };

  /**
   * Wake up a cell
   *
   * @method awake
   * @static
   */
  CORE.Awakener.prototype.awake = function(name) {

    /** Async this fix */
    var self = this;

    /** Live cell exists and is active */
    if (CORE.Cells.Live[name] && !CORE.Cells.Live[name].Active) {
      /** Set live cell to active */
      CORE.Cells.Live[name].Active = true;
      /** Attach timeout */
      this.currentlyRunning[name] = setInterval(function() {
        /** Dont refresh if user is in edit mode */
        if (!CORE.Input.Mouse.Edit) self.get(name);
      }, CORE.Cells.Live[name].RefreshTime);
    }

  };

  /**
   * Stop a live cell
   *
   * @method asleep
   * @static
   */
  CORE.Awakener.prototype.asleep = function(name) {
    if (this.currentlyRunning[name]) {
      /** Stop fetching data */
      window.clearInterval(this.currentlyRunning[name]);
      /** Deactivate it to allow reuse */
      CORE.Cells.Live[name].Active = false;
    }
  };

  /**
   * Get data from a live cell
   *
   * @method get
   * @static
   */
  CORE.Awakener.prototype.get = function(name) {

    /** Async this fix */
    var self = this;

    AJAX.GET(CORE.Cells.Live[name].Url, function(data) {
      CORE.Cells.Live[name].Data = data;
      /** Go on */
      self.processData(name);
    });

  };

  /**
   * Process a live cells received data
   *
   * @method processData
   * @static
   */
  CORE.Awakener.prototype.processData = function(name) {

    var letter = name.match(CORE.REGEX.numbers).join("");

    /** Check if we go some data */
    if (CORE.Cells.Live[name].Data && CORE.Cells.Live[name].Data.length) {
      /** Try to attach it to its attendant cell */
      if (!CORE.Cells.Used[letter][name]) CORE.registerCell(name);
      /** If data is JSON, parse and attach it */
      if (CORE.$.isJSON(CORE.Cells.Live[name].Data)) {
        CORE.Cells.Live[name].Data = JSON.parse(CORE.Cells.Live[name].Data);
      }
      CORE.eval();
    }

  };

  /**
   * Reset all live cells to inactive
   *
   * @method reset
   * @static
   */
  CORE.Awakener.prototype.reset = function() {

    for (var ii in CORE.Cells.Live) {
      CORE.Cells.Live[ii].Active = false;
    }

  };