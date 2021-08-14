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
    this.hashmap = new Map();
    for(let i = 0; i < ast.length; i+=2) {
      this.hashmap.set(ast[i], ast[i + 1]);
    }
  }

  toString() {
    let str = '';
    let separator = '';
    this.hashmap.forEach((value, key) => {
      str += `${separator}${key.toString()} ${value.toString()}`;
      separator = ' ';
    })
    return `{${str}}`;
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

class Keyword {
  constructor(keyword) {
    this.keyword = keyword;
  }

  toString() {
    return ':' + this.keyword;
  }
}

class Nil {
  toString() {
    return 'nil';
  }
}

module.exports = { List, Vector, HashMap, Str, Symbol, Keyword, Nil };