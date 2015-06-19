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
   * The Connector
   *
   * @class Connector
   * @static
   */
  CORE.Connector = function() {

    /** Save socket */
    this.socket = null;

    /** Default url */
    this.url = "localhost";

    /** Default port */
    this.port = 3000;

    /** Current connection state */
    this.state = null;

    /** Connected or not */
    this.connected = false;

    /** Count time, how long the connection is already stable */
    this.connectionStreak = 0;

    /** Connection states with description */
    this.states = {
      0: "Stable",
      1: "Danger",
      2: "Lost"
    };

    /** Current room */
    this.room = null;

  };

  CORE.Connector.prototype = CORE.Connector;
  CORE.Connector.prototype.constructor = CORE.Connector;

  /**
   * Connect to a server
   *
   * @method connect
   * @static
   */
  CORE.Connector.prototype.connect = function() {

    if (!window.io) throw new Error("NovaeCalc requires socket.io!");

    this.socket = io.connect(this.url + ":" + this.port);

    /** Only execute once */
    this.initListeners();

    /** Ask for a new or existing room */
    this.createRoom();

  };

  /**
   * Listen for answers and instructions from the server
   *
   * @method initListeners
   * @static
   */
  CORE.Connector.prototype.initListeners = function() {

    /** Async visibility fix */
    var self = this;

    /** Successful connection initialised */
    this.socket.on("connected", function() {
      /** Stable state */
      self.state = 0;
      self.connectionStreak = new Date().getTime();
      self.connected = true;
    });

    /** Listen for various messages */
    this.socket.on("message", function(data) {
      self.message(data);
    });

  };

  /**
   * Handle specific messages from the server
   *
   * @method handleMessage
   * @static
   */
  CORE.Connector.prototype.message = function(data) {

    if (data && data.type) {

      switch (data.type) {
        /** Room */
        case "room":
          this.room = data.values;
          /** Get room data from the server */
          this.socket.emit("getroom", {room: this.room});
          break;
        /** Room */
        case "roomdata":
          if (this.room) {
            if (data.data) {
              this.processServerCells(data.data.sheets);
            }
          }
          break;
        /** Global message */
        case "global":
          switch (data.action) {
            /** Single cell change */
            case "cellchange":
              this.processServerCell(data.data);
              break;
            /** Scroll change */
            case "scrolling":
              this.processServerScrolling(data.data);
              break;
            /** Sheet update, someone created a new sheet */
            case "newsheet":
              this.processNewSheet(data.data);
              break;
            /** Sheet update, someone deleted a sheet */
            case "deletesheet":
              this.processSheetDeletion(data.data);
              break;
          }
          break;
      }

    }

  };

  /**
   * How long the server is successfully connected
   *
   * @method connectionTime
   * @static
   */
  CORE.Connector.prototype.connectionTime = function() {

    return (Math.floor((new Date().getTime() / 1000) - (this.connectionStreak / 1000)));

  };

  /**
   * Receive room data
   *
   * @method createRoom
   * @static
   */
  CORE.Connector.prototype.createRoom = function() {

    var self = this;

    var name = this.getURL();

    var securityPassword = "";

    if (name && name.length) {
      /** Delete question mark to validate the string */
      name = name.slice(1, name.length);
      /** Make use of acknowledge */
      this.socket.emit("createroom", {name: name, sheet: CORE.CurrentSheet}, function(state) {
        /** Room was successfully created */
        if (state) {
          prompt("Please save the following master access key for this room!", state);
        /** Room already exists, ask for password */
        } else {
          securityPassword = prompt("Please enter the room password: ");
          /** Send the password to the server */
          self.socket.emit("securitypassword", {password: securityPassword, room: self.room, sheet: CORE.CurrentSheet}, function(roomData) {
            /** Got latest room data */
            self.processServerCells(roomData);
            self.processNewSheet({sheet: CORE.CurrentSheet});
          });
        }
      });
    }

  };

  /**
   * Login modal
   *
   * @method loginModal
   * @static
   */
  CORE.Connector.prototype.loginModal = function() {

    if (!window.mui) return void 0;

    /** Css class helper */
    var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";

    /** The modal content */
    var title = "<h3 class='modalTitle'>Initialize Connection</h3>";
    var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort'>Abort</button>";

    CORE_UI.Modal(title, buttons, function(submit) {
      console.log(submit);
    });

  };

  /**
   * Read everything behind the current url
   *
   * @method getURL
   * @static
   */
  CORE.Connector.prototype.getURL = function() {

    if (window.location.search) return (window.location.search);
    else return void 0;

  };