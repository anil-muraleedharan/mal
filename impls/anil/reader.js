const { List, Vector, HashMap, Str, Symbol, Keyword, Nil } = require('./types');

class Reader {
  constructor(tokens) {
    this.tokens = tokens.slice();
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const currentToken = this.tokens[this.position];
    if (currentToken) {
      this.position++;
    }
    return currentToken;
  }
}

const tokenize = (str) => {
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const results = []
  let match;
  while((match = re.exec(str)[1]) !== '') {
    results.push(match);
  }
  return results;
}

const read_atom = (token) => {
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }
  if (token.match(/^-?[0-9][0-9.]*$/)) {
    return parseFloat(token);
  }
  if (token === 'true') {
    return true;
  }
  if (token === 'false') {
    return false;
  }
  if (token === 'nil') {
    return new Nil();
  }
  if(token.startsWith('"')) {
    if(/[^\\]"$/.test(token)) {
      return new Str(token.substring(1, token.length - 1));
    }
    throw 'unbalanced';
  }
  if(token.startsWith(':')) {
    return new Keyword(token.slice(1));
  }
  return new Symbol(token);
};

function read_seq(reader, closing) {
  const ast = [];
  let token;
  while ((token = reader.peek()) !== closing) {
    if (token === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
}

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new List(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new Vector(ast);
};

const read_hashmap = (reader) => {
  const ast = read_seq(reader, '}');
  if(ast.length % 2 !== 0) {
    throw 'invalid number of entries';
  }
  return new HashMap(ast);
};

const read_form = (reader) => {
  const token = reader.peek();
  switch (token[0]) {
    case '(':
      reader.next();
      return read_list(reader);
    case '[':
      reader.next();
      return read_vector(reader);
    case '{':
      reader.next();
      return read_hashmap(reader);
    case ')':
      reader.next();
      throw 'unexpected';
    case ']':
      reader.next();
      throw 'unexpected';
    case '}':
      reader.next();
      throw 'unexpected';
  }
  reader.next();
  return read_atom(token);
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };