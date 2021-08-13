const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const READ = (str) => read_str(str);

const EVAL = (ast) => ast;

const PRINT = (ast) => pr_str(ast);

const rep = (str) =>  PRINT(READ(EVAL(str)));

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