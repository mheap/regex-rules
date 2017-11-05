let RegexRules = function(regexes, rules) {
  this.regexes = regexes;
  this.rules = rules;
};

RegexRules.prototype.evaluateRegex = function(input, name) {
  let isNegation = false;

  if (name.substr(0, 1) === "!") {
    isNegation = true;
    name = name.substr(1);
  }

  const regex = this.regexes[name];
  if (!regex) {
    throw new Error("Unknown regex name: " + name);
  }

  let res = new RegExp(regex).test(input);

  if (isNegation) {
    return !res;
  }

  return res;
};

RegexRules.prototype.evaluateRule = function(input, ruleName) {
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

RegexRules.prototype.evaluatePair = function(input, pair) {
  let isPassing = true;
  for (let i in pair) {
    isPassing = isPassing && this.evaluateRegex(input, pair[i]);
  }
  return isPassing;
};

RegexRules.prototype.run = function(input) {
  let ruleStatus = {};

  // Run through each tag
  for (let t in this.rules) {
    ruleStatus[t] = this.evaluateRule(input, t);
  }

  return ruleStatus;
};

module.exports = RegexRules;
