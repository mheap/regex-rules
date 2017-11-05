const chai = require("chai");
const expect = chai.expect;

const RegexRules = require("../src/index");

describe("RegexRules", function() {
  describe("#construct", function() {
    it("persists the passed in regexes and rules", function() {
      const r = new RegexRules(
        {
          "3-to-5-chars": ".{3,5}",
          empty: "^$"
        },
        {
          example: ["3-to-5-chars", "empty"]
        }
      );

      expect(r.regexes).to.eql({
        "3-to-5-chars": ".{3,5}",
        empty: "^$"
      });

      expect(r.rules).to.eql({
        example: ["3-to-5-chars", "empty"]
      });
    });
  });

  describe("#evaluateRegex", function() {
    const r = new RegexRules(
      {
        "3-to-5-chars": "^.{3,5}$"
      },
      {}
    );

    it("returns true when the regex is matched", function() {
      expect(r.evaluateRegex("one", "3-to-5-chars")).to.be.true;
    });

    it("returns false when the regex is not matched", function() {
      expect(r.evaluateRegex("this is really really long", "3-to-5-chars")).to
        .be.false;
    });

    it("negates the result when required", function() {
      expect(r.evaluateRegex("one", "!3-to-5-chars")).to.be.false;
    });

    it("throws an error when the regex name is unknown", function() {
      expect(() => {
        r.evaluateRegex("test", "missing-regex");
      }).to.throw(Error, "Unknown regex name: missing-regex");
    });
  });

  describe("#evaluateRule", function() {
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

    it("passes an OR statement", function() {
      expect(r.evaluateRule("", "empty-or-long")).to.be.true;
    });

    it("fails an OR statement", function() {
      expect(r.evaluateRule("one", "empty-or-long")).to.be.false;
    });

    it("passes an AND statement", function() {
      expect(r.evaluateRule("http://example-is-long.com", "long-link")).to.be
        .true;
    });

    it("fails an AND statement", function() {
      expect(r.evaluateRule("http://foo.com", "long-link")).to.be.false;
    });
  });

  describe("#run", function() {
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

    it("returns all true statuses", function() {
      expect(r.run("http://example-is-long.com")).to.eql({
        "empty-or-long": true,
        "long-link": true
      });
    });

    it("returns all false statuses", function() {
      expect(r.run("one")).to.eql({
        "empty-or-long": false,
        "long-link": false
      });
    });

    it("returns mixed statuses", function() {
      expect(r.run("")).to.eql({
        "empty-or-long": true,
        "long-link": false
      });
    });
  });
});
