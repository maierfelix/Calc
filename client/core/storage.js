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
   * Storage API
   *
   * @class Storage
   * @static
   */
  NOVAE.Storage = function() {

    this.isAvaible = typeof Storage !== void 0 ? true : false;

    /** Auto initialize */
    this.init();

  };

  NOVAE.Storage.prototype = NOVAE.Storage;
  NOVAE.Storage.prototype.constructor = NOVAE.Storage;

  /**
   * Initialize storage
   * 
   * @method init
   * @static
   */
  NOVAE.Storage.prototype.init = function() {

    if (!this.isAvaible) return void 0;

    /** Add homescreen property to local */
    !this.get({ property: "HomeScreen" }) && this.set({ property: "HomeScreen", value: false });

    /** Add landscape property to session */
    !this.get({ property: "Landscape" }, true) && this.set({ property: "Landscape", value: false }, true);

  };

  /**
   * Read from local or session storage
   *
   * @param {object} [object] Object
   * @param {boolean} [session] Session or not
   * @method get
   * @static
   */
  NOVAE.Storage.prototype.get = function(object, session) {

    if (!this.isAvaible) return void 0;

    var property = object.property;

    if (!property) return void 0;

    /** Read session */
    if (session) {
      return (this.typeConversion(sessionStorage.getItem(property)));
    /** Read localstorage */
    } else {
      return (this.typeConversion(localStorage.getItem(property)));
    }

    return void 0;

  };

  /**
   * Update local or session storage
   *
   * @param {object} [object] Object
   * @param {boolean} [session] Session or not
   * @method set
   * @static
   */
  NOVAE.Storage.prototype.set = function(object, session) {

    if (!this.isAvaible) return void 0;

    var property = object.property;

    var value = object.value;

    if (!property || value === undefined) return void 0;

    /** Update session */
    if (session) {
      sessionStorage.setItem(property, value);
    /** Update localstorage */
    } else {
      localStorage.setItem(property, value);
    }

  };

  /**
   * Remove local or session storage property
   *
   * @param {object} [object] Object
   * @param {boolean} [session] Session or not
   * @method remove
   * @static
   */
  NOVAE.Storage.prototype.remove = function(object, session) {

    if (!this.isAvaible) return void 0;

    var property = object.property;

    if (!property) return void 0;

    /** Remove session */
    if (session) {
      if (sessionStorage.getItem(property)) {
        sessionStorage.removeItem(property);
      }
    /** Remove localstorage */
    } else {
      if (localStorage.getItem(property)) {
        localStorage.removeItem(property);
      }
    }

  };

  /**
   * Remove local or session storage property
   * 
   * @param {*} [value] Value to convert type
   * @method typeConversion
   * @static
   */
  NOVAE.Storage.prototype.typeConversion = function(value) {

    /** Boolean conversion */
    if (["true", "false"].indexOf(value) >= 0) {
      return (value === "true");
    }

    /** Number conversion */
    if (!isNaN(value)) {
      return (parseFloat(value));
    }

    return (value);

  };