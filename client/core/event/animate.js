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
   * Animate mouse up scroll
   *
   * @method animateMouseUp
   * @static
   */
  CORE.Event.animateMouseUp = function() {

    CORE.DOM.Output.classList.remove("moveDown");
    CORE.DOM.VerticalMenu.classList.remove("moveDown");
    CORE.DOM.Output.classList.remove("moveUp");
    CORE.DOM.VerticalMenu.classList.remove("moveUp");
    setTimeout( function() {
      CORE.DOM.Output.classList.add("moveDown");
      CORE.DOM.VerticalMenu.classList.add("moveDown");
      CORE.DOM.Output.style.top = "-25px";
      CORE.DOM.VerticalMenu.style.top = "75px";
    }, 1);

  };

  /**
   * Animate mouse up scroll to maximum top
   *
   * @method animateMouseUpMaximum
   * @static
   */
  CORE.Event.animateMouseUpMaximum = function() {

    /** Animate */
    CORE.DOM.Output.classList.remove("moveDown");
    CORE.DOM.VerticalMenu.classList.remove("moveDown");
    CORE.DOM.Output.classList.remove("moveUp");
    CORE.DOM.VerticalMenu.classList.remove("moveUp");
    CORE.DOM.Output.style.top = "0px";
    CORE.DOM.VerticalMenu.style.top = "100px";

  };

  /**
   * Animate mouse down scroll
   *
   * @method animateMouseDown
   * @static
   */
  CORE.Event.animateMouseDown = function() {

    CORE.DOM.Output.classList.remove("moveDown");
    CORE.DOM.VerticalMenu.classList.remove("moveDown");
    CORE.DOM.Output.classList.remove("moveUp");
    CORE.DOM.VerticalMenu.classList.remove("moveUp");
    setTimeout( function() {
      CORE.DOM.Output.classList.add("moveUp");
      CORE.DOM.VerticalMenu.classList.add("moveUp");
    }, 55);

  };