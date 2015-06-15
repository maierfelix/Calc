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

  /** Initialize the cell style menu */
  CORE_UI.Modal = function(title, content, resolve) {

    var parsedTitle = null;
    var parsedContent = null;

    if (title) {
      var HTMLDOM = document.implementation.createHTMLDocument("html");
          HTMLDOM.documentElement.innerHTML = title;
      parsedTitle = HTMLDOM.body;
    }

    if (content) {
      var HTMLDOM = document.implementation.createHTMLDocument("html");
          HTMLDOM.documentElement.innerHTML = content;
      parsedContent = HTMLDOM.body;
    }

    if (parsedContent && parsedContent.children.length) {

      for (var ii = 0; ii < parsedContent.children.length; ++ii) {
        /** Listen for button clicks and return its value */
        if (parsedContent.children[ii].nodeName === "BUTTON") {
          parsedContent.children[ii].addEventListener('click', function(e) {
            resolve(e.target.getAttribute("name"));
            /** Auto close modal */
            mui.overlay('off');
          });
        }
      }

    }

    var container = document.createElement("div");
        container.className = "modal fadeIn";

    for (var ii in parsedContent.children) {
      if (parsedContent.children[ii] instanceof HTMLElement) {
        container.appendChild(parsedContent.children[ii]);
      }
    }

    // Show the modal
    mui.overlay('on', container);

    parsedTitle = parsedTitle.children[0];
    parsedTitle.className += " fadeIn";

    document.querySelector("#mui-overlay").appendChild(parsedTitle);

  };