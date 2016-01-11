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
   * Listen for grid scrolling
   *
   * @method scroll
   * @static
   */
  NOVAE.Event.scroll = function(e) {

    /** Disable zooming */
    e.preventDefault();

    /** Update empty timestamp */
    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll) NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    /** Abort if [STRG] key pressed */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg) return void 0;

    /** Detect large grid */
    var largeGrid = NOVAE.Event.isLargeGrid();

    /** Detect horizontal scrolling */
    var horizontalScroll = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift ? true : false;

    var direction = 0;

    var amount = 0;

    var difference = 0;

    var calcDifference = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * (NOVAE.SystemSpeed - .5));

    /** Calculate if fast (native) scrolling is necessary */
    var fastScroll = NOVAE.Sheets[NOVAE.CurrentSheet].fastScroll;

    /** We're on a mobile device */
    if (NOVAE.Settings.Mobile) {

      var currentY = e.touches[0].clientY;
      var currentX = e.touches[0].clientX;

      var lastY = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY;
      var lastX = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX;

      if (currentY > lastY) {
        direction = 0;
      } else if (currentY < lastY) {
        direction = 1;
      } else {
        if (lastX > -1 && currentX > -1) {
          if (lastX < currentX) {
            direction = 0;
            horizontalScroll = true;
          } else if (lastX > currentX) {
            direction = 1;
            horizontalScroll = true;
          }
        }
      }

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY = currentY;
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX = currentX;

    }

    /** Make sure the grid was scrolled */
    if (e.target.parentNode.parentNode.id !== NOVAE.DOM.TableBody.id) return void 0;

    /** Only calculate that way, if not on mobile */
    if (!NOVAE.Settings.Mobile) {
      var scroll = NOVAE.$.calculateScroll(e);
      direction = scroll.direction;
      amount = scroll.amount;
    }

    direction = direction ? "down" : "up";

    /** Handle timestamps */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll > 0) {

      /** Calculate difference between this and last timestamp */
      difference = e.timeStamp - NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll;

      /** Mobile device */
      if (!NOVAE.Settings.Mobile) {
        NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
      /** Mobile device scroll amount */
      } else {
        NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical + 2;
      }

    }

    /** Calculate a scroll amount, divisible by celltemplate height */
    var scrollAmount = Math.roundTo(NOVAE.Settings.Scroll.Vertical * 5, 25);

    /** User scrolled up or down, dont redraw */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = true;

    /** Vertical scroll */
    if (!horizontalScroll) {

      switch (direction) {

        /** DOWN */
        case "down":

          /** Native optimized scrolling */
          if (fastScroll) {

            NOVAE.DOM.Viewport.scrollTop += scrollAmount;
            NOVAE.DOM.AbsoluteVerticalViewport.scrollTop += scrollAmount;

            var downSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 3);

            var downReRender = Math.floor(NOVAE.DOM.Viewport.scrollTop / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height) + downSettingsY;

            if (downReRender >= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) {

              NOVAE.DOM.Viewport.scrollTop = 0;
              NOVAE.DOM.AbsoluteVerticalViewport.scrollTop = 0;

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += (downReRender - downSettingsY);
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.nativeScrollPosition.y = NOVAE.DOM.Viewport.scrollTop;

          /** Default scrolling */
          } else {

            NOVAE.DOM.Viewport.scrollTop = 0;
            NOVAE.DOM.AbsoluteVerticalViewport.scrollTop = 0;

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += NOVAE.Settings.Scroll.Vertical;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
            NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
            NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

          }

          break;

        /** UP */
        case "up":

          /** Native optimized scrolling */
          if (fastScroll) {

            NOVAE.DOM.Viewport.scrollTop -= scrollAmount;
            NOVAE.DOM.AbsoluteVerticalViewport.scrollTop -= scrollAmount;

            var upSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 3);

            var upReRender = Math.floor(NOVAE.DOM.Viewport.scrollTop / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height) - upSettingsY;

            if (upReRender < 0) upReRender = upReRender * -1;

            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY > 0 && upReRender === upSettingsY) {

              var value = NOVAE.DOM.Viewport.scrollHeight - NOVAE.DOM.Viewport.clientHeight;

              NOVAE.DOM.Viewport.scrollTop = value;
              NOVAE.DOM.AbsoluteVerticalViewport.scrollTop = value;

              value = Math.roundTo(upSettingsY + scrollAmount, 25) * 3;

              NOVAE.DOM.AbsoluteVerticalViewport.scrollTop -= value;
              NOVAE.DOM.Viewport.scrollTop = NOVAE.DOM.AbsoluteVerticalViewport.scrollTop;

              if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY < NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) {
                value = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y + (upReRender + upSettingsY);
              } else {
                value = (upReRender + upSettingsY);
              }

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= value;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = value;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.nativeScrollPosition.y = NOVAE.DOM.Viewport.scrollTop;

          /** Default scrolling */
          } else {

            NOVAE.DOM.Viewport.scrollTop = 0;
            NOVAE.DOM.AbsoluteVerticalViewport.scrollTop = 0;

            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY - NOVAE.Settings.Scroll.Vertical <= 0) {

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

              if (!largeGrid) NOVAE.Event.animateMouseUpMaximum();

            } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY - NOVAE.Settings.Scroll.Vertical >= 0) {

              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("up", NOVAE.Settings.Scroll.Vertical);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

            }

          }

          break;

      }

    /** Horizontal Scroll */
    } else {

      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastWidth = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x;

      switch (direction) {

        /** RIGHT */
        case "down":

          NOVAE.DOM.Viewport.scrollLeft += scrollAmount;
          NOVAE.DOM.AbsoluteHorizontalViewport.scrollLeft += scrollAmount;

          var resizedX = NOVAE.Sheets[NOVAE.CurrentSheet].getResizedX();

          var leftSettingsX = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x / 2);

          var leftReRender = Math.floor(NOVAE.DOM.Viewport.scrollLeft / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Width) * 2;

          leftReRender += (~ Math.floor(resizedX / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Width)) + 1;

          if (leftReRender >= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x) {

            NOVAE.DOM.Viewport.scrollLeft = 0;
            NOVAE.DOM.AbsoluteHorizontalViewport.scrollLeft = 0;

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX += (leftReRender - leftSettingsX);
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;

            NOVAE.Sheets[NOVAE.CurrentSheet].calculateGrid();

            /** New grid dimensions */
            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x !== NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastWidth) {
              NOVAE.Event.redraw();
            } else {
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Horizontal);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
            }

          }

          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.nativeScrollPosition.x = NOVAE.DOM.Viewport.scrollLeft;

        break;

        /** LEFT */
        case "up":

          NOVAE.DOM.Viewport.scrollLeft -= scrollAmount;
          NOVAE.DOM.AbsoluteHorizontalViewport.scrollLeft -= scrollAmount;

          var leftSettingsX = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x / 2);

          var leftReRender = Math.floor(NOVAE.DOM.Viewport.scrollLeft / NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Width) * 2;

          if (leftReRender <= 0) {

            var value = NOVAE.DOM.Viewport.scrollWidth - NOVAE.DOM.Viewport.clientWidth - (leftReRender + leftSettingsX) + 1;

            NOVAE.DOM.Viewport.scrollLeft = value;
            NOVAE.DOM.AbsoluteHorizontalViewport.scrollLeft = value;

            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX - (leftReRender + leftSettingsX) <= 0) {
              NOVAE.DOM.Viewport.scrollLeft = 0;
              NOVAE.DOM.AbsoluteHorizontalViewport.scrollLeft = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX = 0;
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = 0;
            } else {
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX -= (leftReRender + leftSettingsX);
              NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
            }

            NOVAE.Sheets[NOVAE.CurrentSheet].calculateGrid();

            /** New grid dimensions */
            if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x !== NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastWidth) {
              NOVAE.Event.redraw();
            } else {
              NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Horizontal);
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
            }

          }

          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.nativeScrollPosition.x = NOVAE.DOM.Viewport.scrollLeft;

        break;

      }

    }

    /** Make sure user scrolled */
    if (direction) {

      /** Share scrolling */
      if (NOVAE.Connector.connected) {
        NOVAE.Connector.action("scrolling", {direction: direction, amount: NOVAE.Settings.Scroll.Vertical, position: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY});
      }

      /** Simulate mouse move to display the scrolled selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.x = Math.random();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.y = Math.random();
      /** Only simulate if we're on desktop */
      if (!NOVAE.Settings.Mobile) NOVAE.Event.mouseWipe(e);

    }

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

  };