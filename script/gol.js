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
    /*
     * -----------------------------------------------------------------------------------------------------------------Constants.
     */
    STATE_DEAD: 0,
    STATE_DYING: 1,
    STATE_BORN: 2,
    STATE_ALIVE: 3,
    /*
     * -----------------------------------------------------------------------------------------------------------------Properties.
     */
    neighbors: new Array(8),
    aliveNeighbors: 0,
    state: 0,
    _elementId: '#' + y + '-' + x,
    /*
     * -----------------------------------------------------------------------------------------------------------------Methods.
     */
    /*
     * Returns the current live state of the cell.
     * @returns {Boolean}
     */
    isAlive: function() {
      if(this.state === this.STATE_ALIVE){
        return true;
      }
      return false;
    },
    /*
     * Event handler for toggling Cells before the simulation starts.
     * @returns {undefined}
     */
    toggleAlive: function(){
      var $element = $(this._elementId);
      if(this.state === this.STATE_ALIVE){
        $element.removeClass();
        this.state = this.STATE_DEAD;
      } else {
        $element.addClass('alive');
        this.state = this.STATE_ALIVE;
      }
    },
    
    setNeighborTopLeft: function(cell) {
      this.neighbors[0] = cell;
    },
    
    setNeighborTop: function(cell) {
      this.neighbors[1] = cell;
    },
            
    setNeighborTopRight: function(cell) {
      this.neighbors[2] = cell;
    },
    
    setNeighborRight: function(cell) {
      this.neighbors[3] = cell;
    },
    
    setNeighborBottomRight: function(cell) {
      this.neighbors[4] = cell;
    },
    
    setNeighborBottom: function(cell) {
      this.neighbors[5] = cell;
    },
    
    setNeighborBottomLeft: function(cell) {
      this.neighbors[6] = cell;
    },
    
    setNeighborLeft: function(cell) {
      this.neighbors[7] = cell;
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
   * The error message for a size that is too small.
   * @type String
   */
  _ERROR_MESSAGE_SIZE_TOO_SMALL : "Please specify a size of at least 3.",
          
  /*
   * -------------------------------------------------------------------------------------------------------------------Properties.
   */
   /*
    * The two-dimensional Array holding all cells.
    * @type Array
    */
   _grid: undefined,
   /*
    * Flag for computation. Determines whether to compute the next step of the cells should be computed 
    * or the cells should just change their colors
    * (occurs when cells switch from "dying" to "dead" or from "born" to "alive").
    * @type Boolean
    */
   _isComputeStep: false,
   /*
    * The error message element for the settings fieldset.
    * @type jQuery
    */
   _$settingsErrorMessage: $('#settings-error-message'),
  
  /*
   * -------------------------------------------------------------------------------------------------------------------Methods.
   */

  /**
   * Initializer function.
   * Inserts default grid and controls.
   * @returns {undefined}
   */
  init: function(){
    var $gridContainer = $('#grid-container');
    // Hide the grid and error messages.
    $gridContainer.fadeOut(this.FADE_SPEED);
    this._$settingsErrorMessage.fadeOut(this.FADE_SPEED);
    // Get the size of the grid and initialize it.
    var size = parseInt($('#size-field').val());
    if(isNaN(size)) {
      size = this._DEFAULT_SIZE;
    } else if(size < 3) {
      this._$settingsErrorMessage.text(this._ERROR_MESSAGE_SIZE_TOO_SMALL).fadeIn(this.FADE_SPEED);
      return false;
    } 
    this._initGrid(size);
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
    // The maximum array index in the grid.
    var maxIndex = size -1;
    var isTorus = document.getElementById('torus-checkbox').checked;
    // A dead cell for simulation of dead neighbors in a non-torus-like grid.
    var deadCell = new Cell(-1, -1);
    $grid.html('');
    $grid.width((size * this._CELL_SIZE ) + 'px');
    this._grid = new Array(size);
    var cssClass;
    var i=0, j=0;
    for(i = 0; i < size; i++){
      this._grid[i] = new Array(size);
      cssClass = i === maxIndex ? "bottom" : "";
      $grid.append($('<tr>', {
        id: i,
        class: cssClass
      }));
      $row = $('#'+i);
      for(j = 0; j < size; j++){
        // Instantiate the Cell object.
        this._grid[i][j] = new Cell(j, i);
        // Set the neighbors that are common for all configurations.
        if(i > 0) {
          // If we are not in the first row, we can safely set the top neighbor
          // and also the bottom neighbor of the preceeding row.
          this._grid[i][j].setNeighborTop(this._grid[i-1][j]);
          this._grid[i-1][j].setNeighborBottom(this._grid[i][j]);
          if(j > 0) {
            // We are also not at the start of the row, so we can safely set the top left neighbor.
            this._grid[i][j].setNeighborTopLeft(this._grid[i-1][j-1]);
            this._grid[i-1][j-1].setNeighborBottomRight(this._grid[i][j]);
          }
          if(j < maxIndex) {
            // We are not at the end of the row, so we can safely set the top right neighbor.
            this._grid[i][j].setNeighborTopRight(this._grid[i-1][j+1]);
            this._grid[i-1][j+1].setNeighborBottomLeft(this._grid[i][j]);
          }
        }
        if(j > 0) {
          // We are not at the start of the row, so we can safely set the left neighbor.
            this._grid[i][j].setNeighborLeft(this._grid[i][j-1]);
            this._grid[i][j-1].setNeighborRight(this._grid[i][j]);
        }
        // Set neighbors on the grid boundaries according to the configuration.
        if(isTorus) {
          // Determine the offsets of the neighbors in the row.
          var left = (j - 1 + size) % size;
          var right = (j + 1) % size;
          if(i === maxIndex) {
            // We are in the bottom row, so we have to set the connection between the bottom and top row.
            // Set bottom left neighbor of the current cell.
            this._grid[i][j].setNeighborBottomLeft(this._grid[0][left]);
            // Set the top right neighbor of the bottom left neighbor to the current cell.
            this._grid[0][left].setNeighborTopRight(this._grid[i][j]);
            
            // Set bottom neighbor of the current cell.
            this._grid[i][j].setNeighborBottom(this._grid[0][j]);
            // Set the top neighbor of the bottom left neighbor to the current cell.
            this._grid[0][j].setNeighborTop(this._grid[i][j]);
            
            // Set bottom right neighbor of the current cell.
            this._grid[i][j].setNeighborBottomRight(this._grid[0][right]);
            // Set the top left neighbor of the bottom right neighbor to the current cell.
            this._grid[0][right].setNeighborTopLeft(this._grid[i][j]);
          }
          if(j === maxIndex) {
            // We are at the end of the row, so we have to set the connection between the first and last element.
            this._grid[i][j].setNeighborRight(this._grid[i][0]);
            this._grid[i][0].setNeighborLeft(this._grid[i][j]);
            if(i > 0) {
              // If we are also not in the first row, we have to set top right neighbor.
              this._grid[i][j].setNeighborTopRight(this._grid[i-1][right]);
              this._grid[i-1][right].setNeighborBottomLeft(this._grid[i][j]);
            }
          }
          if( j === 0 && i > 0) {
            // We are in the first cell of the row and not in the first row.
            // That means we have to set the top left neighbor of the current cell.
            this._grid[i][j].setNeighborTopLeft(this._grid[i-1][left]);
            this._grid[i-1][left].setNeighborBottomRight(this._grid[i][j]);
          }
        } else {
          //Set dead cells as neighbors.
          if(j === 0) {
            // We are at the beginning of the row, so set all the left neighbors to dead cells.
            this._grid[i][j].setNeighborLeft(deadCell);
            this._grid[i][j].setNeighborTopLeft(deadCell);
            this._grid[i][j].setNeighborBottomLeft(deadCell);
          }
          if(j === maxIndex) {
            // We are at the end of the row, so set all the rightneighbors to dead cells.
            this._grid[i][j].setNeighborRight(deadCell);
            this._grid[i][j].setNeighborTopRight(deadCell);
            this._grid[i][j].setNeighborBottomRight(deadCell);
          }
          if(i === 0) {
            // We are in the top row, so set the top neighbor to a dead cell.
            this._grid[i][j].setNeighborTopLeft(deadCell);
            this._grid[i][j].setNeighborTop(deadCell);
            this._grid[i][j].setNeighborTopRight(deadCell);
          }
          if(i === maxIndex) {
            // We are in the bottom row, so set the bottom neighbor to a dead cell.
            this._grid[i][j].setNeighborBottomLeft(deadCell);
            this._grid[i][j].setNeighborBottom(deadCell);
            this._grid[i][j].setNeighborBottomRight(deadCell);
          }
        }
        // Determine if the element is the first in the row.
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
        }));
      }
    }
  }
  
  //TODO: Simulation function, animation for cycle
};

$(document).ready(function(){
//  GoL.init();
  $('#controls-wrapper').fadeIn(GoL.FADE_SPEED);
  // Disable default form behavior.
  $('#control-form').submit(function(event){
    event.preventDefault();
    return false;
  });
  $('#create-grid-button').click(function(event){
    event.preventDefault();
    GoL.init();
    return false;
  });
});