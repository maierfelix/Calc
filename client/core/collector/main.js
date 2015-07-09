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
   * The Collector
   *
   * @class Collector
   * @static
   */
  NOVAE.Collector = function() {};

  NOVAE.Collector.prototype = NOVAE.Collector;
  NOVAE.Collector.prototype.constructor = NOVAE.Collector;

  /**
   * Add a sheet to the collector
   *
   * @param {string} [name] Sheet name
   * @method addSheet
   * @static
   */
  NOVAE.Collector.prototype.addSheet = function(name) {

    if (!this[name]) {

      this[name] = {
        vertical: [],
        horizontal: []
      };

    }

  };

  /**
   * Remove a sheet from the collector
   *
   * @param {string} [name] Sheet name
   * @method removeSheet
   * @static
   */
  NOVAE.Collector.prototype.removeSheet = function(name) {

    if (this[name]) delete this[name];

  };

  /**
   * Cache DOM
   *
   * @method cache
   * @static
   */
  NOVAE.Collector.prototype.cache = function() {

    console.log(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + ":" + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX);

    var fragment = document.createDocumentFragment();

    var length = NOVAE.DOM.Output.children.length;

    for (var ii = 0; ii < length; ++ii) {
      fragment.appendChild(NOVAE.DOM.Output.children[ii].cloneNode(true));
    }

    this[NOVAE.CurrentSheet].cache.push(fragment);

  };