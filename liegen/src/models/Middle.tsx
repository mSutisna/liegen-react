import { MiddleCardInterface, MiddleInterface, SetInterface } from '../types/models';
import BaseModel from './BaseModel';

export default class Middle extends BaseModel implements MiddleInterface {
  set: SetInterface | null;
  previousCards: MiddleCardInterface[];

  constructor() {
    super();
    this.set = null;
    this.previousCards = [];
  }
}