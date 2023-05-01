import { AnimationStatus, CardForPlayerInterface, PlayerInterface } from "../types/models";
import { CardSuits, CardRanks } from "../constants";

import store from "../store";

export const checkStore = () => {
  const slice = store.getState();
}

export const generatePlayers = () : Array<PlayerInterface> => {
  const player1Cards : Array<CardForPlayerInterface> = [
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.TWO,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
  ];
  const player2Cards : Array<CardForPlayerInterface> = [
    {
      suitIndex: CardSuits.DIAMONDS,
      rankIndex: CardRanks.SEVEN,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.DIAMONDS,
      rankIndex: CardRanks.EIGHT,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.DIAMONDS,
      rankIndex: CardRanks.NINE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.SPADES,
      rankIndex: CardRanks.JACK,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.SPADES,
      rankIndex: CardRanks.KING,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    {
      suitIndex: CardSuits.SPADES,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
  ];
  return [
    {
      userID: '', 
      username: '',
      connected: false,
      ready: false,
      name: 'manno',
      cards: player1Cards,
      index: 0,
      selectedRank: 0,
      originPoint: {
        x: 0,
        y: 0,
      }
    },
    {
      userID: '', 
      username: '',
      connected: false,
      ready: false,
      name: 'manno2',
      // cards: player2Cards,
      cards: [
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.ACE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.ACE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.SEVEN,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.EIGHT,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.NINE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.ACE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.SEVEN,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.EIGHT,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.NINE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.ACE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.DIAMONDS,
          rankIndex: CardRanks.NINE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.JACK,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.KING,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
        {
          suitIndex: CardSuits.SPADES,
          rankIndex: CardRanks.ACE,
          faceDown: true,
          selected: false,
          originPoint: {
            x: 0,
            y: 0,
          },
          receiveAnimationStatus: AnimationStatus.IDLE
        },
      ],
      index: 1,
      selectedRank: 0,
      originPoint: {
        x: 0,
        y: 0,
      }
    },
    // {
    //   name: 'manno3',
    //   cards: [
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     // {
    //     //   suitIndex: CardSuits.SPADES,
    //     //   rankIndex: CardRanks.ACE,
    //     //   faceDown: true,
    //     //   selected: false,
    //     //   originPoint: {
    //     //     x: 0,
    //     //     y: 0,
    //     //   },
    //     //   receiveAnimationStatus: AnimationStatus.IDLE
    //     // },
    //   ],
    //   index: 2,
    //   selectedRank: 0,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   }
    // },
    // {
    //   name: 'manno4',
    //   cards: [
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.JACK,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.KING,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //     {
    //       suitIndex: CardSuits.SPADES,
    //       rankIndex: CardRanks.ACE,
    //       faceDown: true,
    //       selected: false,
    //       originPoint: {
    //         x: 0,
    //         y: 0,
    //       },
    //       receiveAnimationStatus: AnimationStatus.IDLE
    //     },
    //   ],
    //   index: 3,
    //   selectedRank: 0,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   }
    // },
  ];
}