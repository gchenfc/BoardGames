import CanvasNavigation from "./canvas-navigation.js";
import { VisualElement, SelectBehaviors } from "./element.js";
import Point2 from "./point2.js";
import { Client } from "./client.js";

/// Game class is a common interface for games
//  Update the game by updating this.visualElements and calling this.updateDraw()
export default class Game {
  GameState = undefined;

  constructor(visualElements = {}, debug = false) {
    this.visualElements = visualElements;
    this.canvas = new Canvas(this, debug);
    this.selectedElemContext = null;
    this.client = new Client(this);
  }

  /***********************************  Functions to Implement  ***********************************/
  /// We received a new game state from the server
  updateGameState(gameState) {
    this._WARNING("updateGameState");
  }

  validMoves(elemKey) {
    this._WARNING(
      "validMoves",
      "Return either:\n" +
        "\t- Array[ElementKeys] an array of valid elements to drop onto\n" +
        "\t- Callable[Point2] -> bool a function that checks if a point is a valid drop location"
    );
  }

  tryMoveElemToElem(fromElemKey, toElemKey) {
    this._WARNING("tryMoveElemToElem");
  }

  tryMoveElemToPoint(fromElemKey, toPoint) {
    this._WARNING("tryMoveElemToPoint");
  }

  buttonClicked(buttonKey) {
    this._WARNING("buttonClicked");
  }

  /******************************  Optional Functions to Implement  ******************************/
  /// The user click-ed an element
  onElementClick(clickedElemContext) {
    console.log(`Clicked ${clickedElemContext.key}, selected was ${this.selectedElemContext?.key}`);
    if (this.selectedElemContext) {
      // We already have an element selected
      console.assert(this.selectedElemContext.validMovesType == "elem");
      if (this.selectedElemContext.validMoves.includes(clickedElemContext.key)) {
        this.tryMoveElemToElem(this.selectedElemContext.key, clickedElemContext.key);
        // Un-select the element
        this.selectedElemContext.elem.state.isSelected = false;
        this.selectedElemContext = null;
      } else {
        // Unselect the element and move it back to its original position if necessary
        this.selectedElemContext.elem.state.isSelected = false;
        if (
          this.selectedElemContext.elem.properties.selectBehavior == SelectBehaviors.FOLLOW_MOUSE
        ) {
          this.selectedElemContext.elem.point = this.selectedElemContext.origElemPoint;
        }
        this.selectedElemContext = null;
        if (!clickedElemContext.key) return;
        // Fall through and potentially select a new element
      }
    }

    if (!this.selectedElemContext) {
      // We didn't currently have anything selected
      if (clickedElemContext.elem.properties.isClickable) {
        this.buttonClicked(clickedElemContext.key);
      } else if (clickedElemContext.elem.properties.isSelectable) {
        // This is now the selected element
        this.selectedElemContext = clickedElemContext;
        this.selectedElemContext.elem.state.isSelected = true;
      } else {
        // This element is not clickable or selectable so do nothing
      }
    }
  }

  /// The user click-ed the canvas
  onPointClick(point) {
    if (this.selectedElemContext) {
      point = this.canvas.absToElemParent(point, this.selectedElemContext.elem);
      console.assert(this.selectedElemContext.validMovesType == "point");
      if (this.selectedElemContext.validMoves(point)) {
        this.tryMoveElemToPoint(this.selectedElemContext.key, point);
        this.selectedElemContext = null;
      } else {
        this.selectedElemContext = null; // fall through
      }
    }
    if (!this.selectedElemContext) {
      // We didn't currently have anything selected - do nothing
    }
  }

  /**************************  Functions available to use (do not edit)  **************************/
  /// Redraw the canvas
  updateDraw() {
    this.canvas.draw();
  }

  /// Send a move to the server
  sendMove(move) {
    return this.client.sendMove(move);
  }

