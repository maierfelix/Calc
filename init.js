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
  "lib/ajax.min.js",
  "lib/colorpicker.min.js",
  /** Menu */
  "core/ui/main.js",
  "core/ui/menu.js",
  "core/ui/action.js",
  "core/ui/modal.js",
  "core/ui/settings.js",
  /** Menu cell styling */
  "core/ui/style/border.js",
  "core/ui/style/font.js",
  "core/ui/style/background.js",
  "core/ui/style/update.js",
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
  /** Selector */
  "core/selector/main.js",
  "core/selector/hover.js",
  "core/selector/key.js",
  "core/selector/menu.js",
  "core/selector/select.js",
  /** Helpers */
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