import type Player from "./Player.js";
import { CardRanks } from "../constants.js";
import type Card from "./Card.js";
import { SerializedSet } from "../types/data.js";

export default class Set {
  player: Player;
  rank: CardRanks;
  amount: number;
  actualCards: Array<Card>;

  constructor(player: Player, rank: CardRanks, amount: number, actualCards: Array<Card>) {
    this.player = player;
    this.rank = rank;
    this.amount = amount;
    this.actualCards = actualCards;
  }

  serialize(): SerializedSet {
    const actualCards = [];
    for (const actualCard of this.actualCards) {
      actualCards.push(actualCard.serialize())
    }
    return {
      player: this.player.serialize(true),
      rank: this.rank,
      amount: this.amount,
      actualCards
    }
  }

  bust(playerThatCalledBust: Player) {
    let playerToGiveCardsTo = playerThatCalledBust;
    let playerToSwitchTo = this.player;
    for (let i = 0; i < this.actualCards.length; i++) {
      const card = this.actualCards[i];
      if (card.getRank() !== this.rank) {
        playerToGiveCardsTo = this.player;
        playerToSwitchTo = playerThatCalledBust;
        break; 
      }
    }
    return {
      playerToGiveCardsTo,
      playerToSwitchTo
    };
  }

  getPlayer() {
    return this.player;
  }

  getRank() {
    return this.rank;
  }

  getAmount() {
    return this.amount;
  }

  getActualCards() {
    return this.actualCards;
  }
};