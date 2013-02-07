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
 * @returns object
 *   An object reprensenting a cell on the field.
 */
Cell = function(){
  return {
    STATE_DEAD: 0,
    STATE_DYING: 1,
    STATE_BORN: 2,
    STATE_ALIVE: 3,
    neighbors: new Array(8),
    aliveNeighbors: 0,
    state: 0,
    isAlive: function() {
      if(this.state === this.STATE_ALIVE){
        return true;
      }
      return false;
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
  _FADE_SPEED: 1500,
          
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
    //TODO: insert controls, Handlers for buttons and fields
    this.initGrid(this._DEFAULT_SIZE);
    $gridContainer.fadeIn(this._FADE_SPEED);
  },
  
  /**
   * Grid initializer function.
   * Clears grid and constructs a new one according to size.
   * @param Number size
   * @returns {undefined}
   */
  initGrid: function(size){
    var $grid = $('#grid');
    $grid.html('');
    if(size === undefined || isNaN(size)) {
      size = this._DEFAULT_SIZE;
    }
    $grid.width((size * this._CELL_SIZE ) + 'px');
    this._grid = new Array(size);
    var row, cell, cssClass;
    for(i = 0; i < size; i++){
      this._grid[i] = new Array(size);
      cssClass = i === (size -1) ? "bottom" : "";
      $grid.append($('<tr>', {
        id: i,
        class: cssClass
      }));
      $row = $('#'+i);
      for(j = 0; j < size; j++){
        this._grid[i][j] = new Cell();
        cssClass = j === 0 ? "first " : "";
        $row.append($('<td>', {
          id: i + "-" + j,
          class: cssClass
          //TODO: add Handler for click events (before simulation)
        }));
      }
    }
  }
  
  //TODO: Simulation function, animation for cycle
};

$(document).ready(function(){
  GoL.init();
});