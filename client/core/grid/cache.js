/**
 * This file is part of the Calc project.
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
   * Chache the whole grid DOM
   *
   * @method cacheDOM
   * @static
   */
  NOVAE.Grid.prototype.cacheDOM = function() {

    var children = NOVAE.DOM.TableBody.children;
    var childLength = 0;

    NOVAE.DOM.Cache = [];
    NOVAE.DOM.CacheArray = [];

    for (var ii = 0; ii < NOVAE.DOM.TableBody.children.length; ++ii) {
      for (var kk = 0; kk < NOVAE.DOM.TableBody.children[ii].children.length; ++kk) {
        if (NOVAE.DOM.TableBody.children[ii].children[kk].nodeName === "TD") {
          var coord = kk + this.Settings.y * ii - 1;
          NOVAE.DOM.Cache.push(NOVAE.DOM.TableBody.children[ii].children[kk]);
        }
      }
    }

  };