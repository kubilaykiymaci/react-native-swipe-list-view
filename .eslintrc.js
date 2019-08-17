module.exports = {
  root: true, // Stop ESLint from looking for a configuration file in parent folders

  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended",
    "plugin:flowtype/recommended"
  ],
  plugins: ["eslint-comments", "flowtype", "jsx-a11y", "react", "react-native", "jest", "prettier"],

  rules: {
    "prettier/prettier": "error",
    "react/require-render-return": 2,
    "no-class-assign": 1,
    // General
    "comma-dangle": [2, "only-multiline"], // allow or disallow trailing commas
    "no-cond-assign": 1, // disallow assignment in conditional expressions
    "no-console": 1, // disallow use of console (off by default in the node environment)
    "no-const-assign": 2, // disallow assignment to const-declared variables
    "no-constant-condition": 1, // disallow use of constant expressions in conditions
    "no-control-regex": 1, // disallow control characters in regular expressions
    "no-debugger": 1, // disallow use of debugger
    "no-dupe-class-members": 2, // Disallow duplicate name in class members
    "no-dupe-keys": 2, // disallow duplicate keys when creating object literals
    "no-empty": 1, // disallow empty statements
    "no-ex-assign": 1, // disallow assigning to the exception in a catch block
    "no-extra-boolean-cast": 1, // disallow double-negation boolean casts in a boolean context
    "no-extra-parens": 0, // disallow unnecessary parentheses (off by default)
    "no-extra-semi": 1, // disallow unnecessary semicolons
    "no-func-assign": 1, // disallow overwriting functions written as function declarations
    "no-inner-declarations": 1, // disallow function or variable declarations in nested blocks
    "no-invalid-regexp": 1, // disallow invalid regular expression strings in the RegExp constructor
    "no-negated-in-lhs": 1, // disallow negation of the left operand of an in expression
    "no-obj-calls": 1, // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-regex-spaces": 1, // disallow multiple spaces in a regular expression literal
    "no-reserved-keys": 0, // disallow reserved words being used as object literal keys (off by default)
    "no-sparse-arrays": 1, // disallow sparse arrays
    "no-unreachable": 2, // disallow unreachable statements after a return, throw, continue, or break statement
    "use-isnan": 1, // disallow comparisons with the value NaN
    "valid-jsdoc": 1, // Ensure JSDoc comments are valid (off by default)
    "valid-typeof": 1, // Ensure that the results of typeof are compared against a valid string

    // Best Practices
    // These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

    "block-scoped-var": 1, // treat var statements as if they were block scoped (off by default)
    complexity: 0, // specify the maximum cyclomatic complexity allowed in a program (off by default)
    "consistent-return": 0, // require return statements to either always or never specify values
    curly: 2, // specify curly brace conventions for all control statements
    "default-case": 1, // require default case in switch statements (off by default)
    "dot-notation": 1, // encourages use of dot notation whenever possible
    eqeqeq: [2, "allow-null"], // require the use of === and !==
    "guard-for-in": 1, // make sure for-in loops have an if statement (off by default)
    "no-alert": 1, // disallow the use of alert, confirm, and prompt
    "no-caller": 1, // disallow use of arguments.caller or arguments.callee
    "no-div-regex": 1, // disallow division operators explicitly at beginning of regular expression (off by default)
    "no-else-return": 0, // disallow else after a return in an if (off by default)
    "no-eq-null": 1, // disallow comparisons to null without a type-checking operator (off by default)
    "no-eval": 2, // disallow use of eval()
    "no-extend-native": 1, // disallow adding to native types
    "no-extra-bind": 1, // disallow unnecessary function binding
    "no-fallthrough": 1, // disallow fallthrough of case statements
    "no-floating-decimal": 1, // disallow the use of leading or trailing decimal points in numeric literals (off by default)
    "no-implied-eval": 1, // disallow use of eval()-like methods
    "no-labels": 1, // disallow use of labeled statements
    "no-iterator": 1, // disallow usage of __iterator__ property
    "no-lone-blocks": 1, // disallow unnecessary nested blocks
    "no-loop-func": 1, // disallow creation of functions within loops
    "no-multi-str": 1, // disallow use of multiline strings
    "no-native-reassign": 1, // disallow reassignments of native objects
    "no-new": 1, // disallow use of new operator when not part of the assignment or comparison
    "no-new-func": 2, // disallow use of new operator for Function object
    "no-new-wrappers": 1, // disallows creating new instances of String,Number, and Boolean
    "no-octal": 1, // disallow use of octal literals
    "no-octal-escape": 1, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
    "no-proto": 1, // disallow usage of __proto__ property
    "no-redeclare": 1, // disallow declaring the same variable more then once
    "no-return-assign": 1, // disallow use of assignment in return statement
    "no-script-url": 1, // disallow use of javascript: urls.
    "no-self-compare": 1, // disallow comparisons where both sides are exactly the same (off by default)
    "no-sequences": 1, // disallow use of comma operator
    "no-unused-expressions": 0, // disallow usage of expressions in statement position
    "no-void": 2, // disallow use of void operator (off by default)
    "no-warning-comments": 1, // disallow usage of configurable warning terms in comments": 1,                        // e.g. TODO or FIXME (off by default)
    "no-with": 2, // disallow use of the with statement
    radix: 2, // require use of the second argument for parseInt() (off by default)
    "semi-spacing": 1, // require a space after a semi-colon
    "vars-on-top": 2, // requires to declare all vars on top of their containing scope (off by default)
    "wrap-iife": 1, // require immediate function invocation to be wrapped in parentheses (off by default)
    yoda: 1, // require or disallow Yoda conditions

    // Variables
    // These rules have to do with variable declarations.

    "no-catch-shadow": 2, // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
    "no-delete-var": 2, // disallow deletion of variables
    "no-label-var": 2, // disallow labels that share a name with a variable
    "no-shadow": 2, // disallow declaration of variables already declared in the outer scope
    "no-shadow-restricted-names": 2, // disallow shadowing of names such as arguments
    "no-undef": 2, // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-undefined": 0, // disallow use of undefined variable (off by default)
    "no-undef-init": 2, // disallow use of undefined when initializing variables
    "no-unused-vars": [2, { vars: "all", args: "none", ignoreRestSiblings: true }], // disallow declaration of variables that are not used in the code
    "no-use-before-define": 2, // disallow use of variables before they are defined

    // Node.js
    // These rules are specific to JavaScript running on Node.js.

    "handle-callback-err": 2, // enforces error handling in callbacks (off by default) (on by default in the node environment)
    "no-mixed-requires": 2, // disallow mixing regular variable and require declarations (off by default) (on by default in the node environment)
    "no-new-require": 2, // disallow use of new operator with the require function (off by default) (on by default in the node environment)
    "no-path-concat": 2, // disallow string concatenation with __dirname and __filename (off by default) (on by default in the node environment)
    "no-process-exit": 1, // disallow process.exit() (on by default in the node environment)
    "no-restricted-modules": 2, // restrict usage of specified node modules (off by default)
    "no-sync": 1, // disallow use of synchronous methods (off by default)

    // ESLint Comments Plugin
    // The following rules are made available via `eslint-plugin-eslint-comments`
    "eslint-comments/no-aggregating-enable": 2, // disallows eslint-enable comments for multiple eslint-disable comments
    "eslint-comments/no-unlimited-disable": 1, // disallows eslint-disable comments without rule names
    "eslint-comments/no-unused-disable": 2, // disallow disables that don't cover any errors
    "eslint-comments/no-unused-enable": 2, // // disallow enables that don't enable anything or enable rules that weren't disabled

    // Flow Plugin
    // The following rules are made available via `eslint-plugin-flowtype`
    "flowtype/use-flow-type": 2,
    "flowtype/valid-syntax": 2,
    "flowtype/boolean-style": [2, "boolean"],
    "flowtype/define-flow-type": 2,
    "flowtype/delimiter-dangle": [2, "never"],
    "flowtype/generic-spacing": [2, "never"],
    "flowtype/no-primitive-constructor-types": 2,
    "flowtype/no-types-missing-file-annotation": 2,
    "flowtype/no-weak-types": 0,
    "flowtype/object-type-delimiter": [2, "comma"],
    "flowtype/require-parameter-type": 2,
    "flowtype/require-return-type": [
      2,
      "always",
      {
        annotateUndefined: "never"
      }
    ],
    "flowtype/require-valid-file-annotation": 2,
    "flowtype/space-after-type-colon": [2, "always"],
    "flowtype/space-before-generic-bracket": [2, "never"],
    "flowtype/space-before-type-colon": [2, "never"],
    "flowtype/type-id-match": [2, "^([A-Z][a-z0-9]+)+Type$"],
    "flowtype/union-intersection-spacing": [2, "always"],
    // Stylistic Issues
    // These rules are purely matters of style and are quite subjective.

    "key-spacing": 1,
    "keyword-spacing": 1, // enforce spacing before and after keywords
    "jsx-quotes": [2, "prefer-double"], // enforces the usage of double quotes for all JSX attribute values which doesn’t contain a double quote
    "comma-spacing": 1,
    "no-multi-spaces": 1,
    "brace-style": 1, // enforce one true brace style (off by default)
    camelcase: 0, // require camel case names
    "consistent-this": 2, // enforces consistent naming when capturing the current execution context (off by default)
    "eol-last": 2, // enforce newline at the end of file, with no multiple empty lines
    "func-names": 0, // require function expressions to have a name (off by default)
    "func-style": 0, // enforces use of function declarations or expressions (off by default)
    "new-cap": 0, // require a capital letter for constructors
    "new-parens": 1, // disallow the omission of parentheses when invoking a constructor with no arguments
    "no-nested-ternary": 0, // disallow nested ternary expressions (off by default)
    "no-array-constructor": 2, // disallow use of the Array constructor
    "no-empty-character-class": 2, // disallow the use of empty character classes in regular expressions
    "no-lonely-if": 0, // disallow if as the only statement in an else block (off by default)
    "no-new-object": 2, // disallow use of the Object constructor
    "no-spaced-func": 1, // disallow space between function identifier and application
    "no-ternary": 0, // disallow the use of ternary operators (off by default)
    "no-trailing-spaces": 1, // disallow trailing whitespace at the end of lines
    "no-underscore-dangle": 0, // disallow dangling underscores in identifiers
    "no-mixed-spaces-and-tabs": 1, // disallow mixed spaces and tabs for indentation
    quotes: [0, "single", "avoid-escape"], // specify whether double or single quotes should be used
    "quote-props": 0, // require quotes around object literal property names (off by default)
    semi: 0, // require or disallow use of semicolons instead of ASI
    "sort-vars": 0, // sort variables within the same declaration block (off by default)
    "space-in-brackets": 0, // require or disallow spaces inside brackets (off by default)
    "space-in-parens": 0, // require or disallow spaces inside parentheses (off by default)
    "space-infix-ops": 1, // require spaces around operators
    "space-unary-ops": [1, { words: true, nonwords: false }], // require or disallow spaces before/after unary operators (words on by default, nonwords off by default)
    "max-nested-callbacks": 0, // specify the maximum depth callbacks can be nested (off by default)
    "one-var": 0, // allow just one var statement per function (off by default)
    "wrap-regex": 0, // require regex literals to be wrapped in parentheses (off by default)

    // Legacy
    // The following rules are included for compatibility with JSHint and JSLint. While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

    "max-depth": 0, // specify the maximum depth that blocks can be nested (off by default)
    "max-len": 0, // specify the maximum length of a line in your program (off by default)
    "max-params": 0, // limits the number of parameters that can be used in the function declaration. (off by default)
    "max-statements": 0, // specify the maximum number of statement allowed in a function (off by default)
    "no-bitwise": 1, // disallow use of bitwise operators (off by default)
    "no-plusplus": 0, // disallow use of unary operators, ++ and -- (off by default)

    // React Plugin
    // The following rules are made available via `eslint-plugin-react`.

    "react/display-name": 0,
    "react/jsx-boolean-value": 2,
    "react/jsx-closing-tag-location": 2,
    "react/jsx-no-comment-textnodes": 2,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-sort-props": 0,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-will-update-set-state": 1,
    "react/no-direct-mutation-state": 1,
    "react/no-multi-comp": 2,
    "react/no-string-refs": 1,
    "react/no-unknown-property": 2,
    "react/prop-types": 2,
    "react/react-in-jsx-scope": 2,
    "react/self-closing-comp": 2,
    "react/wrap-multilines": 0,
    "react/no-deprecated": 2,
    "react/no-is-mounted": 2,
    "react/no-unused-state": 2,
    "react/no-access-state-in-setstate": 2,
    "react/jsx-no-bind": [
      2,
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false
      }
    ],
    "react/no-typos": 2,

    // React-Native Plugin
    // The following rules are made available via `eslint-plugin-react-native`

    "react-native/no-inline-styles": 2,

    // Jest Plugin
    // The following rules are made available via `eslint-plugin-jest`.
    "jest/no-disabled-tests": 1,
    "jest/no-focused-tests": 1,
    "jest/no-identical-title": 1,
    "jest/valid-expect": 1
  },

  // Flow rules check with flow annotation
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    "import/resolver": {
      node: {},
      "babel-module": {
        root: ["./components"]
      }
    }
  }
}
