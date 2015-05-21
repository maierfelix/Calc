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

    /** Numeric */
    if (!isNaN(data)) object.value = parseFloat(data);

    /** String */
    else if (typeof data == "string" || (typeof data == "object" && data.constructor === String)) {
      object.value = String(data.replace(/"/g, ""));
    }

    object.type = typeof(object.value);

    return (object);

  };

}).call(this);