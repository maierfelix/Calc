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
  NOVAE_UI.Modal = function(title, content, resolve) {

    var modalContainer = document.querySelector("#modal_helper");

    /** Set active modal in current sheet to active */
    if (NOVAE.Sheets[NOVAE.CurrentSheet]) NOVAE.Sheets[NOVAE.CurrentSheet].activeModal = true;

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
            /** Close modal */
            modalContainer.style.display = "none";
            modalContainer.innerHTML = "";
            NOVAE.Sheets[NOVAE.CurrentSheet].activeModal = false;
          });
        }
      }

    }

    var container = document.createElement("div");

    container.appendChild(parsedContent.children[0]);
    container.appendChild(parsedContent.children[0]);

    var parentContainer = document.createElement("div");
        parentContainer.className = "modal_container";

    parentContainer.appendChild(parsedTitle.children[0]);
    parentContainer.appendChild(container);

    modalContainer.appendChild(parentContainer);
    modalContainer.style.display = "block";

  };