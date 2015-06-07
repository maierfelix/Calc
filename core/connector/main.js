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

  /**
   * Connect to a server
   *
   * @method connect
   * @static
   */
  CORE.Connector.prototype.connect = function() {

    if (!window.io) throw new Error("NovaeCalc requires socket.io!");

    this.socket = io.connect(window.location.host + ":" + 3000);

    /** Only execute once */
    this.initListeners();

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
          /** Get room data */
          this.getRoom();
          break;
        /** Room */
        case "roomdata":
          if (this.room) {
            if (data.data) {
              console.log(data.data);
            }
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
   * Count how long the server is successfully connected
   *
   * @method connectionTime
   * @static
   */
  CORE.Connector.prototype.createRoom = function() {

    var name = this.getURL();

    if (name && name.length) {
      /** Delete question mark to validate the string */
      name = name.slice(1, name.length);
      this.socket.emit("createroom", name);
    }

  };

  /**
   * Get the room data from the server
   *
   * @method getRoom
   * @static
   */
  CORE.Connector.prototype.getRoom = function() {

    this.socket.emit("getroom", {room: this.room});

  };

  /**
   * Login modal
   *
   * @method connectionTime
   * @static
   */
  CORE.Connector.prototype.loginModal = function() {

    if (!window.mui) return void 0;

    var modalEl = document.createElement('div');
        modalEl.style.width = '400px';
        modalEl.style.height = '300px';
        modalEl.style.margin = '100px auto';
        modalEl.style.backgroundColor = '#fff';
        modalEl.innerHTML = '<form> <legend>Title</legend> <div class="mui-form-group"> <input type="text" class="mui-form-control" required> <label class="mui-form-floating-label">Required Text Field</label> </div><div class="mui-form-group"> <input type="email" class="mui-form-control" required> <label class="mui-form-floating-label">Required Email Address</label> </div><div class="mui-form-group"> <textarea class="mui-form-control" required></textarea> <label class="mui-form-floating-label">Required Textarea</label> </div><div class="mui-form-group"> <input type="email" class="mui-form-control" value="Validation error"> <label class="mui-form-floating-label">Email Address</label> </div><button type="submit" class="mui-btn mui-btn-default mui-btn-raised">Submit</button></form>';

    // show modal
    mui.overlay('on', modalEl);

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