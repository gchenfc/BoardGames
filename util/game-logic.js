/**
 * GameState should hold the minimum game state information and implement the game logic.
 */
export default class GameStateInterface {
  /**
   * Your constructor should pass in the game state
   */
  constructor() {}

  /**
   * Create a fresh game state with the given number of players.
   */
  static New(numPlayers) {
    this._WARNING("New");
  }

  /**
   * Your class will probably need a Clone function since passing objects over the socket connection
   * only preserves data but not member functions.  This function should return a deep copy of the
   * object.
   */
  static Clone(obj) {
    this._WARNING("Clone");
  }

  /**
   * Implements the game logic for a move.  This function should return true if the move is valid.
   * You may use whatever format you want for the move object, as long as you stay consistent.
   */
  doMove(move) {
    this._WARNING("doMove");
    return false;
  }

  /*******************************  Helper Functions (don't touch)  *******************************/
  // Warning message for unimplemented methods
  _WARNING(fName = "unknown method", message = "") {
    console.warn(
      'WARNING! Function "' +
        fName +
        '" is not implemented in ' +
        this.constructor.name +
        ". " +
        message
    );
  }
}
