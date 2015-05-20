(function() { "use strict"

  /**
   * The Lexer
   *
   * @class LEXER
   * @static
   */
  ENGEL.LEXER = function() {

    /** Token list */
    this.TOKENS = [];

    /**
     * Keyword object contains precompiled regular expressions
     */
    this.KeyWords = [

      /** Statements */
      { name: "LX_IF",     rx: /^IF(?![a-zA-Z0-9_])/     },
      { name: "LX_ELSE",   rx: /^else(?![a-zA-Z0-9_])/   },

      /** Punctuation */
      { name: "LX_LPAR",   rx: /^[\\(]()+/ },
      { name: "LX_RPAR",   rx: /^[\\)]()+/ },
      { name: "LX_LBRAC",  rx: /^[\\{]+/ },
      { name: "LX_RBRAC",  rx: /^[\\}]+/ },
      { name: "LX_LHBRAC", rx: /^\[.*?/  },
      { name: "LX_RHBRAC", rx: /^\].*?/  },
      { name: "LX_SEMIC",  rx: /^[;]+/   },

      /** Comparison */
      { name: "LX_EQ",  rx: /^==/             },
      { name: "LX_NEQ", rx: /^!=/             },
      { name: "LX_AND", rx: /^(&&)/           },
      { name: "LX_OR",  rx: /^([\\|\\|])+/    },
      { name: "LX_GRE", rx: /^>=/             },
      { name: "LX_LWE", rx: /^<=/             },
      { name: "LX_GR",  rx: /^>/              },
      { name: "LX_LW",  rx: /^</              },

      /** Assignment */
      { name: "LX_ASSIGN", rx: /^=/ },

      { name: "LX_COMMA", rx: /^,/ },

      /** Instructions */
      { name: "LX_LOG",       rx: /^(log)*\(/   },
      { name: "LX_PRINT",     rx: /^(print)*\(/ },
      { name: "LX_JSON",      rx: /^(JSON)/     },
      { name: "LX_JSON_CALL", rx: /^->/         },

      /** Math functions */
      { name: "LX_MATH",      rx: /^(asin|sin|acos|cos|atan|atan2|tan|sqrt|cbrt|exp|random|min|max|round|floor|ceil)*\(/ },

      /** Connect function */
      { name: "LX_CONNECT",   rx: /^(CONNECT|connect)/ },

      /** Types */
      { name: "LX_VAR",        rx: /^[a-zA-Z_][a-zA-Z0-9_]*/             },
      { name: "LX_NUMBER",     rx: /^[-]?[0-9]+(\.\d+[0-9]*)?/           },
      { name: "LX_STRING",     rx: /^"(\\\\"|[^"])(.*?)"|'"'(\\\\'|[^'])*'"/ },

      /** Operators */
      { name: "LX_PLUS",  rx: /^\+(?!\+)/ },
      { name: "LX_MINUS", rx: /^\-(?!-)/  },
      { name: "LX_MULT",  rx: /^[*]+/     },
      { name: "LX_DIV",   rx: /^[/]+/     },

    ];

    this.blank = /^[ \t\v\f]+/;

    this.notBlank = /^\S+/;

    this.lineBreak = /^[\r\n]+/;

    /**
     * Regular Expression functions
     */
    this.isBlank = function() { return arguments[0e0].match(this.blank); };

    this.isNotBlank = function() { return arguments[0e0].match(this.notBlank); };

    this.isLineBreak = function() { return arguments[0e0].match(this.lineBreak); };

  };

  ENGEL.LEXER.prototype = ENGEL.LEXER;

  /**
   * Evaluates a string and generates a list of tokens
   *
   * @method lex
   * @return {Array} of Tokens
   * @static
   */
  ENGEL.LEXER.prototype.lex = function(input) {

    this.TOKENS = [];

    var line = 1e0;

    while (input) {

      var match = this.isLineBreak(input) || this.isBlank(input);

      if (this.isLineBreak(input)) line += match[0].length;

      for (var ii = 0e0; !match && ii < this.KeyWords.length; ++ii) {

        if (match = input.match(this.KeyWords[ii].rx)) {

          /** Optimize math and display function calls */
          if (["LX_LOG", "LX_PRINT", "LX_MATH"].indexOf(this.KeyWords[ii].name) >= 0) {
            match[0] = match[0].slice(0, -1);
          }

          /** Turn variables uppercase */
          if (this.KeyWords[ii].name === "LX_VAR") { 
            match[0] = (match[0]).toUpperCase();
          }

          this.TOKENS.push({
            type:  this.KeyWords[ii].name,
            value: match[0].trim()
          });

        }

      }

      if (!match) {
        console.log("Error in line: " + line + "\n " + input[0] + " is not defined!");
        break;
      }

      if (match || this.notBlank(input)) input = input.substring(match[0e0].length);
      else break;

    }

    return (this.TOKENS);

  };

}).call(this);