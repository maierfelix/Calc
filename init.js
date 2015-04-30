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
Import.scripts = [
  /** Libraries */
  "lib/fastclick.min.js",
  "lib/js2png.js",
  "lib/ajax.js",
  /** Menu */
  "core/ui/main.js",
  "core/ui/menu.js",
  "core/ui/action.js",
  "core/ui/modal.js",
  /** Run the core */
  "core/main.js",
  "core/eval.js",
  /** Input */
  "core/event/main.js",
  "core/event/mouse.js",
  "core/event/key.js",
  "core/event/sniffer.js",
  /** Grid */
  "core/grid/main.js",
  "core/grid/menu.js",
  "core/grid/update.js",
  "core/grid/resize.js",
  "core/grid/cell.js",
  /** Helpers */
  "core/select.js",
  "core/functions.js",
  "core/edit.js",
  "core/file.js",
  /** Interpreter */
  "core/interpreter/main.js",
  "core/interpreter/stack.js",
  "core/interpreter/lexer.js",
  "core/interpreter/parser.js",
  "core/interpreter/evaluator.js"
];
Import.after = function() {
  ENGEL.init();
  CORE_UI.init();
  CORE_UI.MODAL.init();
  CORE.$.init();
};
Import.each = function(percent) {
  //console.log(percent);
};
Import.me();