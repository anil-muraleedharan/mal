const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { Symbol, List, Vector, HashMap } = require('./types');
const Env = require('./env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const eval_list = (ast, env) => {
  const newList = ast.ast.map((ele) => EVAL(ele, env));
  return new List(newList);
}

const eval_vector = (ast, env) => {
  const newVector = ast.ast.map((ele) => EVAL(ele, env));
  return new Vector(newVector);
}

const eval_hashmap = (ast, env) => {
  const newList = [];
  ast.hashmap.forEach((value, key) => {
    newList.push(EVAL(key, env));
    newList.push(EVAL(value, env));
  })
  return new HashMap(newList);
}

const eval_ast = (ast, env) => {
  if(ast instanceof Symbol) {
    return env.get(ast.symbol);
  }
  if(ast instanceof List) {
    return eval_list(ast, env);
  }
  if(ast instanceof Vector) {
    return eval_vector(ast, env);
  }
  if(ast instanceof HashMap) {
    return eval_hashmap(ast, env);
  }
  return ast;
}

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  if(!(ast instanceof List)) {
    return eval_ast(ast, env);
  }
  if(ast.isEmpty()) {
    return ast;
  }
  const newList = eval_ast(ast, env);
  const fn = newList.ast[0];
  return fn.apply(null, newList.ast.slice(1));
}

const PRINT = (ast) => pr_str(ast);

const env = new Env(null);
env.set('+', (a, b) => a + b);
env.set('-', (a, b) => a - b);
env.set('*', (a, b) => a * b);
env.set('/', (a, b) => a / b);

const rep = (str) =>  PRINT(EVAL(READ(str), env));

const loop = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (error) {
      console.log(error);
    } finally {
      loop();
    }
  });
}

loop();