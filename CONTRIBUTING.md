# Contributing
Contributions are appreciated in the form of pull requests. However, to maintain code readability and maintainability, some guidelines have been set. *Your pull request will likely be rejected if it does not merge these guidelines, so please read them carefully.*

### Style
* Although semicolons are optional in JavaScript, please use a semicolon after every statement that would normally use a semicolon in other languages
* Tabs should be replaced with 2 spaces.
* New classes should have their constructor's name explicitly specified, and classes should usually be specified as one per file (new folder, class definition essential in main.js).

Structure:
```
www
│
└───client
    ├───core
    │    ├───class
    │    │   main.js
    │    │   method.js
```
Example:
  ```js
  CORE.ClassName = function(argument) {
    this.argument = argument;
  };

  CORE.ClassName.prototype = CORE.ClassName;

  CORE.ClassName.prototype.method = function() {
    ...
  };
  ```
* Split files with number of lines above 250.
* Conditional/loop statements (`if`, `for`, `while`, etc.) should always use braces, and the opening brace should be placed on the same line as the statement.
* There should be a space after a conditional/loop statement and before the condition, as well as a space after the condition and before the brace. Example:
  ```js
  // Good
  if (condition) {
    ...
  }
  
  // Bad
  if(condition) {
    ...
  }
  
  // Bad
  if(condition){
    ...
  }
  ```
