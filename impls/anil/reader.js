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
  return token;
};

const read_list = (reader) => {
  const ast = [];
  let token;
  while ((token = reader.peek()) !== ')') {
    if (token === undefined) {
      throw new Error('unbalanced');
    }
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
};

const read_form = (reader) => {
  const token = reader.peek();
  switch (token[0]) {
    case '(':
      reader.next();
      return read_list(reader);
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