
const { expect } = require("chai");
const { add, sub, mul, div } = require("../app/calculator");



function logResult(testName, actual, expected, passed) {
  const status = passed ? "PASS ✅" : "FAIL ❌";
  console.log(`${status} | ${testName} | actual=${actual}, expected=${expected}`);
}

describe("Calculator Tests (Mocha + Chai)", function () {
  // ---------- ADD ----------
  it("add(5,2) expected 7 PASS", function () {
    const actual = add(5, 2);
    const expected = 7;
    const passed = actual === expected;
    logResult("add(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected);
  });

  it("add(5,2) expected 8 FAIL", function () {
    const actual = add(5, 2);
    const expected = 8;
    const passed = actual === expected;
    logResult("add(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected); 
  });

  // ---------- SUB ----------
  it("sub(5,2) expected 3 PASS", function () {
    const actual = sub(5, 2);
    const expected = 3;
    const passed = actual === expected;
    logResult("sub(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected);
  });

  it("sub(5,2) expected 5 FAIL", function () {
    const actual = sub(5, 2);
    const expected = 5;
    const passed = actual === expected;
    logResult("sub(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected); 
  });

  // ---------- MUL ----------
  it("mul(5,2) expected 10 PASS", function () {
    const actual = mul(5, 2);
    const expected = 10;
    const passed = actual === expected;
    logResult("mul(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected);
  });

  it("mul(5,2) expected 12 FAIL", function () {
    const actual = mul(5, 2);
    const expected = 12;
    const passed = actual === expected;
    logResult("mul(5,2)", actual, expected, passed);
    expect(actual).to.equal(expected); 
  });

  // ---------- DIV ----------
  it("div(10,2) expected 5 PASS", function () {
    const actual = div(10, 2);
    const expected = 5;
    const passed = actual === expected;
    logResult("div(10,2)", actual, expected, passed);
    expect(actual).to.equal(expected);
  });

  it("div(10,2) expected 2 FAIL", function () {
    const actual = div(10, 2);
    const expected = 2;
    const passed = actual === expected;
    logResult("div(10,2)", actual, expected, passed);
    expect(actual).to.equal(expected);
  });
});
