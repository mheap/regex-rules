# regex-rules

This package allows you to specify a list of regexes and test inputs against them.

[![Build Status](https://api.travis-ci.org/mheap/regex-rules.svg?branch=master)](https://travis-ci.org/mheap/regex-rules)

### Installation

```bash
npm install regex-rules --save
```

### Usage

```javascript
const RegexRules = require("regex-rules");
const r = new RegexRules(
  {
    empty: "^$",
    "more-than-20-chars": "^.{20,}$",
    "contains-link": "http://"
  },
  {
    "empty-or-long": ["empty", "more-than-20-chars"],
    "long-link": [["contains-link", "more-than-20-chars"]]
  }
);

// You can run individual rules. This can be useful to get a true/false result

// By default, anything provided is an OR e.g.
// The input is empty, or more than 20 characters long
r.evaluateRule("", "empty-or-long")); # true
r.evaluateRule("this-is-really-really-really-long", "empty-or-long")); # true
r.evaluateRule("foo", "empty-or-long")); # false

// If you need an AND, add another array e.g.
// Contains a link AND it's more than 20 characters
r.evaluateRule("http://example-is-long.com", "long-link")); # true
r.evaluateRule("http://foo.com", "long-link"); # false

// Alternatively, you can run against all defined rules
r.run("this-is-really-really-really-long");
# {"empty-or-long": true, "long-link": false}
r.run("http://example-is-long.com");
# {"empty-or-long": true, "long-link": true}
```