  addEventListener(...args) {
    this.canvas.canvas.addEventListener(...args);
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

  ClickedElemContext(key, pClicked) {
    const elem = this.visualElements[key];
    const validMoves = this.validMoves(key);
    const validMovesType =
      validMoves instanceof Array ? "elem" : validMoves instanceof Function ? "point" : null;
    const pElem = this.canvas.absToElem(pClicked, elem);

    return {
      key: key,
      elem: elem,
      validMovesType: validMovesType,
      validMoves: validMoves,
      pElem: pElem, // pClicked relative to elem
      pAbs: pClicked, // pClicked absolute
      origElemPoint: elem.point, // original elem point in its parent's coordinates
    };
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

    if (!("ontouchstart" in window)) {
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.THRESHOLD = 0;
    } else {
      this.canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          return this.onMouseDown(e.touches[0]);
        }
      });
      this.canvas.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1) {
          return this.onMouseMove(e.touches[0]);
        }
      });
      this.canvas.addEventListener("touchend", (e) => {
        if (e.touches.length === 0) {
          return this.onMouseUp(e.changedTouches[0]);
        }
      });
      this.THRESHOLD = 5;
    }
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
    const pAbs = new Point2(event.clientX, event.clientY);
    const key = this.elementKeyAtCanvasLocation(
      pAbs,
      /*filter*/ (elem) =>
        !elem.state.isHidden &&
        (this.game.selectedElemContext ||
          elem.properties.isClickable ||
          elem.properties.isDraggable ||
          elem.properties.isSelectable) &&
        !elem.state.isSelected
    );

    if (key) {
      this.mouseDownContext = this.game.ClickedElemContext(key, pAbs);
    } else {
      this.mouseDownContext = {
        pAbs: pAbs,
        key: null,
        elem: null,
        validMovesType: null,
        validMoves: null,
        pElem: null,
        origElemPoint: null,
      };
    }
  }

  onMouseMove(event) {
    if (event instanceof Touch || event.buttons > 0) {
      this.onMouseDrag(event);
    } else {
      this.onMouseHover(event);
    }
  }

  onMouseUp(event) {
    // First check if we should register drag or click
    const pAbs = new Point2(event.clientX, event.clientY);

    if (pAbs.distanceTo(this.mouseDownContext.pAbs) > this.THRESHOLD) {
      // DRAG
      if (!this.mouseDownContext.key) {
        // Dragged from empty space, do nothing
      } else if (this.mouseDownContext.validMovesType === "elem") {
        const key = this.elementKeyAtCanvasLocation(
          pAbs,
          (elem) => !elem.properties.isHidden && !elem.state.isDragging
        );
        console.log("Valid moves: ", this.mouseDownContext.validMoves, "Key: ", key);
        this.mouseDownContext.elem.state.isDragging = false;
        if (
          this.mouseDownContext.validMoves.includes(key) &&
          this.game.tryMoveElemToElem(this.mouseDownContext.key, key)
        ) {
          // ok!
        } else {
          // revert
          this.mouseDownContext.elem.point = this.mouseDownContext.origElemPoint;
        }
      } else if (this.mouseDownContext.validMovesType === "point") {
        const point = this.absToElemParent(pAbs, this.mouseDownContext.elem);
        if (
          this.mouseDownContext.validMoves(point) &&
          this.game.tryMoveElemToPoint(
            this.mouseDownContext.key,
            this.absToElemParent(pAbs, this.mouseDownContext.elem)
          )
        ) {
          // ok!
        } else {
          // revert
          this.mouseDownContext.elem.point = this.mouseDownContext.origElemPoint;
        }
      } else {
        // Invalid move type
        console.error("Invalid move type: ", this.mouseDownContext.validMovesType);
        this.mouseDownContext.elem.point = this.mouseDownContext.origElemPoint;
      }
    } else {
      // CLICK
      if (this.game.selectedElemContext) {
        // We already have a selected element, so this must be a target click
        if (this.game.selectedElemContext.validMovesType === "elem") {
          this.game.onElementClick(this.mouseDownContext);
        } else if (this.game.selectedElemContext.validMovesType === "point") {
          this.game.onPointClick(pAbs);
        } else {
          // Pass
        }
      } else {
        // No selected element, so we must be selecting a new element
        if (this.mouseDownContext.key) {
          this.game.onElementClick(this.mouseDownContext);
        }
      }
    }

    this.mouseDownContext = null;
    this.draw();
  }

  onMouseDrag(event) {
    if (this.mouseDownContext.key) {
      // Dragging an element
      if (this.mouseDownContext.elem.properties.isDraggable) {
        const pAbs = new Point2(event.clientX, event.clientY);
        const pElemParent = this.absToElemParent(pAbs, this.mouseDownContext.elem);
        this.mouseDownContext.elem.point = pElemParent.minus(this.mouseDownContext.pElem);
        this.mouseDownContext.elem.state.isDragging = true;
        this.draw();
      }
    } else {
      // Dragging blank space -> default to pan
      const absPnew = new Point2(event.clientX, event.clientY);
      this.canvasNav.manualPan(
        absPnew.minus(this.mouseDownContext.pAbs).scale(1 / this.canvasNav.zoomLevel)
      );
      this.mouseDownContext.pAbs = absPnew;
    }
  }

  onMouseHover(event) {
    if (
      this.game.selectedElemContext &&
      this.game.selectedElemContext.elem.properties.selectBehavior == SelectBehaviors.FOLLOW_MOUSE
    ) {
      console.assert(
        this.game.selectedElemContext.elem.state.isSelected,
        "selectedElemContext should be selected"
      );
      const pAbs = new Point2(event.clientX, event.clientY);
      this.game.selectedElemContext.elem.point = this.absToElemParent(
        pAbs,
        this.game.selectedElemContext.elem
      ).minus(this.game.selectedElemContext.pElem);
      this.draw();
    }
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
