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

    /** Connected or not */
    this.connected = false;

    /** Current connection state */
    this.state = null;

    /** Count time, how long the connection is already stable */
    this.connectionStreak = 0;

    /** Connection states with description */
    this.states = {
      0: "Stable",
      1: "Danger",
      2: "Lost"
    };

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
    });

    /** Listen for various messages */
    this.socket.on("message", function(data) {
      console.log(data);
    });

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
   * How long the server is successfully connected
   *
   * @method connectionTime
   * @static
   */
  CORE.Connector.prototype.createRoom = function() {

    this.socket.emit("createroom", "DerLimbus");

  };