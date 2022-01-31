import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };

const browseButton = document.getElementById("browse-button");
const libraryButton = document.getElementById("library-button");
const chaptersButton = document.getElementById("chapters-button");
const optionsButton = document.getElementById("options-button");
const bookPanel = document.getElementById('book-panel');
const browserPanel = document.getElementById('browser-panel');
const libraryPanel = document.getElementById('library-panel');
const chaptersPanel = document.getElementById('chapters-panel');
const optionsPanel = document.getElementById('options-panel');
const iframe = document.getElementById('iframe');
const fullScreenButton = document.getElementById('full-screen-button');
const html = document.getElementById('html');
const searchInput = document.getElementById("search-bar");
const bookCards = document.getElementById("book-cards");

let displayBooks = [];

function searchFunction(e) {
    const inputValue = e.target.value
        .toLowerCase().split(" ")
        .filter(item => item) ;

    displayBooks = [];
    for (let i = 0; i < database.length && displayBooks.length < 20; i++) {
        const bookData = Object.values(database[i]).join(" ").toLocaleLowerCase();
        if (inputValue.every(el => bookData.includes(el))) {
            displayBooks.push({...database[i]});
        }
    }


    const htmlString = displayBooks.map((book) => {
        book.Tags = [...new Set(book.Subjects
            .concat(';', book.Bookshelves)                       //join subjects and bookshelves to one string
            .split(/;\s*|\s*--\s*|\.\s+|\,\s+/ig))]              //split into array based on regex
            .filter(item => item)                                //filter out empty strings
            .map((tag) => {                                      //asign html to each array item
                return `<a class="tag">${tag}</a>`;          
            })
            .join('');                                           //convert array to string
        return `
        <div class="card" id="${Object.values(book)[0]}">
            <h1 class="title">${book.Title}</h1>
            <h3 class="issued">${book.Issued}</h3>
            <h2 class="author">${book.Authors}</h2>
            <div class="subjects">${book.Tags}</div>
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

let fullScreen = false;

function toggleFullScreen() {
    if (fullScreen == true) {
        fullScreen = false;
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
          }
    } else {
        fullScreen = true;
        if (html.requestFullscreen) {
            html.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            html.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            html.msRequestFullscreen();
        }
    }
}

function onClick(event) {
    const clickParentId = event.target.parentNode.id;
    const clickId = event.target.id;
    const clickHtml = event.target.innerHTML;
    
    if (clickParentId > 0) {
        iframe.src = `https://www.gutenberg.org/files/${clickParentId}/${clickParentId}-h/${clickParentId}-h.htm`
        toggleBrowse();
    }


    // console.log(clickId);
    // console.log(clickHtml);
}


browseButton.addEventListener('click', toggleBrowse);
libraryButton.addEventListener('click', toggleLibrary);
chaptersButton.addEventListener('click', toggleChapters);
optionsButton.addEventListener('click', toggleOptions);
searchInput.addEventListener('input', searchFunction);
fullScreenButton.addEventListener('click', toggleFullScreen);
window.addEventListener('click', onClick);