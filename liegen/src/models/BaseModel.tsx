export default class BaseClass {
  serialize() {
    return JSON.parse(JSON.stringify(this));
  }
}