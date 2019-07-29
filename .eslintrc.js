module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module"
      },
    "rules": {
        // enforces getter/setter pairs in objects
        "accessor-pairs": 0,
        // enforces return statements in callbacks of array's methods
        "array-callback-return": 2,
        "callback-return": 1,
        "comma-dangle": [1, "never"],
        // specify the maximum cyclomatic complexity allowed in a program
        "complexity": [0, 11],
        // require return statements to either always or never specify values
        "consistent-return": 0,
        // specify curly brace conventions for all control statements
        "curly": [2, "multi-line"],
        // enforces consistent newlines before or after dots
        "dot-location": [1, "property"],
        // require the use of === and !==
        "eqeqeq": [2, "smart"],
        "global-require": 1,
        // when using the callback pattern in Node, handle the error
        "handle-callback-err": 0,
        // disallow use of arguments.caller or arguments.callee
        "no-caller": 2,
        // disallow lexical declarations in case/default clauses
        "no-case-declarations": 2,
        // disallow assignment in conditional expressions
        "no-cond-assign": [2, "always"],
        // allow use of console
        "no-console": 2,
        // disallow use of constant expressions in conditions
        "no-constant-condition": 2,
        // disallow control characters in regular expressions
        "no-control-regex": 1,
        // disallow use of debugger
        "no-debugger": 2,
        // disallow division operators explicitly at beginning of regular expression
        "no-div-regex": 0,
        // disallow duplicate arguments in functions
        "no-dupe-args": 2,
        // disallow duplicate keys when creating object literals
        "no-dupe-keys": 2,
        // disallow a duplicate case label
        "no-duplicate-case": 2,
        // disallow else after a return in an if
        "no-else-return": 0,
        // disallow empty statements
        "no-empty": 2,
        // disallow the use of empty character classes in regular expressions
        "no-empty-character-class": 2,
        // disallow assigning to the exception in a catch block
        "no-ex-assign": 2,
        // disallow double-negation boolean casts in a boolean context
        "no-extra-boolean-cast": 2,
        // disallow unnecessary parentheses
        "no-extra-parens": 0,
        // disallow unnecessary semicolons
        "no-extra-semi": 2,
        // disallow overwriting functions written as function declarations
        "no-func-assign": 2,
        // disallow function or variable declarations in nested blocks
        "no-inner-declarations": 2,
        // disallow invalid regular expression strings in the RegExp constructor
        "no-invalid-regexp": 2,
        // disallow irregular whitespace outside of strings and comments
        "no-irregular-whitespace": 2,
        // either none or all variable declarations must be require declarations in a var statement
        "no-mixed-requires": 1,
        // disallow mixed spaces and tabs
        "no-mixed-spaces-and-tabs":2,
        "no-new-require": 2,
        "no-path-concat": 2,
        "no-fallthrough": 2,
        "no-global-assign": 2,
        // no-native-reassign is deprecated in favor of no-global-assign.
        "no-native-reassign": 2,
        // disallow the use of object properties of the global object (Math and JSON) as functions
        "no-obj-calls": 2,
        "no-process-env": 2,
        "no-process-exit": 1,
        // disallow use of Object.prototypes builtins directly
        "no-prototype-builtins": 0,
        "no-redeclare": 2,
        // disallow multiple spaces in a regular expression literal
        "no-regex-spaces": 2,
        // "no-restricted-modules": 0,
        "no-self-assign": 2,
        // disallow sparse arrays
        "no-sparse-arrays": 2,
        "no-sync": 1,
        // Disallow template literal placeholder syntax in regular strings
        "no-template-curly-in-string": 0,
        // Avoid code that looks like two expressions but is actually one
        "no-unexpected-multiline": 2,
        // disallow unreachable statements after a return, throw, continue, or break statement
        "no-unreachable": 2,
        // disallow return/throw/break/continue inside finally blocks
        "no-unsafe-finally": 2,
        // disallow negating the left operand of Relational Operators.
        "no-unsafe-negation": 2,
        // disallow comparisons with the value NaN
        "use-isnan": 2,
        // ensure JSDoc comments are valid
        "valid-jsdoc": [1, {
            "requireReturn": false,
            "prefer": {
                "return": "return"
            }
        }],
        // ensure that the results of typeof are compared against a valid string
        "valid-typeof": 2,
        "indent": [0, 4],
        "linebreak-style": [2, "unix"],
        "quotes": [1, "single"],
        "semi": [2, "always"],
        "quote-props": [1, "consistent-as-needed"],
        //require await on async functions
        "require-await": 1,

        // Disallow spaces at the beginning and end of parentheses
        "space-in-parens": ['error', 'never'],
        // Disallow whitespace at the end of a line
        "no-trailing-spaces": 'warn',
        // Require a blank like between class members
        "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
        // Require spacing before and after all keywords
        "keyword-spacing": ['error', { 'before': true, 'after': true }],
        // Require a space between '//' and the first character in the comment
        "spaced-comment": ['warn', 'always'],
        // Warn when non-const is never reassigned
        "prefer-const": ['warn', { 'destructuring': 'all' }],
        // Disallow var
        "no-var": 'error',
        // Require parenthesis for arrow function params when there is a curly brace body
        "arrow-parens": ['error', "as-needed", { 'requireForBlockBody': true }],
        // Enforce arrow function braces
        "arrow-body-style": ['error', 'as-needed'],
        // Require a space before opening curly brace-delineated blocks
        "space-before-blocks": 'error',
        // Require a space before anonymous function parentheses and async arrow function parentheses
        // Disallow a space before name function parentheses
        "space-before-function-paren": ['error', { "anonymous": 'always', "named": 'never', "asyncArrow": 'always' }],
        // Require a space between list items
        "comma-spacing": ['error', { "before": false, "after": true }],
        // Require a space before and after an arrow in an arrow function
        "arrow-spacing": ['error', { "before": true, "after": true }],
        // Require spaces around all operators
        "space-infix-ops": 'error',
        // Require a space after opening object curly braces and before closing object curly braces
        "object-curly-spacing": ['error', 'always'],
        // Require at least one space after a colon in an object key statement
        "key-spacing": ['error', { "beforeColon": false, "afterColon": true, "mode": 'minimum' }],
        // Warn when using function() {} as a callback instead of () => {}
        "prefer-arrow-callback": ['warn', { "allowNamedFunctions": false, "allowUnboundThis": true }],
        // Enforce one-true-brace style
        "brace-style": ['error', "1tbs", { "allowSingleLine": true }],
        // Prefer dot notation as opposed to bracket notation when accessing object parameters
        "dot-notation": 'error'
    }
};
