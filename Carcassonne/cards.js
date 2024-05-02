/**
 * This contains all the cards in the game.
 * https://en.wikipedia.org/wiki/Carcassonne_(board_game)#
 *
 * There are 4 pieces of information we need for each card:
 * 1. The edges of the card, e.g. "RFCF" (road, field, city, field)
 * 2. Any special symbols on the interior of the card, e.g. "S" (shield), "M" (monastery)
 * 3. Interior connections between edges (e.g. if CFCF could have connected city regions or 2 separate cities)
 * 4. Interior connections between fields (each edge has 2 halves, so we define the connectivity of the 8 half-edges)
 *
 * We also define the full deck of cards, including qty of each card.
 */

import shuffleArray from "../util/shuffle.js";
import { cc } from "./utils.js";

const EDGES = { F: "field", R: "road", W: "river", C: "city" };
const QUALITIES = { M: "monastery", S: "shield" };

export class Card {
  /**
   * @param {string} key Descriptor string for the card
   * @param {string} edges 4-character string representing the edges of the card, in ENWS order
   * @param {string} qualities string representing the special qualities of the card
   * @param {Array[Array[Int]]} connected_edges Sets of connected edges for roads & cities
   * @param {Array[Array[Int]]} connected_fields Sets of connected corners for fields (0/1 is E)
   */
  constructor(edges, qualities, connected_edges, connected_fields, key) {
    this.edges = edges;
    this.qualities = qualities;
    if (typeof connected_edges === "string") connected_edges = cc(connected_edges);
    if (typeof connected_fields === "string") connected_fields = cc(connected_fields);
    this.connected_edges = connected_edges;
    this.connected_fields = connected_fields;
    this.key = key;
  }
}

export const CARDS = [
  new Card("FFFF", "M", "____", "aaaaaaaa", "0r0c_R0+M"), // 4
  new Card("FFFW", "", "____", "aaaaaaaa", "0r0c_R1"), // 2
  new Card("WFWF", "", "____", "baaaabbb", "0r0c_R2_(A)"), // 2
  new Card("FFWW", "", "____", "aaaaabba", "0r0c_R2_(B)"), // 2
  new Card("FCFF", "", "____", "aa__aaaa", "0r1c_R0"), // 5
  new Card("FCFC", "", "____", "aa__aa__", "0r2c_R0_(A)"), // 3
  new Card("CCFF", "", "____", "____aaaa", "0r2c_R0_(B)"), // 2
  new Card("CFCF", "S", "a_a_", "__aa__bb", "0r2c_R0_(C)+C"), // 2
  new Card("CFCF", "", "a_a_", "__aa__bb", "0r2c_R0_(C)"), // 1
  new Card("CCFF", "S", "aa__", "____aaaa", "0r2c_R0_(D)+C"), // 2
  new Card("CCFF", "", "aa__", "____aaaa", "0r2c_R0_(D)+C"), // 3
  new Card("WCWC", "", "abac", "ba__ab__", "0r2c_R2_(A)"), // 1
  new Card("CCWW", "", "aabb", "____abba", "0r2c_R2_(B)"), // 1
  new Card("CCCF", "S", "aaa_", "______aa", "0r3c_R0+C"), // 1
  new Card("CCCF", "", "aaa_", "______aa", "0r3c_R0"), // 3
  new Card("CCCC", "S", "aaaa", "________", "0r4c_R0+C"), // 1
  new Card("FFFR", "M", "____", "aaaaaaaa", "1r0c_R0+M"), // 2
  new Card("WFWR", "M", "w_wr", "baaaaccb", "1r0c_R2+M"), // 1
  new Card("WCWR", "", "w_w_", "baaaabbb", "1r1c_R2"), // 1
  new Card("CCCR", "S", "aaa_", "______ab", "1r3c_R0+C"), // 2
  new Card("CCCR", "", "aaa_", "______ab", "1r3c_R0"), // 1
  new Card("RFRF", "", "a_a_", "baaaabbb", "2r0c_R0_(A)"), // 8
  new Card("FFRR", "", "__aa", "aaaaabba", "2r0c_R0_(B)"), // 9
  new Card("WRWR", "", "abab", "daabbccd", "2r0c_R2_(A)"), // 1
  new Card("RRWW", "", "aabb", "baabbccb", "2r0c_R2_(B)"), // 1
  new Card("RCRF", "", "1_1_", "21__1222", "2r1c_R0_(A)"), // 4
  new Card("FCRR", "", "__11", "11__1221", "2r1c_R0_(B)"), // 3
  new Card("RCFR", "", "1__1", "21__1112", "2r1c_R0_(C)"), // 3
  new Card("CCRR", "S", "1122", "____1221", "2r2c_R0+C"), // 2
  new Card("CCRR", "", "1122", "____1221", "2r2c_R0"), // 3
  new Card("RFRR", "", "1_23", "31111223", "3r0c_R0+V"), // 4
  new Card("RCRR", "", "1_23", "31__1223", "3r1c_R0+V"), // 3
  new Card("RRRR", "", "1234", "41122334", "4r0c_R0+V"), // 1
];

CARDS.forEach(Object.freeze);

export const KEYS_2_CARDS = CARDS.reduce((acc, value) => {
  acc[value.key] = value;
  return acc;
}, {});

const DECK = [].concat(
  Array(4).fill(CARDS[0]),
  Array(2 - 2).fill(CARDS[1]), // starting and ending river tiles
  Array(2).fill(CARDS[2]),
  Array(2).fill(CARDS[3]),
  Array(5).fill(CARDS[4]),
  Array(3).fill(CARDS[5]),
  Array(2).fill(CARDS[6]),
  Array(2).fill(CARDS[7]),
  Array(1).fill(CARDS[8]),
  Array(2).fill(CARDS[9]),
  Array(3).fill(CARDS[10]),
  Array(1).fill(CARDS[11]),
  Array(1).fill(CARDS[12]),
  Array(1).fill(CARDS[13]),
  Array(3).fill(CARDS[14]),
  Array(1).fill(CARDS[15]),
  Array(2).fill(CARDS[16]),
  Array(1).fill(CARDS[17]),
  Array(1).fill(CARDS[18]),
  Array(2).fill(CARDS[19]),
  Array(1).fill(CARDS[20]),
  Array(8).fill(CARDS[21]),
  Array(9).fill(CARDS[22]),
  Array(1).fill(CARDS[23]),
  Array(1).fill(CARDS[24]),
  Array(4 - 1).fill(CARDS[25]), // starting non-river tile
  Array(3).fill(CARDS[26]),
  Array(3).fill(CARDS[27]),
  Array(2).fill(CARDS[28]),
  Array(3).fill(CARDS[29]),
  Array(4).fill(CARDS[30]),
  Array(3).fill(CARDS[31]),
  Array(1).fill(CARDS[32])
);

const DECK_RIVER = [...DECK.filter((card) => card.edges.indexOf("W") !== -1)];
const DECK_NONRIVER = [...DECK.filter((card) => card.edges.indexOf("W") === -1)];

export function ShuffledDeck(withRivers = true) {
  if (withRivers) {
    const ret = [CARDS[1], ...shuffleArray(DECK_RIVER), CARDS[1], ...shuffleArray(DECK_NONRIVER)];
    return ret.reverse();
  } else {
    return [CARDS[25], ...shuffleArray(DECK_NONRIVER)].reverse();
  }
}
