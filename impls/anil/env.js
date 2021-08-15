class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(key, value) {
    this.data[key.symbol] = value;
    return value;
  }

  find(key) {
    if(key.symbol in this.data){
      return this;
    }
    if(!this.outer){
      return null;
    }
    return this.outer.find(key);
  }

  get(key) {
    const env = this.find(key);
    if(!env) {
      throw `'${key.symbol}' not found`;
    }
    return env.data[key.symbol];
  }
}

module.exports = Env;