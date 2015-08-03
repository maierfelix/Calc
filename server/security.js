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
   * Security class
   * Various method to validate input streams
   */
  function Security() {
    /**
     * Precompile string validation regex, only letters and numbers allowed
     *
     * @member {object}
     */
    this.validString = /^[A-Za-z\d\s]+$/;
    /**
     * Precompile number validation regex
     *
     * @member {object}
     */
    this.validNumber = /^-?\d*\.?\d+$/;
    /**
     * Valid cell properties
     *
     * @member {array}
     */
    this.validCellProperties = ["Color", "BackgroundColor", "Formula", "Content", "Font", "FontSize", "FontBold", "FontItalic", "FontUnderlined"];
  };

  /**
   * Check input
   * @return {boolean}
   */
  Security.prototype.isSecure = function(data) {

    var mode = 0;

    if (data || typeof data === "number") {

      switch (typeof data) {
        case "number":
          mode = 0;
          if (isNaN(parseFloat(data)) && !isFinite(data)) return (false);
          break;
        case "string":
          mode = 1;
          if (data && data.length) {
            if (data === undefined) return (false);
            if (data === null) return (false);
            if (data === "undefined") return (false);
            if (data === "null") return (false);
          } else return (false);
          break;
      }

    } else return (false);

    /** Number test */
    if (mode === 0) {
      if (!this.validNumber.test(data)) return (false);
      if (data > Number.MAX_SAFE_INTEGER) return (false);
      return (true);
    }

    /** String test */
    if (mode === 1) {
      if (!this.validString.test(data)) return (false);
      if (data.length > 1073741824) return (false);
      if (!data.trim().length) return (false);
      return (true);
    }

    return (true);

  };

  /**
   * Check input
   * @return {boolean}
   */
  Security.prototype.isJSON = function(data) {

    if (!data || !data.length) return (false);
    if (data === undefined || data === null) return (false);

    try {
      JSON.parse(string);
    } catch (e) {
      return (false);
    }

    return (true);

  };

  /**
   * Check for valid cell property
   * @return {boolean}
   */
  Security.prototype.isValidCellProperty = function(property) {

    var properties = this.validCellProperties;

    /** Single property */
    if (property && typeof property === "string" && property.length) {
      if (properties.indexOf(property) >= 0) return (true);
    /** Multiple properties */
    } else if (property && property instanceof Array && property.length) {
      for (var ii = 0; ii < property.length; ++ii) {
        if (properties.indexOf(property[ii]) <= -1) return (false);
      }
      return (true);
    }

    return (false);

  };

  module.exports = Security;