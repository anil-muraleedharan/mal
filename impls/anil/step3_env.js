const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { Symbol, List, Vector, HashMap, Nil } = require('./types');
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
    return env.get(ast);
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
  switch (ast.ast[0].symbol) {
    case 'def!':
      const key = ast.ast[1]
      const value = EVAL(ast.ast[2], env)
      return env.set(key, value);

    case 'let*':
      const newEnv = new Env(env);
      const bindings = ast.ast[1].ast;
      const expression = ast.ast[2];
      for(let i = 0; i < bindings.length; i += 2) {
        const key = bindings[i];
        const value = EVAL(bindings[i+1], newEnv);
        newEnv.set(key, value);
      }
      return EVAL(expression, newEnv);

    default:
      const newList = eval_ast(ast, env);
      const fn = newList.ast[0];
      return fn.apply(null, newList.ast.slice(1));
  }
}

const PRINT = (ast) => pr_str(ast);

const env = new Env(null);
env.set(new Symbol('+'), (a, b) => a + b);
env.set(new Symbol('-'), (a, b) => a - b);
env.set(new Symbol('*'), (a, b) => a * b);
env.set(new Symbol('/'), (a, b) => a / b);

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