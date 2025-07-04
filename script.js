let CountFolder = 1;
let desktop = document.getElementById("desktop");
let open = document.getElementById("open");
let deletes = document.getElementById("delete");

// Global variable to track selected folder
let selectedFolder = null;



// ✅New folder creation in UI
function createFolder(folder) {

    let icon = document.createElement("div")
    icon.className = "icon flex flex-col items-center mt-4 text-sm text-center cursor-pointer";
    icon.setAttribute("folder-name", folder.name);
    
    let img = document.createElement("img");
    img.src = "https://img.icons8.com/fluency/48/folder-invoices--v1.png";
    img.alt = "folder";
    img.className = "w-11 h-11 object-contain";

    let label = document.createElement("span");
    label.className = "text-sm";
    label.textContent = folder.name;

    icon.appendChild(img);
    icon.appendChild(label);

    // Add double-click event for folder opening
    icon.addEventListener("dblclick", function(e) {
        e.stopPropagation();
        e.preventDefault();
        isDoubleClicking = true;
        
        // Clear any existing timer
        if (doubleClickTimer) {
            clearTimeout(doubleClickTimer);
        }
        
        // Set a timer to reset the double-click flag
        doubleClickTimer = setTimeout(() => {
            isDoubleClicking = false;
        }, 300);
        
        // Open the folder window
        openFolderWindow(folder.name);
    });

    icon.addEventListener("click", function(e){
        // Remove selection from all icons
        document.querySelectorAll(".icon").forEach((el) => {
            el.classList.remove("selected");
        });
        // Add selection to this icon
        icon.classList.add("selected");
        selectedFolder = folder;
    });
    
    // Add contextmenu event for folder menu
    icon.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        document.querySelectorAll(".icon").forEach((el) => {
            el.classList.remove("selected");
        });
        icon.classList.add("selected");

        let folderMenu = document.getElementById("folder-menu");
        if (folderMenu) {
            folderMenu.style.left = `${e.pageX}px`;
            folderMenu.style.top = `${e.pageY}px`;
            folderMenu.classList.remove("hidden");
        }
    });

    desktop.appendChild(icon);
}

// Function to open folder window
function openFolderWindow(folderName) {
    // Check if a window for this folder already exists
    let existingWindow = document.querySelector(`.folder-window[data-folder="${folderName}"]`);
    if (existingWindow) {
        existingWindow.style.display = "block";
        return;
    }

    // Create a new window for the folder
    let folderWindow = document.createElement("div");
    folderWindow.className = "folder-window fullscreen fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col";
    folderWindow.setAttribute("data-folder", folderName);

    // Add a simple header with folder name and close button
    let header = document.createElement("div");
    header.className = "flex items-center justify-between p-4 bg-gray-200 border-b";
    let title = document.createElement("span");
    title.textContent = folderName;
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "ml-4 px-2 py-1 bg-red-500 text-white rounded";
    closeBtn.onclick = function() {
        folderWindow.style.display = "none";
    };
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Folder content area (empty for now)
    let content = document.createElement("div");
    content.className = "flex-1 p-8";
    content.textContent = `Contents of "${folderName}"`;

    folderWindow.appendChild(header);
    folderWindow.appendChild(content);

    // Append to body or desktop's parent
    (desktop.parentElement || document.body).appendChild(folderWindow);
}

