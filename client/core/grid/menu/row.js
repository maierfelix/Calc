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
   * Generate menu rows
   *
   * @method generateMenuRow
   * @static
   */
  NOVAE.Grid.prototype.generateMenuRow = function(number) {

    var height = this.Templates.Menu.Numeric.style.height;

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var y = this.Settings.y - number;

    var element = document.createElement("th");

    if (customCellSizes.Rows[y]) {
      height += customCellSizes.Rows[y].Height;
    }

    var node = document.createElement(this.Templates.Menu.Numeric.element);
        node.className = this.Templates.Menu.Numeric.class;
        node.innerHTML = y;
        node.style.width = Math.floor(this.Templates.Menu.Alphabetical.style.width / 2) + "px";
        node.style.height = height + 1 + "px";

    element.appendChild(node);

    return (element);

  };

  /**
   * Generate absolute menu row
   *
   * @method generateAbsoluteMenuRow
   * @static
   */
  NOVAE.Grid.prototype.generateAbsoluteMenuRow = function(number) {

    var height = this.Templates.Menu.Numeric.style.height;

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var y = this.Settings.y - number;

    var element = document.createElement("th");

    if (customCellSizes.Rows[y]) {
      height += customCellSizes.Rows[y].Height;
    }

    var node = this.initialiseRow();

    node.innerHTML = y;
    node.style.width = Math.floor(this.Templates.Menu.Alphabetical.style.width / 2) - 4 + "px";
    node.style.height = height + "px";

    element.appendChild(node);

    return (element);

  };

  /**
   * Resize a row
   *
   * @method resizeRow
   * @static
   */
  NOVAE.Grid.prototype.resizeRow = function(name) {

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    /** Register resize column if not registered yet */
    if (!customCellSizes.Rows[name]) {
      customCellSizes.Rows[name] = {
        Width: 0,
        Height: 0
      };
    }

    var height = customCellSizes.Rows[name].Height;

    /** Re-render grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = false;

    /** Inherit resize if myself is a master sheet */
    if (this.isMasterSheet()) {
      NOVAE.Styler.inheritResize(name, height);
    }

    /** Push change into undo stack */
    var command = NOVAE.newCommand();
        command.caller = "Resize";
        command.data = {
          name: name,
          height: height
        };

    /** Push command into the commander stack */
    NOVAE.Sheets[NOVAE.CurrentSheet].Commander.pushUndoCommand(command, true);

    /** Share row resize */
    if (NOVAE.Connector.connected) {
      NOVAE.Connector.action("resize", { type: "row", name: name, size: height });
    }

    /** Hide the resize helper */
    NOVAE.DOM.ColumnResizeHelper.style.display = "none";

  };


  /**
   * Initialise a row
   *
   * @method initialiseRow
   * @static
   */
  NOVAE.Grid.prototype.initialiseRow = function() {

    var self = this;

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    /** Create dom ready element */
    var element = document.createElement(this.Templates.Menu.Numeric.element);
        element.className = this.Templates.Menu.Numeric.class;
        element.setAttribute("clicked", 0);
        element.setAttribute("timestamp", new Date().getTime());

      /** Mouse down */
      element.addEventListener(NOVAE.Events.mouseDown, function(e) {

        /** Double click */
        if (new Date().getTime() - parseInt(this.getAttribute("timestamp")) <= 250) {

          /** Do a master selection */
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelect(parseInt(e.target.innerHTML));

        } else {
          this.setAttribute("timestamp", e.timeStamp);
        }

        this.setAttribute("clicked", 1);

        /** Higher layer position */
        e.target.style.zIndex = 3;

        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.CellResize = true;

        /** Update currently resized column */
        NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Row = e.target.innerHTML;

      });

      /** Mouse out */
      element.addEventListener(NOVAE.Events.mouseOut, function(e) {

        this.setAttribute("clicked", 0);

      });

      /** User wants to change row size ? */
      element.addEventListener(NOVAE.Events.mouseMove, function(e) {

        var x = 0;
        var y = 0;

        /** Desktop */
        if (!NOVAE.Settings.Mobile) {

          x = e.pageX - this.offsetLeft,
          y = e.pageY - this.offsetTop;

          if (e.pageY < self.mouseMoveDirection.oldY) self.mouseMoveDirection.directionY = "up";
          else if (e.pageY > self.mouseMoveDirection.oldY) self.mouseMoveDirection.directionY = "down";
          else self.mouseMoveDirection.directionY = null;

          self.mouseMoveDirection.oldY = e.pageY;

        /** Mobile */
        } else {

          x = e.touches[0].pageX - this.offsetLeft,
          y = e.touches[0].pageY - this.offsetTop;

          if (e.touches[0].pageY < self.mouseMoveDirection.oldY) self.mouseMoveDirection.directionY = "up";
          else if (e.touches[0].pageY > self.mouseMoveDirection.oldY) self.mouseMoveDirection.directionY = "down";
          else self.mouseMoveDirection.directionY = null;

          self.mouseMoveDirection.oldY = e.touches[0].pageY;

        }

        e.target.style.cursor = "row-resize";

        if (e.target.getAttribute("clicked") === "1") {

          /** Show the resize helper */
          NOVAE.DOM.RowResizeHelper.style.display = "block";

          var resizeHelperValue = parseInt(e.target.style.top) + 4 + parseInt(e.target.style.height);

          var name = e.target.innerHTML;

          /** Create custom cell scroll object */
          if (!customCellSizes.Rows[name]) {

            customCellSizes.Rows[name] = {
              Width: 0,
              Height: 0
            };
            customCellSizes.rowArray.push(parseInt(name));

            /** Push change into undo stack */
            var command = NOVAE.newCommand();
                command.caller = "Resize";
                command.data = {
                  name: name,
                  height: 0
                };

            /** Push command into the commander stack */
            NOVAE.Sheets[NOVAE.CurrentSheet].Commander.pushUndoCommand(command, true);

          }

          /** User scrolls cell up */
          if (self.mouseMoveDirection.directionY === "down") {

            e.target.style.height = (parseInt(e.target.style.height) + 3) + "px";

            /** Update customized cell object */
            customCellSizes.Rows[name].Height += 3;

            /** Update total cell resize factor */
            self.Settings.cellResizedY += 3;

            /** Update resize helper top position */
            NOVAE.DOM.RowResizeHelper.style.top = resizeHelperValue - NOVAE.DOM.Viewport.scrollTop + "px";

          /** User scrolls cell down */
          } else if (self.mouseMoveDirection.directionY === "up") {

            if (parseInt(e.target.style.height) >= 0) {

              e.target.style.height = (parseInt(e.target.style.height) - 3) + "px";

              /** Update customized cell object */
              customCellSizes.Rows[name].Height -= 3;

              /** Update total cell resize factor */
              self.Settings.cellResizedY -= 3;

            } else {

              e.target.style.height = self.CellTemplate.Height + "px";

              /** Update customized cell object */
              customCellSizes.Rows[name].Height = 0;

            }

            /** Update resize helper top position */
            NOVAE.DOM.RowResizeHelper.style.top = resizeHelperValue - NOVAE.DOM.Viewport.scrollTop - 3 + "px";

          }

        }

      });

    return (element);

  };