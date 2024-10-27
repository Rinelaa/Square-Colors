let colorCount = 0;
const undoColor = [];
const redoColor = [];


function changeColor() {
    const square = document.querySelector(".square");
    const colorCountElement = document.querySelector(".colorCount");

    
    const colors = ["#4CAF50", "#FFC107", "#03A9F4", "#FF5722", "#9C27B0"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    
    if (square.style.backgroundColor) {
        undoColor.push(square.style.backgroundColor);
        updateUndoList();
    }

    redoColor.length = 0;
    updateRedoList();

    square.style.backgroundColor = randomColor;

    colorCount++;
    colorCountElement.textContent = colorCount;
}

function undoColors() {
    if (undoColor.length > 0) {
        const square = document.querySelector(".square");
        const lastColor = undoColor.pop();

        
        redoColor.push(square.style.backgroundColor);
        updateRedoList();

        
        square.style.backgroundColor = lastColor;
        updateUndoList();
    }
}

function redoColors() {
    if (redoColor.length > 0) {
        const square = document.querySelector(".square");
        const lastColor = redoColor.pop();

        
        undoColor.push(square.style.backgroundColor);
        updateUndoList();

        
        square.style.backgroundColor = lastColor;
        updateRedoList();
    }
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.setData("text/plain", draggedItem.style.backgroundColor);
    setTimeout(() => {
        e.target.style.display = 'none';  
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();  
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedItem !== e.target) {
        const draggedColor = e.dataTransfer.getData("text/plain");
        const targetColor = e.target.style.backgroundColor;

        
        draggedItem.style.backgroundColor = targetColor;
        e.target.style.backgroundColor = draggedColor;

        
        if (draggedItem.parentElement.classList.contains("undoList")) {
            updateColorInList(undoColor, draggedColor, targetColor);
        } else if (draggedItem.parentElement.classList.contains("redoList")) {
            updateColorInList(redoColor, draggedColor, targetColor);
        }
    }
}

function handleDragEnd(e) {
    e.target.style.display = 'block'; 
}

function updateColorInList(list, draggedColor, targetColor) {
    const draggedIndex = list.indexOf(draggedColor);
    const targetIndex = list.indexOf(targetColor);

    if (draggedIndex !== -1) list[draggedIndex] = targetColor;
    if (targetIndex !== -1) list[targetIndex] = draggedColor;
}

 // Për të ruajtur ngjyrën që po tërhiqet

function handleTouchStart(e) {
    draggedItem = e.target;
    
    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0]; // 
        draggedItem.style.position = 'absolute';
        draggedItem.style.zIndex = 1000;
        draggedColor = draggedItem.style.backgroundColor;
        document.addEventListener("touchmove", handleTouchMove, {passive:false});
        e.preventDefault();
    } else {
        console.error("No touch event detected.");
    }
}

function handleTouchMove(e) {

    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        // Lëviz elementin që po tërhiqet në pozicionin e prekjes
        draggedItem.style.left = `${touch.clientX - draggedItem.offsetWidth / 2}px`;
        draggedItem.style.top = `${touch.clientY - draggedItem.offsetHeight / 2}px`;
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    document.removeEventListener("touchmove", handleTouchMove, {passive:false});

    const targetItem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

    if (targetItem && targetItem !== draggedItem) {
        const targetColor = targetItem.style.backgroundColor; 
        draggedItem.style.backgroundColor = targetColor; 
        targetItem.style.backgroundColor = draggedColor; 
    }

    draggedItem = null;
    draggedColor = null;
}

document.querySelectorAll('li').forEach(item => {
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchend', handleTouchEnd);
});

function updateUndoList() {
    const undoList = document.querySelector(".undoList");
    undoList.innerHTML = "";
    undoColor.forEach((color) => {
        const listItem = document.createElement("li");
        listItem.style.backgroundColor = color;
        listItem.draggable = true;

        // Ngjit eventet për drag and drop
        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragover", handleDragOver);
        listItem.addEventListener("drop", handleDrop);
        listItem.addEventListener("dragend", handleDragEnd);

        // Ngjit eventet për touch interactions
        listItem.addEventListener("touchstart", handleTouchStart);
        listItem.addEventListener("touchend", handleTouchEnd);

        undoList.appendChild(listItem);
    });
}

function updateRedoList() {
    const redoList = document.querySelector(".redoList");
    redoList.innerHTML = "";
    redoColor.forEach((color) => {
        const listItem = document.createElement("li");
        listItem.style.backgroundColor = color;
        listItem.draggable = true;

        // Ngjit eventet për drag and drop
        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragover", handleDragOver);
        listItem.addEventListener("drop", handleDrop);
        listItem.addEventListener("dragend", handleDragEnd);

        // Ngjit eventet për touch interactions
        listItem.addEventListener("touchstart", handleTouchStart);
        listItem.addEventListener("touchend", handleTouchEnd);

        redoList.appendChild(listItem);
    });
}


document.addEventListener("DOMContentLoaded", () => {
const toggleRedoButton = document.querySelector('.toggleRedo');
const toggleUndoButton = document.querySelector('.toggleUndo');
const redoListContainer = document.querySelector('.redoContainer .listContainer'); 
const undoListContainer = document.querySelector('.undoContainer .listContainer'); 

toggleRedoButton.addEventListener('click', () => {
    redoListContainer.classList.toggle('active');
    
    if (redoListContainer.classList.contains('active')) {
        redoListContainer.style.display = 'block'; 
    } else {
        redoListContainer.style.display = 'none'; 
    }
});

toggleUndoButton.addEventListener('click', () => {
    undoListContainer.classList.toggle('active');
    
    if (undoListContainer.classList.contains('active')) {
        undoListContainer.style.display = 'block'; 
    } else {
        undoListContainer.style.display = 'none'; 
    }
});
});

document.querySelector(".btn").addEventListener("click", changeColor);
document.querySelector(".undoBtn").addEventListener("click", undoColors);
document.querySelector(".redoBtn").addEventListener("click", redoColors);












 