// ✅Create new folder in localstorage
function createNewFolder() {
    // Close the context menu
    let hidden = document.getElementById("dbl-click-menu");
    if (hidden) {
        hidden.classList.add("hidden");
    }

    // Prevent multiple inline inputs
    if (document.querySelector('.desktop-folder-input')) return;

    // Create the folder icon with an input for the name
    let icon = document.createElement("div");
    icon.className = "icon flex flex-col items-center text-center cursor-pointer";

    let img = document.createElement("img");
    img.src = "https://img.icons8.com/fluency/48/folder-invoices--v1.png";
    img.alt = "folder";
    img.className = "w-11 h-11 object-contain";

    // Create an input for the folder name
    let input = document.createElement("input");
    input.type = "text";
    input.className = "desktop-folder-input mt-2 text-sm text-black rounded px-1 max-w-24 decoration-none";
    input.value = "";
    input.placeholder = "folder name";
    input.autofocus = true;

    icon.appendChild(img);
    icon.appendChild(input);
    desktop.appendChild(icon);

    input.focus();

    // Input name enter hone par chal jayega, Input hatakar span add kar dega
    // localstorage me folder save kar dega
    // dbl-click + right-click event add hua
    function finalizeFolder() {
        let title = input.value.trim() || `New Folder`;
        // Remove input, add span
        let label = document.createElement("span");
        label.className = "mt-2 text-sm";
        label.textContent = title;
        icon.replaceChild(label, input);
        
        // Set folder name attribute
        icon.setAttribute("folder-name", title);
        
    // Localstorage save format 
        const folderData = {
            id: title + Date.now(),
            name: title
        };

        // Save to localStorage
        
        const existing = JSON.parse(localStorage.getItem("folders")) || [];
        existing.push(folderData);
        localStorage.setItem("folders", JSON.stringify(existing));

        icon.addEventListener("dblclick", function(e) {
            e.stopPropagation();
            e.preventDefault();
            isDoubleClicking = true;
            
            // Clear any existing timer
            if (doubleClickTimer) {
                clearTimeout(doubleClickTimer);
            }
            
            // Set a timer to reset the double-click flag
            doubleClickTimer = setTimeout(() => {
                isDoubleClicking = false;
            }, 300);
            
            openFolderWindow(folderData.name);
        });

        // Add contextmenu event for folder menu
        icon.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Select this icon
            document.querySelectorAll(".icon").forEach((el) => {
                el.classList.remove("selected");
            });
            icon.classList.add("selected");

            // Show folder-menu
            let folderMenu = document.getElementById("folder-menu");
            if (folderMenu) {
                folderMenu.style.left = `${e.pageX}px`;
                folderMenu.style.top = `${e.pageY}px`;
                folderMenu.classList.remove("hidden");
            }
        });
    }

    icon.addEventListener("click", function(){
        document.querySelectorAll(".icon").forEach((el) => {
            el.classList.remove("selected");
        });
        icon.classList.add("selected");
    });

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            finalizeFolder();
        }
    });
    input.addEventListener("blur", finalizeFolder);
}

// load saved folder in localstorage
window.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem("folders")) || [];
    saved.forEach(folder => createFolder(folder));
    
    // Add event listeners to existing desktop folders
    setupExistingDesktopFolders();
});

// Function to setup existing desktop folders with context menu
function setupExistingDesktopFolders() {
    const existingFolders = document.querySelectorAll("#desktop-folder");
    
    existingFolders.forEach(folder => {
        const icon = folder.querySelector(".icon");
        
        // Add click event for selection
        icon.addEventListener("click", function(e) {
            document.querySelectorAll(".icon").forEach((el) => {
                el.classList.remove("selected");
            });
            icon.classList.add("selected");
        });
        
        // Add contextmenu event for folder menu
        icon.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll(".icon").forEach((el) => {
                el.classList.remove("selected");
            });
            icon.classList.add("selected");

            let folderMenu = document.getElementById("folder-menu");
            if (folderMenu) {
                folderMenu.style.left = `${e.pageX}px`;
                folderMenu.style.top = `${e.pageY}px`;
                folderMenu.classList.remove("hidden");
            }
        });
        
        // Add double-click event for folder opening
        icon.addEventListener("dblclick", function(e) {
            e.stopPropagation();
            e.preventDefault();
            isDoubleClicking = true;
            
            // Clear any existing timer
            if (doubleClickTimer) {
                clearTimeout(doubleClickTimer);
            }
            
            // Set a timer to reset the double-click flag
            doubleClickTimer = setTimeout(() => {
                isDoubleClicking = false;
            }, 300);
            
            // Get folder name and open window
            const folderName = icon.querySelector("span").textContent;
            openFolderWindow(folderName);
        });
    });
}

//✅ 
open.addEventListener("click", function() {
    // Find the selected folder icon
    let selectedIcon = desktop.querySelector(".icon.selected");
    if (!selectedIcon) {
        alert("Please select a folder to open.");
        return;
    }

    // Get folder name from the selected icon
    let folderName = selectedIcon.querySelector("span").textContent;
    
    // Check if a window for this folder already exists
    let existingWindow = document.querySelector(`.folder-window[data-folder="${folderName}"]`);
    if (existingWindow) {
        existingWindow.style.display = "block";
        existingWindow.classList.add("fullscreen");
        return;
    }

    // Create a new window for the folder,
    // when folder will clicked this window will open
    let folderWindow = document.createElement("div");
    folderWindow.className = "folder-window fullscreen fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col";
    folderWindow.setAttribute("data-folder", folderName);

    let header = document.createElement("div");
    header.className = "flex items-center justify-between p-4 bg-gray-200 border-b";
    let title = document.createElement("span");
    title.textContent = folderName;
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "ml-4 px-2 py-1 bg-red-500 text-white rounded";
    closeBtn.onclick = function() {
        folderWindow.style.display = "none";
    };
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Folder content area (empty for now)
    let content = document.createElement("div");
    content.className = "flex-1 p-8";
    content.textContent = `Contents of "${folderName}"`;

    folderWindow.appendChild(header);
    folderWindow.appendChild(content);

    // Append to body or desktop's parent
    (desktop.parentElement || document.body).appendChild(folderWindow);
});
//✅ 
deletes.addEventListener("click", function() {
    let selectedIcon = document.querySelector(".icon.selected");
    if (!selectedIcon) {
        alert("Please select a folder to delete.");
        return;
    }

    let folderName = selectedIcon.getAttribute("folder-name");
    let folders = JSON.parse(localStorage.getItem("folders") || "[]");
    let folderIndex = folders.findIndex(f => f.name === folderName);

    if (folderIndex !== -1) {
        folders.splice(folderIndex, 1);
        localStorage.setItem("folders", JSON.stringify(folders));
        selectedIcon.remove();
    } else {
        alert("Cannot delete this folder.");
    }

})

