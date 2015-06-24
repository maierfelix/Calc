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

Import.scripts = [
  /** Libraries */
  "lib/fastclick.min.js",
  "lib/ajax.min.js",
  "lib/eight-bit-color-picker.min.js",
  "lib/socket.io.min.js",
  "lib/codemirror.js",
  "style/mui/js/mui.min.js",
  /** Polyfills */
  "core/polyfill.js",
  /** Menu */
  "core/ui/main.js",
  "core/ui/menu.js",
  "core/ui/action.js",
  "core/ui/settings.js",
  "core/ui/modal.js",
  /** Menu cell styling */
  "core/ui/style/border.js",
  "core/ui/style/font.js",
  "core/ui/style/background.js",
  "core/ui/style/live.js",
  "core/ui/style/inject.js",
  "core/ui/style/update.js",
  /** Run the core */
  "core/main.js",
  "core/dom.js",
  "core/eval.js",
  /** Input */
  "core/event/main.js",
  "core/event/animate.js",
  "core/event/mouse.js",
  "core/event/key.js",
  "core/event/sniffer.js",
  /** Speed tester */
  "core/speedy/main.js",
  /** Sheet */
  "core/sheet/main.js",
  /** Grid */
  "core/grid/main.js",
  "core/grid/cache.js",
  "core/grid/menu.js",
  "core/grid/update.js",
  "core/grid/resize.js",
  "core/grid/cell.js",
  "core/grid/livecell.js",
  /** Injector */
  "core/injector/main.js",
  "core/injector/insert.js",
  "core/injector/delete.js",
  /** Extender */
  "core/extender/main.js",
  "core/extender/numeric.js",
  "core/extender/string.js",
  /** Selector */
  "core/selector/main.js",
  "core/selector/hover.js",
  "core/selector/key.js",
  "core/selector/menu.js",
  "core/selector/select.js",
  "core/selector/functions.js",
  "core/selector/master.js",
  /** Commander */
  "core/commander/main.js",
  "core/commander/command.js",
  "core/commander/reverse.js",
  "core/commander/sheet.js",
  /** Styler */
  "core/styler/main.js",
  "core/styler/inherit.js",
  "core/styler/background.js",
  "core/styler/font/color.js",
  "core/styler/font/bold.js",
  "core/styler/font/italic.js",
  "core/styler/font/underline.js",
  /** Helpers */
  "core/functions.js",
  "core/edit.js",
  "core/file.js",
  "core/awakener.js",
  "core/clipboard.js",
  /** Connector */
  "core/connector/main.js",
  "core/connector/action.js",
  /** Interpreter */
  "core/interpreter/main.js",
  "core/interpreter/stack.js",
  "core/interpreter/lexer.js",
  "core/interpreter/parser/main.js",
  "core/interpreter/parser/expression.js",
  "core/interpreter/evaluator/main.js",
  "core/interpreter/evaluator/expression.js",
  "core/interpreter/evaluator/function.js",
  "core/interpreter/type.js",
  /** Javascript interpreter */
  "api/interpreter.js",
  "api/spreadsheet.js",
  "api/main.js"
];

Import.after = function() {
  ENGEL.init();
  NOVAE.$.init();
  NOVAE_UI.init();
  NOVAE_Interpreter();
  NOVAE.Speedy.runTest(function () {
    /** Add fade out animation, hide element */
    document.querySelector("#loader").classList.add("fadeOut");
    setTimeout( function() { document.querySelector("#loader").style.display = "none"; }, 750);
  });
};

Import.each = function(percent) {
  /** Update percentage in document */
  document.querySelector(".loader-title").innerHTML = percent + "%";
  if (percent >= 99) document.querySelector(".loader-wrapper").classList.add("fadeOut");
};

Import.me();