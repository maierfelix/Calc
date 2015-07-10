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

      this[name] = [];

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

    var self = this;

    var x = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX / NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x);
    var y = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY / NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y);

    var sizeX = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x;
    var sizeY = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y;

    var fragment = document.createDocumentFragment();

    var length = NOVAE.DOM.Output.children.length;

    for (var ii = 0; ii < length; ++ii) {
      fragment.appendChild(NOVAE.DOM.Output.children[ii].cloneNode(true));
    }

    var collection = new this.Collection(fragment, x, y, sizeX, sizeY);

    /** Check if sheet was registered successfully */
    if (NOVAE.Collector[NOVAE.CurrentSheet] instanceof Array) {
      NOVAE.Collector[NOVAE.CurrentSheet].push(collection);
    }

    var collect = this.getCollection(NOVAE.CurrentSheet, x, y);

    console.log("Read collection");

    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();

  };

  /**
   * Get a collection
   *
   * @param {string} [name] Sheet name
   * @param {number} [x] X coordinate
   * @param {number} [y] Y coordinate
   * @method getCollectionByCoord
   * @static
   */
  NOVAE.Collector.prototype.getCollectionByCoord = function(sheet, x, y) {

    if (!this[sheet]) return void 0;

    for (var ii = 0; ii < this[sheet].length; ++ii) {
      if (this[sheet][ii].x === x && this[sheet][ii].y === y) {
        return (this[sheet][ii]);
      }
    }

  };

  /**
   * Get a collection
   *
   * @param {string} [sheet] Sheet name
   * @param {number} [x] X coordinate
   * @param {number} [y] Y coordinate
   * @method getCollection
   * @static
   */
  NOVAE.Collector.prototype.getCollection = function(sheet, x, y) {

    return (this.getCollectionByCoord(sheet, x, y) || void 0);

  };

  /**
   * Append a collection back to the DOM
   *
   * @param {object} [collection] Collection
   * @method appendCollection
   * @static
   */
  NOVAE.Collector.prototype.appendCollection = function(collection) {

    var dom = collection.dom;

    var length = dom.childElementCount;

    for (var ii = 0; ii < length; ++ii) {
      if (NOVAE.DOM.Output.children.length !== length) {
        console.log(NOVAE.DOM.Output.children.length, length);
      }
      NOVAE.DOM.Output.children[ii].setAttribute("style", dom.children[ii].style.cssText);
    }

  };

  /**
   * Resize all collections
   *
   * @param {string} [sheet] Sheet name
   * @param {object} [collection] Collection
   * @method resizeCollections
   * @static
   */
  NOVAE.Collector.prototype.resizeCollections = function(sheet) {

    for (var ii = 0; ii < this[sheet].length; ++ii) {
      this[sheet][ii].resize();
    }

  };