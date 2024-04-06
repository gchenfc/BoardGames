import CanvasNavigation from "./canvas-navigation.js";
import { VisualElement } from "./element.js";
import Point2 from "./point2.js";

/// Game class is a common interface for games
//  Update the game by updating this.visualElements and calling this.updateDraw()
export default class Game {
  constructor(visualElements = {}, debug = false) {
    this.visualElements = visualElements;
    this.canvas = new Canvas(this, debug);
  }

  /***********************************  Functions to Implement  ***********************************/
  /// We received a new game state from the server
  updateGameState(gameState) {
    this._WARNING("updateGameState");
  }

  /// The user click-ed an element
  onElementClick(elementKey) {
    this._WARNING("onElementClick");
  }

  /// The user dragged an element.  This should usually change only appearances but not game state.
  onElementDragStart(elementKey) {
    this._WARNING("onElementDragStart");
  }

  /// The user abandoned dragging an element.  Undo the appearance changes.
  onElementDragStartUndo(elementKey) {
    this._WARNING("onElementDragStart");
  }

  /// The user dragged an element
  onElementDragEnd(elementKey) {
    this._WARNING("onElementDragEnd");
  }

  /**************************  Functions available to use (do not edit)  **************************/
  /// Redraw the canvas
  updateDraw() {
    this.canvas.draw();
  }

  /// Send a move to the server
  sendMove(move) {
    // TODO: implement
  }

  absToBoard(point) {
    return this.canvas.absToBoard(point);
  }

  boardToAbs(point) {
    return this.canvas.boardToAbs(point);
  }

  setFloating(elem, isFloating) {
    const abs = this.canvas.elemParentToAbs(elem.point, elem);
    elem.properties.isFloating = isFloating;
    elem.point = this.canvas.absToElemParent(abs, elem);
  }

  /*******************************  Helper Functions (don't touch)  *******************************/
  // Warning message for unimplemented methods
  _WARNING(fName = "unknown method") {
    console.warn(
      'WARNING! Function "' + fName + '" is not implemented in ' + this.constructor.name
    );
  }
}

/*************************************  CANVAS HELPER CLASS  *************************************/
/// Canvas class is a common interface for drawing on a canvas boilerplate
class Canvas {
  constructor(game, debug = false) {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvasNav = new CanvasNavigation(this.canvas, this.draw.bind(this));
    this.game = game;
    this.visualElements = game.visualElements; // alias
    this.debug = debug;

    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.canvasNav.zoomLevel, this.canvasNav.zoomLevel);
    this.ctx.translate(this.canvasNav.panX, this.canvasNav.panY);

    for (const [key, element] of Object.entries(this.visualElements)) {
      if (!element.properties.isFloating) element.draw(this.ctx, key, this.debug);
    }

    this.ctx.restore();

    for (const [key, element] of Object.entries(this.visualElements)) {
      if (element.properties.isFloating) element.draw(this.ctx, key, this.debug);
    }
  }

  onMouseDown(event) {
    // Check which element was clicked
    // First check floating elements
    const pAbs = new Point2(event.clientX, event.clientY);
    const key = this.elementKeyAtCanvasLocation(
      pAbs,
      (elem) =>
        !elem.properties.isHidden && (elem.properties.isClickable || elem.properties.isDraggable)
    );
    const elem = this.visualElements[key];
    this.startPressObj = key;
    this.startPressLoc = new Point2(event.clientX, event.clientY);
    if (key) {
      this.startPressLocOnElement = this.absToElem(pAbs, elem);
    }
    this.isDragging = false;
    console.log(`Mouse down on ${key}`);
  }

  onMouseMove(event) {
    if (this.startPressObj) {
      const elem = this.visualElements[this.startPressObj];
      if (elem.properties.isDraggable) {
        const pAbs = new Point2(event.clientX, event.clientY);
        if (!this.isDragging && pAbs.distanceTo(this.startPressLoc) > 10) {
          this.game.onElementDragStart(this.startPressObj);
          this.isDragging = true;
        }
        const pElem = this.absToElemParent(pAbs, elem);
        elem.point = pElem.minus(this.startPressLocOnElement);
        this.draw();
      }
    }
  }

  onMouseUp(event) {
    // First check if we should register drag or click
    const pAbs = new Point2(event.clientX, event.clientY);
    if (this.isDragging && pAbs.distanceTo(this.startPressLoc) > 10) {
      // Finished drag
      this.game.onElementDragEnd(this.startPressObj);
      this.isDragging = false;
    } else if (this.startPressObj) {
      const elem = this.visualElements[this.startPressObj];
      if (elem.properties.isDraggable && pAbs.distanceTo(this.startPressLoc) > 0) {
        // Cancelled drag
        elem.point = this.absToElemParent(this.startPressLoc, elem).minus(
          this.startPressLocOnElement
        );
        this.game.onElementDragStartUndo(this.startPressObj);
      } else if (elem.properties.isClickable && elem.inBounds(this.absToElemParent(pAbs, elem))) {
        // Clicked
        this.game.onElementClick(this.startPressObj);
      }
    }

    this.startPressObj = null;
    this.startPressLoc = null;
    this.startPressLocOnElement = null;
    this.draw();
  }

  absToElem(point, element) {
    return this.absToElemParent(point, element).minus(element.point);
  }

  absToElemParent(point, element) {
    return element.properties.isFloating ? point : this.absToBoard(point);
  }

  elemParentToAbs(point, element) {
    return element.properties.isFloating ? point : this.boardToAbs(point);
  }

  absToBoard(point) {
    return new Point2(
      (point.x - this.canvas.width / 2) / this.canvasNav.zoomLevel - this.canvasNav.panX,
      (point.y - this.canvas.height / 2) / this.canvasNav.zoomLevel - this.canvasNav.panY
    );
  }

  boardToAbs(point) {
    return new Point2(
      (point.x + this.canvasNav.panX) * this.canvasNav.zoomLevel + this.canvas.width / 2,
      (point.y + this.canvasNav.panY) * this.canvasNav.zoomLevel + this.canvas.height / 2
    );
  }

  elementKeyAtCanvasLocation(point, filter = (elem) => !elem.properties.isHidden) {
    // First check floating elements, which use absolute coordinates
    // Iterate backwards through the elements to check the top-most element first
    for (const [key, elem] of Object.entries(this.visualElements).reverse()) {
      if (elem.properties.isFloating && filter(elem) && elem.inBounds(point)) {
        return key;
      }
    }

    // Then check board elements, which use relative coordinates
    // Iterate backwards through the elements to check the top-most element first
    const pBoard = this.absToBoard(point);
    for (const [key, elem] of Object.entries(this.visualElements).reverse()) {
      if (!elem.properties.isFloating && filter(elem) && elem.inBounds(pBoard)) {
        return key;
      }
    }

    // Click was not on any element
    return null;
  }
}
