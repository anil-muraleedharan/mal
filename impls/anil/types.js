class List {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '(' + this.ast.map((x) => x.toString()).join(' ') + ')';
  }

  isEmpty() {
    return this.ast.length === 0;
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '[' + this.ast.map((x) => x.toString()).join(' ') + ']';
  }
}

class HashMap {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '{' + this.ast.map((x) => x.toString()).join(' ') + '}';
  }
}

class Str {
  constructor(str) {
    this.str = str;
  }

  toString() {
    return '"' + this.str + '"';
  }
}

class Symbol {
  constructor(symbol) {
    this.symbol = symbol;
  }

  toString() {
    return this.symbol;
  }
}

class Nil {
  toString() {
    return 'nil';
  }
}

module.exports = { List, Vector, HashMap, Str, Symbol, Nil };