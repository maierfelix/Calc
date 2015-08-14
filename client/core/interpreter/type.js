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
   * Detect type of input data, return converted data and type declaration
   *
   * @method TypeMaster
   * @return {object}
   * @static
   */
  ENGEL.prototype.TypeMaster = function(data) {

    var object = {
      value: null,
      type: null,
      raw: data
    };

    object.value = data;

    /** Boolean */
    if (typeof data === "boolean") {
      object.value = ENGEL.TypeMaster.parseBoolean(data) ? "TRUE" : "FALSE";
    }

    /** Numeric */
    else if (!isNaN(data)) object.value = parseFloat(data);

    /** String */
    else if (typeof data == "string" || (typeof data == "object" && data.constructor === String)) {
      object.value = String(data.replace(/"/g, ""));
    }

    object.type = typeof(object.value);

    return (object);

  };

  /**
   * Boolean conversion
   *
   * @method parseBoolean
   * @static
   */
  ENGEL.TypeMaster.parseBoolean = function(data) {

    var result;

    /** Simulated boolean */
    if (["TRUE", "FALSE"].indexOf(data) >= 0) {
      result = data === "TRUE" || false;
    /** Boolean */
    } else if (typeof data === "boolean") {
      result = data || false;
    /** Number */
    } else if (typeof data === "number") {
      result = data === 1 || false;
    /** String */
    } else if (typeof data === "string") {
      result = data === "1" || false;
    } else {
      result = false;
    }

    return (result);

  };