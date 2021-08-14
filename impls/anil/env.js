class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  find(key) {
    if(key in this.data){
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
      throw 'not found';
    }
    return env.data[key];
  }
}

module.exports = Env;