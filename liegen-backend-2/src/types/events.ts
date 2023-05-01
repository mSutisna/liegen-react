import { SerializedPlayer, PlayerCard } from "./data.js"

export interface EventReceiveCard {
  player: SerializedPlayer,
  card: PlayerCard
}