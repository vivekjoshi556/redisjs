/**
 * This is the singleton implementation of the store where data is saved.
 */
module.exports = class Store {
  static instance;

  constructor(data={}) {
    if (!Store.instance) {
      Store.instance = this;
      this.data = data;
    }

    return Store.instance;
  }
}