# NovaeCalc Documenation

This is the included documentation for the NovaeCalc project.

## Table of contents

* [User interface](#User interface)
* [Formulas](#Formulas)
* [Projects](#Projects)
* [Live Cells](#Live Cells)

## User interface

### Scrolling
Use your mouse scroll wheel to scroll the grid up and down.
The scrolling amount depends on your screen height.
You can also scroll with the arrow keys in single steps into all directions.

### Selecting
Select cells by simply click on them.
Multiple cells can be selected by dragging the mouse to a second cell.
Press the *SHIFT* key, to select cells with your arrow keys.

### Editing
Edit a cells content by double click on a cell.
You can also select a cell and directly start typing.
Press the *ENTER* key to automatically move 1 cell down after you finished your editing.

### Resizing
You can customize cell rows and columns by move your mouse
on the letter symbol and start dragging it into the given direction.

### Styling
Cells styling can be determined by the user.
Select one or more cells and see the menu above the cell formula input field,
to customize a cells styling.
Click on a styling button to append a styling. Clicking on it again reverses it.

## Formulas
All formulas start by a `=`.
Everything behind will be attached to the attendant cell.

### Math functions
Currently supported math functions are:
```
Arcsine of a number: "asin",
Sine of a number (radian): "sin",
Arccosine of a number (radian): "acos",
Cosine of a number (radian): "cos",
Arctangent of a number: "atan",
Arctangent of the quotient of its arguments: "atan2",
Tangent of an angle: "tan",
Square root of a number: "sqrt",
Cube root of a number: "cbrt",
Value of Ex: "exp",
Random number between 0 and 1: "random",
Find the lowest number of its arguments: "min",
Find the highest number of its arguments: "max",
Round number to the nearest integer: "round",
Round number downwards to the nearest integer: "floor",
Round number upwards to the nearest integer: "ceil"
```

## Projects

### Open
Click on "*File*" on the left top and choose "*Open..*".

### Save
Click on "*File*" on the left top and click on "*Export..*".

## Live Cells

### Parent live cells
A parent live cell initialises an ajax connection between the cell and the output from an external link.
The output has to be JSON formatted.
Click on the wifi symbol and enter a url to define a parent live cell.

Example:
```js
A1 + "graph.facebook.com/" + A2
```
The above command contains the url to the facebook graph. You can inject as much cell content as you want, so the url will be variable and depends on your cell's.

A1 can be "*http://*" or "*https://*".
A2 can contain a username like "*BillGates*" or "*SteveJobs*".

### Child live cells
Child live cells receives the JSON data from a parent live cell.

Example:
```js
=JSON(A1)->"name";
```
The above command presumes a parent live cell at *A1*, and print its property called "*name*".
Import "*examples/LiveFacebook.nvc*" to see how it works.
