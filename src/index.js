let RegexRules = function (regexes, rules, config) {
  this.regexes = regexes;
  this.rules = rules;
  this.config = config || {};
};

RegexRules.prototype.evaluateRegex = function (input, name) {
  let isNegation = false;

  if (name.substr(0, 1) === "!") {
    isNegation = true;
    name = name.substr(1);
  }

  let regex = this.regexes[name];
  if (!regex) {
    if (this.config.allow_direct_regex) {
      regex = name;
    } else {
      throw new Error("Unknown regex name: " + name);
    }
  }

  let regexp;
  if (this.config.case_insensitive) {
    regexp = new RegExp(regex, "i");
  } else {
    regexp = new RegExp(regex);
  }

  let res = regexp.test(input);

  if (isNegation) {
    return !res;
  }

  return res;
};

RegexRules.prototype.evaluateRule = function (input, ruleName) {
  let isPassing = false;
  for (let r in this.rules[ruleName]) {
    let condition = this.rules[ruleName][r];
    if (condition instanceof Object) {
      isPassing = isPassing || this.evaluatePair(input, condition);
    } else {
      isPassing = isPassing || this.evaluateRegex(input, condition);
    }
  }

  return isPassing;
};

RegexRules.prototype.evaluatePair = function (input, pair) {
  let isPassing = true;
  for (let i in pair) {
    isPassing = isPassing && this.evaluateRegex(input, pair[i]);
  }
  return isPassing;
};

RegexRules.prototype.run = function (input) {
  let ruleStatus = {};

  // Run through each tag
  for (let t in this.rules) {
    ruleStatus[t] = this.evaluateRule(input, t);
  }

  return ruleStatus;
};

module.exports = RegexRules;
