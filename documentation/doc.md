# NovaeCalc Documenation

This is the included documentation for the NovaeCalc project.

## Table of contents

* [User interface](#User interface)
* [Formulas](#Formulas)
* [Scripts](#Scripts)
* [Projects](#Projects)
* [Sheets](#Sheets)
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

## Calculations
The following example assumes:
```
A2 = 5;
B2 = 10;
```
```js
C2 = A2 * B2; // 50
C2 = (A2 + B2 * 2) * 2; // 50
D2 = A2 + B2 + C2; // 65
```
String concatenate:
```
A2 = Hello;
A3 = World;
A4 = !;
```
```js
A1 = A2 + " " + A3 + A4; // Hello World!
```
### Functions
The following example assumes:
```
A1 = 5;
A2 = 10;
A3 = 15;
A4 = 20;
A5 = 25;
```
```js
// SUM
=sum(A1:A5, 100, A1*2); // 185
```
### Conditions
Conditions can be typed as operators or in english and german and are case insensitive.
<br/>The following example aussumes:
```
A1 = 0;
```
```js
=if (A1 == 10, "True", "False"); // False
=if (A1 + 10 == 10, "True", "False"); // True
=if (A1 == 10 || A1 < 10, "True", "False"); // True
=if (A1 == 0 && A1 >= 0 && A1 != 0, "True", "False"); // False
=if (A1 == 0, A1 + 10, A1); // 10
```

The next example shows, how to mix the SUM function with conditions.
<br/>This example aussumes:
```
A1 = 1;
A2 = 2;
A3 = 3;
A4 = 3;
A5 = 1;
```

```js
=if (sum(A1:A5) >= 10, "A1:A5 = " + sum(A1:A5), "A1:A5 < 10"); // A1:A5 = 10
```

This example shows, how to use nested IF conditions.
<br/>This example aussumes:
```
A1 = 10;
```
```js
=if (A1 == 0, "A1 is 0", if (A1 == 10, "A1 is 10", if (A1 > 100, "A1 is > 100", if (A1 < 100, "A1 is < 100", "A1 is below 100")))); // A1 is < 100
```

## Scripts
NovaeCalc has a own scripting language based on Javascript, which provides you some great ways to write your own makros and functions.
You can write scripts as modules and combine them. See the example below how to do so.

Define a module:
```js
module = {
  /** Unique name of the module */
  "name": ..,
  /** A short description of the module */
  "description": ...,
  /** Import other modules if you want to have access to their content */
  "import": [.., ..]
};
```
After that, you can start writing the modules code:
```js
/** Initialize a new sheet api and take the current active sheet */
var sheet = SpreadSheet.getActiveSheet();

/** Get a range of the user's current view */
var range = new sheet.Range(sheet.getView());

/** Get length of the range */
var length = range.getLength();

/** Create a new array which holds some new background colors */
var newValues = [];

/** Fill the array with some random content */
for (var ii = 0; ii < length; ++ii) {
  newValues[ii] = Math.ceil(Math.random()*1000);
}

/** Change content of the range with a length matching array holding new values */
range.setValues('Content', newValues);

/** Since you changed the styling of the sheet, it has to be redrawn */
sheet.redraw();
```

## Projects

### Open
Click on "*File*" on the left top and choose "*Open..*".

### Save
Click on "*File*" on the left top and click on "*Export..*".

## Sheets
NovaeCalc starts with Sheet1 by default.
To add a new sheet, press the *+* button on the right bottom.
To navigate to a sheet, simply click on it's name.
To delete a sheet, click on the small *-* button on the right top of the sheet button.

### Master and slave sheets
NovaeCalc supports master and slave sheets. If you create a master sheet, all style changes, formula and content changes, column and row resizement etc. will be inherited to each slave sheet.
A maximum of 1 master sheets can exist at the same time.
Master sheets are green colored by default.
To create a master sheet, press the *+* button on the right bottom at least for 2 seconds.
To delete a master sheet, click on the small *-* button on the right top of it.

## Live Cells

### Parent live cells
A parent live cell initialises an ajax connection between the cell and the output from an external link.
The output has to be JSON formatted.

Example:
```js
=CONNECT(A1 + "graph.facebook.com/" + A2, A3);
```
The above command contains the url to the facebook graph. You can inject as much cell content as you want, so the url will be variable and depends on your cell's.

A1 can be "*http://*" or "*https://*".
A2 could contain a username like "*BillGates*" or "*SteveJobs*".
A3 contains the the refresh amount (in ms), for example *5000* =^ *5 Seconds*.

### Child live cells
Child live cells receives the JSON data from a parent live cell.

Example:
```js
=JSON(A1)->"name";
```
The above command presumes a parent live cell at *A1*, and print its property called "*name*".
Import "*examples/LiveFacebook.nvc*" to see how it works.
