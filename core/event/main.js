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
(function() { "use strict"

  /** Create Event Object */
  CORE.Event = {
    /** Save last mouse click to identify single and double clicks */
    lastMoseDown: 0
  };

  /**
   * Initialize event listeners
   *
   * @method init
   * @static
   */
  CORE.Event.init = function() {

    window.addEventListener("resize", CORE.Event.resize, false);

    window.addEventListener("mousedown", CORE.Event.mouseDown, false);

    window.addEventListener("mouseup", CORE.Event.mouseUp, false);

    window.addEventListener("mousemove", CORE.Event.mouseWipe, false);

    window.addEventListener("mousewheel", CORE.Event.scroll, false);
    window.addEventListener("DOMMouseScroll", CORE.Event.scroll, false);

    window.addEventListener("keydown", CORE.Event.keyPress, false);

  };

  /**
   * Listen for window resizing
   *
   * @method resize
   * @static
   */
  CORE.Event.resize = function () {

    CORE.Settings.Width = window.innerWidth;

    CORE.Settings.Height = window.innerHeight;

    CORE.Settings.Scroll.Vertical = CORE.$.calculateScrollAmount();

    CORE.Grid.calculateGrid();

    CORE.Grid.generateCells();

    CORE.Grid.updateWidth("right");

    CORE.eval();

  };

}).call(this);