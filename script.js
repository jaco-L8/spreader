const boxContainer = document.getElementById('box_container');
const rowAdd = document.getElementById('row-add');
const rowSubtract = document.getElementById('row-subtract');
const columnAdd = document.getElementById('column-add');
const columnSubtract = document.getElementById('column-subtract');
const reset = document.getElementById('reset');

let numRows = 3;
let numColumns = 3;
let changedBoxes = new Set(); // Set to store IDs of changed boxes
let level = 4;
let levels;


fetch('levels.json')
  .then(response => response.json())
  .then(data => {
    levels = data;
    createGrid();
  });
 

// Add event listeners to the buttons
boxContainer.addEventListener('click', handleBoxClick);
reset.addEventListener('click', resetGrid);


// Create the grid
function createGrid() {
    // Get the level data for the current level
    const levelData = levels.find(l => l.level === level);
    const shape = levelData.shape;
    const numRows = shape.length;
    const numColumns = shape[0].length;


    // Set the grid template columns and rows
    boxContainer.style.gridTemplateColumns = `repeat(${numColumns}, 100px)`;
    boxContainer.style.gridTemplateRows = `repeat(${numRows}, 100px)`;
    // Clear the existing grid
    boxContainer.innerHTML = '';

    // Create the new grid
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= numColumns; j++) {
            const box = document.createElement('div');
            //box.textContent = `${i}, ${j}`; // remove this line later
            box.id = `y${i} x${j}`;

            if (shape[i - 1][j - 1] === "x") {
                box.classList.add("box");
                }
            else if (shape[i - 1][j - 1] === "-") {
                box.classList.add("spreader", "box");
              } else {
                box.classList.add("clear-box");
              }
            
            if (changedBoxes.has(box.id)) { // Add "clicked" class if box was changed
                box.classList.add('clicked');
            }

            boxContainer.appendChild(box);
        }
    }
}
let numChangedBoxes = 0;

function handleBoxClick(event) {
    console.log('here');
    const levelData = levels.find(l => l.level === level);
    const boxes = document.querySelectorAll('.box'); // Moved here so it updates every time
    const box = event.target;
    const clicks = levelData.clicks;

    // Check if the clicked element is a box and doesn't have the 'clicked' class
    if (Array.from(boxes).includes(box) && !box.classList.contains('clicked')) {
        box.classList.add('clicked');
        box.classList.remove('spreader');
        changeNeighborClass(box, levelData.recursions);
        changedBoxes.add(box.id);

        numChangedBoxes++;

        // If all boxes have the 'clicked' class
        if (numChangedBoxes === boxes.length || numChangedBoxes === clicks) {
            boxContainer.removeEventListener('click', handleBoxClick);
        }
    }
}

// Reset the grid
function resetGrid() {
    changedBoxes.clear(); // Clear set of changed boxes
    createGrid();
    numChangedBoxes = 0;
    boxContainer.addEventListener('click', handleBoxClick);
}

const RIPPLE_DELAY = 100; // 100 milliseconds delay for ripple effect

function changeNeighborClass(box , Recursions) {
    const levelData = levels.find(l => l.level === level);
    const RealRecursions = levelData.recursions;
    const id = box.id.split(' ');
    const y = parseInt(id[0].substring(1));
    const x = parseInt(id[1].substring(1));
    const recursions = Recursions || 0;

    const positions = [
        {y: y, x: x-1},  // Left
        {y: y, x: x+1},  // Right
        {y: y-1, x: x},  // Above
        {y: y+1, x: x}   // Below
    ];

    positions.forEach(pos => {
        const neighborBox = document.getElementById(`y${pos.y} x${pos.x}`);
        if (neighborBox && !neighborBox.classList.contains('clicked') && neighborBox.classList.contains('box')) {
            setTimeout(() => { // add a delay here
               neighborBox.classList.add('clicked');    
                changedBoxes.add(neighborBox.id);
                // Recursively apply ripple effect
                if (recursions > 0) {
                    changeNeighborClass(neighborBox, recursions - 1); 

                }
                if (neighborBox.classList.contains('spreader')) {
                        changeNeighborClass(neighborBox, RealRecursions);
                        neighborBox.classList.remove('spreader');
                    }
                neighborBox.classList.remove('spreader');

                
            }, RIPPLE_DELAY);
        }
    });
}

// change a box to clear-box
function changeBoxToClearBox(boxId) {
    const box = document.getElementById(boxId);
    if (box) {
        box.classList.add('clear-box');
        box.classList.remove('clicked', 'box');
        
    }
}


// debug

// 

//old code
// function debounce(func, delay) {
//     let timeoutId;
//     return function(...args) {
//         if (timeoutId) {
//             clearTimeout(timeoutId);
//         }
//         timeoutId = setTimeout(() => {
//             func.apply(this, args);
//             timeoutId = null;
//         }, delay);
//     };
// }
// Add and subtract rows and columns
// function addRow() {
//     if (numRows < 10) { // Limit to 10 rows
//         numRows++;
//         createGrid(numRows, numColumns);
//     }
// }

// function subtractRow() {
//     if (numRows > 3) { // Limit to 3 rows
//         numRows--;
//         createGrid(numRows, numColumns);
//     }
// }

// function addColumn() {
//     if (numColumns < 10) { // Limit to 10 columns
//         numColumns++;
//         createGrid(numRows, numColumns);
//     }
// }

// function subtractColumn() {
//     if (numColumns > 3) { // Limit to 3 columns
//         numColumns--;
//         createGrid(numRows, numColumns);
//     }
// }

// rowAdd.addEventListener('click', addRow);
// rowSubtract.addEventListener('click', subtractRow);
// columnAdd.addEventListener('click', addColumn);
// columnSubtract.addEventListener('click', subtractColumn);