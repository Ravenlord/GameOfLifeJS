/*!
 * ---------------------------------------------------------------------------------------------------------------------
 * Main application logic for "Game of Life"
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @author Markus Deutschl <deutschl.markus@gmail.com>
 * @copyright (c) 2013, Markus Deutschl
 * @license http://www.gnu.org/licenses/agpl.html AGPLv3
 * @version 0.0.1
 */

/**
 * Cell class.
 * @param {Number} x
 *   The x-Position of the cell.
 * @param {Number} y
 *   The y-Position of the cell.
 * @returns object
 *   An object reprensenting a cell on the field.
 */
Cell = function(x, y){
  if(isNaN(parseInt(x)) || isNaN(parseInt(y))) return undefined;
  return {
    STATE_DEAD: 0,
    STATE_DYING: 1,
    STATE_BORN: 2,
    STATE_ALIVE: 3,
    neighbors: new Array(8),
    aliveNeighbors: 0,
    state: 0,
    _elementId: '#' + y + '-' + x,
    isAlive: function() {
      if(this.state === this.STATE_ALIVE){
        return true;
      }
      return false;
    },
    toggleAlive: function(){
      var $element = $(this._elementId);
      if(this.state === this.STATE_ALIVE){
        $element.removeClass();
        this.state = this.STATE_DEAD;
      } else {
        $element.addClass('alive');
        this.state = this.STATE_ALIVE;
      }
    }
  };
};

/**
 * Main class holding all the functions for GoL.
 */
var GoL = {
  /*
   * Constants.
   * -------------------------------------------------------------------------------------------------------------------
   */
  /*
   * The default number of columns and lines of the grid.
   * @type Number
   */
  _DEFAULT_SIZE: 30,
  /*
   * The default cell size in pixel.
   * @type Number
   */
  _CELL_SIZE: 15,
  /*
   * The speed of fade animations in ms.
   * @type Number
   */
  FADE_SPEED: 1500,
          
  /*
   * Properties.
   * -------------------------------------------------------------------------------------------------------------------
   */
   /*
    * The two-dimensional Array holding all cells.
    * @type Array
    */
   _grid: undefined,
  
  /*
   * Methods.
   * -------------------------------------------------------------------------------------------------------------------
   */

  /**
   * Initializer function.
   * Inserts default grid and controls.
   * @returns {undefined}
   */
  init: function(){
    var $gridContainer = $('#grid-container');
    $gridContainer.fadeOut(this.FADE_SPEED);
    //TODO: insert controls, Handlers for buttons and fields
    this._initGrid(this._DEFAULT_SIZE);
    $gridContainer.fadeIn(this.FADE_SPEED);
  },
  
  /**
   * Grid initializer function.
   * Clears grid and constructs a new one according to size.
   * @param {Number} size
   * @returns {undefined}
   */
  _initGrid: function(size){
    var $grid = $('#grid');
    $grid.html('');
    if(size === undefined || isNaN(size)) {
      size = this._DEFAULT_SIZE;
    }
    $grid.width((size * this._CELL_SIZE ) + 'px');
    this._grid = new Array(size);
    var cssClass;
    var i=0, j=0;
    for(i = 0; i < size; i++){
      this._grid[i] = new Array(size);
      cssClass = i === (size -1) ? "bottom" : "";
      $grid.append($('<tr>', {
        id: i,
        class: cssClass
      }));
      $row = $('#'+i);
      for(j = 0; j < size; j++){
        // Instantiate the Cell object.
        this._grid[i][j] = new Cell(j, i);
        // Determine if the element is the first in the row
        cssClass = j === 0 ? "first " : "";
        // Insert the td into the tabel in the DOM.
        $row.append($('<td>', {
          id: i + "-" + j,
          class: cssClass,
          click: function cellDivClick(event) {
            event.preventDefault();
            var pos = this.id.split('-');
            GoL._grid[pos[0]][pos[1]].toggleAlive();
            return false;
          }
          //TODO: add Handler for click events (before simulation)
        }));
      }
    }
  }
  
  //TODO: Simulation function, animation for cycle
};

$(document).ready(function(){
  GoL.init();
  $('#controls-wrapper').fadeIn(GoL.FADE_SPEED);
});