//✅ Close menus when clicking outside
document.addEventListener("click", () => {
    // Close dbl-click-menu
    let hidden = document.getElementById("dbl-click-menu");
    if (hidden) {
        hidden.classList.add("hidden");
    }
    
    // Close folder-menu
    let folderMenu = document.getElementById("folder-menu");
    if (folderMenu) {
        folderMenu.classList.add("hidden");
    }
}); 

//✅ Track if a double-click is in progress to prevent contextmenu
let isDoubleClicking = false;
let doubleClickTimer = null;

// Handle double-click on desktop (for dbl-click-menu)
desktop.addEventListener("dblclick", function(e) {
    // Check if the double-clicked element is a folder icon or #desktop-folder or inside one
    let icon = e.target.closest(".icon, #desktop-folder");
    if (icon && desktop.contains(icon)) {
        // This is a folder double-click, handle it separately
        e.stopPropagation();
        e.preventDefault();
        return;
    }
    
    // This is a desktop double-click, show dbl-click-menu
    if (e.target.id === "desktop") {
        console.log("Double-clicked on desktop");
        // Show dbl-click-menu at mouse position
        let hidden = document.getElementById("dbl-click-menu");
        hidden.style.left = `${e.pageX}px`;
        hidden.style.top = `${e.pageY}px`;
        hidden.classList.remove("hidden");
    }
});

// Handle single click to reset double-click state
desktop.addEventListener("click", function(e) {
    // Clear any pending double-click timer
    if (doubleClickTimer) {
        clearTimeout(doubleClickTimer);
        doubleClickTimer = null;
    }
    
    // Set a flag to indicate we're not double-clicking
    isDoubleClicking = false;
});

// Handle contextmenu on desktop (for dbl-click-menu)
desktop.addEventListener("contextmenu", (e) => {
    // If we're in the middle of a double-click, don't show contextmenu
    if (isDoubleClicking) {
        e.preventDefault();
        return;
    }
    
    e.preventDefault();
    
    // Check if right-clicking on a folder icon
    let icon = e.target.closest(".icon, #desktop-folder");
    if (icon && desktop.contains(icon)) {
        // Show folder-menu for folder icons
        let folderMenu = document.getElementById("folder-menu");
        if (folderMenu) {
            folderMenu.style.left = `${e.pageX}px`;
            folderMenu.style.top = `${e.pageY}px`;
            folderMenu.classList.remove("hidden");
        }
    } else {
        // Show dbl-click-menu for desktop
        let hidden = document.getElementById("dbl-click-menu");
        hidden.style.left = `${e.pageX}px`;
        hidden.style.top = `${e.pageY}px`;
        hidden.classList.remove("hidden");
    }
});

//✅ WINDOW DOUBLE CLICK FUNCTIONALITIES
let hidden = document.getElementById("dbl-click-menu");
desktop.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    hidden.style.left = `${e.pageX}px`;
    hidden.style.top  = `${e.pageY}px`;
    hidden.classList.remove("hidden");
});

document.addEventListener("click", () => {
    hidden.classList.add("hidden");
});

let windowimg = document.querySelector("window-img")
windowimg.addEventListener("click", function(){
    let windowimgDiv = document.createElement("div")
    windowimgDiv.className = " z-50 bg-red-300 h-52 w-52 mb-3 p-3 flex flex-col justify-between"

    let upperdiv = windowimgDiv.createElement("div")
    let input = upperdiv.createElement("span")
    input.className = "w-full h-9 bg-grey-500"


    let middlediv = windowimgDiv.createElement("div")
    let bottomdiv = windowimgDiv.createElement("div")


})
