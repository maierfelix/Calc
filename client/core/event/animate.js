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
  NOVAE.Event.animateMouseUp = function() {

    NOVAE.DOM.Output.classList.remove("moveDown");
    NOVAE.DOM.VerticalMenu.classList.remove("moveDown");
    NOVAE.DOM.Output.classList.remove("moveUp");
    NOVAE.DOM.VerticalMenu.classList.remove("moveUp");
    setTimeout( function() {
      NOVAE.DOM.Output.classList.add("moveDown");
      NOVAE.DOM.VerticalMenu.classList.add("moveDown");
      NOVAE.DOM.Output.style.top = "-25px";
      NOVAE.DOM.VerticalMenu.style.top = "-25px";
    }, 1);

  };

  /**
   * Animate mouse up scroll to maximum top
   *
   * @method animateMouseUpMaximum
   * @static
   */
  NOVAE.Event.animateMouseUpMaximum = function() {

    /** Animate */
    NOVAE.DOM.Output.classList.remove("moveDown");
    NOVAE.DOM.VerticalMenu.classList.remove("moveDown");
    NOVAE.DOM.Output.classList.remove("moveUp");
    NOVAE.DOM.VerticalMenu.classList.remove("moveUp");
    NOVAE.DOM.Output.style.top = "0px";
    NOVAE.DOM.VerticalMenu.style.top = "0px";

  };

  /**
   * Animate mouse down scroll
   *
   * @method animateMouseDown
   * @static
   */
  NOVAE.Event.animateMouseDown = function() {

    NOVAE.DOM.Output.classList.remove("moveDown");
    NOVAE.DOM.VerticalMenu.classList.remove("moveDown");
    NOVAE.DOM.Output.classList.remove("moveUp");
    NOVAE.DOM.VerticalMenu.classList.remove("moveUp");

    setTimeout( function() {
      NOVAE.DOM.Output.classList.add("moveUp");
      NOVAE.DOM.VerticalMenu.classList.add("moveUp");
    }, 55);

  };

  /**
   * Reset mouse scroll animation
   *
   * @method resetMouseScrollAnimation
   * @static
   */
  NOVAE.Event.resetMouseScrollAnimation = function() {

    NOVAE.DOM.Viewport.style.top = "0px";

  };

  /**
   * Check if grid is large and if we're on mobile
   *
   * @method isLargeGrid
   * @static
   */
  NOVAE.Event.isLargeGrid = function() {

    return (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y >= 65 || NOVAE.Settings.Mobile ? true : false);

  };