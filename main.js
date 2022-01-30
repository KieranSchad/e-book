

import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };

const browseButton = document.getElementById("browse-button")
const libraryButton = document.getElementById("library-button")
const chaptersButton = document.getElementById("chapters-button")
const optionsButton = document.getElementById("options-button")
const bookPanel = document.getElementById('book-panel')
const browserPanel = document.getElementById('browser-panel')
const libraryPanel = document.getElementById('library-panel')
const chaptersPanel = document.getElementById('chapters-panel')
const optionsPanel = document.getElementById('options-panel')

const searchInput = document.getElementById("search-bar");
const bookCards = document.getElementById("book-cards");

let displayBooks = [];

function searchFunction(e) {
    console.log("anything");
    const inputValue = e.target.value.toLowerCase();
    displayBooks = [];
    for (let i = 0; i < database.length; i++) {
        if (displayBooks.length < 20) {
            if ((database[i].Title.length > 0 && database[i].Title.toLowerCase().includes(inputValue))
            || database[i].Authors.toLowerCase().includes(inputValue)
            || database[i].Subjects.toLowerCase().includes(inputValue)
            || database[i].Bookshelves.toLowerCase().includes(inputValue)) {
                displayBooks.push(database[i]);
            }
        }
    }
    console.log(displayBooks)
    
    const htmlString = displayBooks.map((book) => {
        return `
        <div id="card">
            <h1 class="title">${book.Title}</h1>
            <h2 class="subjects">${book.Subjects}</h2>
            <h3 class="author">${book.Authors}</h3>
        </div>
        `;
    })
    .join('');
    bookCards.innerHTML = htmlString;
}

function toggleBrowse() {
    if (browserPanel.classList.contains("active")) {
        bookPanel.classList.add("active");
        browserPanel.classList.remove("active");
        browseButton.classList.remove("active");
    } else {
        bookPanel.classList.remove("active");
        browserPanel.classList.add("active");
        browseButton.classList.add("active");
        libraryPanel.classList.remove("active");
        libraryButton.classList.remove("active");
        chaptersPanel.classList.remove("active");
        chaptersButton.classList.remove("active");
        optionsPanel.classList.remove("active");
        optionsButton.classList.remove("active");
    }
}

function toggleLibrary() {
    if (libraryPanel.classList.contains("active")) {
        bookPanel.classList.add("active");
        libraryPanel.classList.remove("active");
        libraryButton.classList.remove("active");
    } else {
        bookPanel.classList.remove("active");
        browserPanel.classList.remove("active");
        browseButton.classList.remove("active");
        libraryPanel.classList.add("active");
        libraryButton.classList.add("active");
        chaptersPanel.classList.remove("active");
        chaptersButton.classList.remove("active");
        optionsPanel.classList.remove("active");
        optionsButton.classList.remove("active");
    }
}

function toggleChapters() {
    if (chaptersPanel.classList.contains("active")) {
        bookPanel.classList.add("active");
        chaptersPanel.classList.remove("active");
        chaptersButton.classList.remove("active");
    } else {
        bookPanel.classList.remove("active");
        browserPanel.classList.remove("active");
        browseButton.classList.remove("active");
        libraryPanel.classList.remove("active");
        libraryButton.classList.remove("active");
        chaptersPanel.classList.add("active");
        chaptersButton.classList.add("active");
        optionsPanel.classList.remove("active");
        optionsButton.classList.remove("active");
    }
}

function toggleOptions() {
    if (optionsPanel.classList.contains("active")) {
        bookPanel.classList.add("active");
        optionsPanel.classList.remove("active");
        optionsButton.classList.remove("active");
    } else {
        bookPanel.classList.remove("active");
        browserPanel.classList.remove("active");
        browseButton.classList.remove("active");
        libraryPanel.classList.remove("active");
        libraryButton.classList.remove("active");
        chaptersPanel.classList.remove("active");
        chaptersButton.classList.remove("active");
        optionsPanel.classList.add("active");
        optionsButton.classList.add("active");
    }
}


browseButton.addEventListener('click', toggleBrowse);
libraryButton.addEventListener('click', toggleLibrary);
chaptersButton.addEventListener('click', toggleChapters);
optionsButton.addEventListener('click', toggleOptions);
searchInput.addEventListener('input', searchFunction);
