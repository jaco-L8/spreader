


const boxContainer = document.getElementById('box_container');
const reset = document.getElementById('reset');
const levelSelect = document.getElementById('level-select');
const levelSelectButton = document.getElementById('apply-level');

let numRows = 3;
let numColumns = 3;
let changedBoxes = new Set(); // Set to store IDs of changed boxes
let numChangedBoxes = 0;
let level = 4;
let levels;

fetch('levels.json')
    .then(response => response.json())
    .then(data => {
        levels = data;
        createGrid(); // creates innitial grid
        createLevelSelect(); // creates level select dropdown menu (temporary)
    });

// Add event listeners to the buttons
boxContainer.addEventListener('click', handleBoxClick);
reset.addEventListener('click', resetGrid);

// Add event listener to the window to update the grid when the window is resized
window.addEventListener('resize', function updateGrid() {
    // Set the grid style
    setGridStyle();
});


function calculateStyle() {
    // Get the level data for the current level
    const levelData = levels.find(l => l.level === level);
    const shape = levelData.shape;
    const numRows = shape.length;
    const numColumns = shape[0].length;

    // Get the current screen width and height
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    console.log(`The current screen width is ${screenWidth} and the current screen height is ${screenHeight}`);

    // Calculate the aspect ratio of the screen
    const screenAspectRatio = screenWidth / screenHeight;

    // Determine if it's a mobile device based on screen width and device pixel ratio
    const isMobile = screenWidth <= 768 && window.devicePixelRatio >= 2;

    // Adjust parameters based on device type
    const baseSize = isMobile ? 30 : 45; // Adjust these values for mobile and desktop
    const baseGap = baseSize / 10;
    const baseBorderRadius = baseSize / 5;

    // Calculate the adjusted size and gap based on screen aspect ratio
    const aspectRatioFactor = 1 + (Math.abs(screenAspectRatio - 1) * 0.2);
    const boxSize = baseSize * aspectRatioFactor;
    const gridGap = baseGap * aspectRatioFactor;
    const borderRadius = baseBorderRadius * aspectRatioFactor;

    // Calculate size adjustment based on the number of rows and columns
    const sizeAdjustment = 0.3 * (numRows + numColumns);

    // Apply size adjustment
    const adjustedBoxSize = boxSize - sizeAdjustment;
    const adjustedGridGap = gridGap - (sizeAdjustment / 10);
    const adjustedBorderRadius = borderRadius - (sizeAdjustment / 5);

    console.log(`The style is set to boxSize: ${adjustedBoxSize}px, gridGap: ${adjustedGridGap}px, borderRadius: ${adjustedBorderRadius}px`);

    return { boxSize: `${adjustedBoxSize}px`, gridGap: `${adjustedGridGap}px`, borderRadius: `${adjustedBorderRadius}px` };
}


// Set the style for the grid and boxes
function setGridStyle() {
    // Get the level data for the current level
    const levelData = levels.find(l => l.level === level);
    const shape = levelData.shape;
    const numRows = shape.length;
    const numColumns = shape[0].length;
    const style = calculateStyle();

    boxContainer.style.gridTemplateColumns = `repeat(${numColumns}, ${style.boxSize})`;
    boxContainer.style.gridTemplateRows = `repeat(${numRows}, ${style.boxSize})`;
    boxContainer.style.gap = style.gridGap;

    const boxes = document.querySelectorAll('.box , .clear-box');
    boxes.forEach(box => {
        box.style.width = style.boxSize;
        box.style.height = style.boxSize;
        box.style.borderRadius = style.borderRadius;
    });

    // Calculate the vertical padding to center the grid
    const totalGridHeight = numRows * parseInt(style.boxSize) + (numRows - 1) * parseInt(style.gridGap) - 2 * parseInt(style.gridGap);
    const windowHeight = window.innerHeight;
    const paddingVertical = (windowHeight - totalGridHeight) / 2;
    boxContainer.style.paddingTop = `${paddingVertical}px`;
    console.log(`the screen hight is ${windowHeight} the padding is ${paddingVertical}`);
}

// Create the grid
function createGrid() {
    // Get the level data for the current level
    const levelData = levels.find(l => l.level === level);
    const shape = levelData.shape;
    const numRows = shape.length;
    const numColumns = shape[0].length;

    console.log(`the current level is ${level} that has a length of ${numRows} rows and ${numColumns} columns`);

    // Clear the existing grid
    boxContainer.innerHTML = '';

    // Create the new grid
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= numColumns; j++) {
            const box = document.createElement('div');
            box.id = `y${i} x${j}`;

            if (shape[i - 1][j - 1] === "x") {
                box.classList.add("box");
            } else if (shape[i - 1][j - 1] === "-") {
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

    // Set the grid style
    setGridStyle();

}

// Update the grid when the window is resized



// Reset the grid
function resetGrid() {
    changedBoxes.clear(); // Clear set of changed boxes
    createGrid();
    numChangedBoxes = 0;
    boxContainer.addEventListener('click', handleBoxClick);
}



function handleBoxClick(event) {
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



const RIPPLE_DELAY = 100; // 100 milliseconds delay for ripple effect

function changeNeighborClass(box, Recursions) {
    const levelData = levels.find(l => l.level === level);
    const RealRecursions = levelData.recursions;
    const id = box.id.split(' ');
    const y = parseInt(id[0].substring(1));
    const x = parseInt(id[1].substring(1));
    const recursions = Recursions || 0;

    const positions = [
        { y: y, x: x - 1 },  // Left
        { y: y, x: x + 1 },  // Right
        { y: y - 1, x: x },  // Above
        { y: y + 1, x: x }   // Below
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



/* following is temp  */  

// Function to apply the selected level
function applyLevel() {
    const selectedLevel = parseInt(levelSelect.value);
    // Check if the selected level is valid
    if (selectedLevel >= 0 && selectedLevel <= levels.length) {
        // Update the level variable
        level = selectedLevel;
        // Recreate the grid with the new level
        createGrid();
    } else {
        // Display an error message if the selected level is invalid
        alert('Invalid level selected');
    }
}
// Function to create the level select dropdown menu
function createLevelSelect() {
    // Get the level options from the levels data
    const levelOptions = levels.map(l => `<option value="${l.level}">${l.level} - ${l.label}</option>`).join('');
    // Get the level select dropdown menu element from the HTML
    levelSelect.innerHTML = levelOptions;
    // Add event listener to the level select button
    levelSelectButton.addEventListener('click', applyLevel);
}
