import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };

const tab = document.getElementsByClassName('tab');
const button = document.getElementsByClassName('button');
const panel = document.getElementsByClassName('panel');
const bookList = document.getElementById("book-list");
const card = document.getElementsByClassName('card');
const html = document.getElementById('html');
const searchBar = document.getElementById("search-bar");

// ---------  Resize Height  ------------

function resizeHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}


// ---------  Upload  ------------

let displayLibrary = [];
let htmlLibrary = [];

function handleFileSelect(event) {
    
    displayLibrary.push(database[parseInt(event.target.files[0].name.replace("-h.htm", ""), 10) - 1])
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
    console.log(displayLibrary);
  }
  
  function handleFileLoad(event) {
    htmlLibrary.push(event.target.result);
    console.log(htmlLibrary);
  }

// ---------  Show Book  ------------

function loadBook() {
    
}



// ---------  Search  ------------

let displayBooks = [];
let timeoutId = 0;

function searchWithDelay(e) {
    if (timeoutId == 0) {
        timeoutId = setTimeout(searchFunction, 20, e);
    } else {
        clearTimeout(timeoutId);
        timeoutId = 0;
    }
}

function searchFunction(e) {
    const inputValue = e.target.value
        .toLowerCase().split(" ")
        .filter(item => item) ;
    displayBooks = [];
    for (let i = 0; i < database.length && displayBooks.length < 100; i++) {
        const bookData = Object.values(database[i]).join(" ").toLowerCase();
        if (inputValue.every(el => bookData.includes(el))) {
            displayBooks.push({...database[i]});
            
        } 
    }
    timeoutId = 0;
    toHtml();

}

function authorSearch(inputValue) {
    displayBooks = [];
    searchBar.value = "";
    searchBar.placeholder = "Author: " + inputValue;
    bookList.scrollTo(0, 0);
    for (let j = 0; j < database.length && displayBooks.length < 100; j++) {
        if (database[j].Authors.toLowerCase().includes(inputValue.toLowerCase())) {
            displayBooks.push({...database[j]});
        } 
    }
    toHtml();
}

function tagSearch(inputValue) {
    displayBooks = [];
    searchBar.value = "";
    searchBar.placeholder = "Tag: " + inputValue;
    bookList.scrollTo(0, 0);
    for (let j = 0; j < database.length && displayBooks.length < 100; j++) {
        if (database[j].Subjects.toLowerCase().includes(inputValue.toLowerCase()) || database[j].Bookshelves.toLowerCase().includes(inputValue.toLowerCase())) {
            displayBooks.push({...database[j]});
        } 
    }
    toHtml();
}

// ---------  Display Search Results  ------------

function toHtml() {
    const htmlString = displayBooks.map((book) => {

        const shortTitle = book.Title.split("\n")[0];
        let subTitle = "";
        if (book.Title.split("\n").length > 1) {
            subTitle = book.Title.split("\n")[1];
        }

        if (book.Title.split("\n").length > 1) {
            book.subTitle = book.Title.split("\n")[1];
        }

        const date = book.Issued.split("-").map((item) => item.replace(/^0+/, ''));
        const issued = [date[1], date[2], date[0]].join("-");

        const author = book.Authors
            .split(/;\s*/g).map((item) => item.split(/,s*/g))
            .filter(item => item)
            .map((aut) => {
                if (aut.length == 2) {
                    return `<h2 class="author" id="${aut.join(",")}">${aut[0]}</h2>`;
                } else {
                    return `<h2 class="author" id="${aut.join(",")}">${aut.splice(0, 2).reverse().join(" ")}</h2>`;          
                }
            })
            .join(''); 
        
        const tags = [...new Set(book.Subjects
            .concat(';', book.Bookshelves)                       //join subjects and bookshelves to one string
            .split(/;\s*|\s*--\s*|\.\s+|\,\s+/ig))]              //split into array based on regex
            .filter(item => item)                                //filter out empty strings
            .map((tag) => {                                      //asign html to each array item
                return `<button type="button" class="tag" id="${tag}">${tag}</button>`;          
            })
            .join('');                                           //convert array to string

        const bookNumber = Object.values(book)[0]
        
        return `
        <div class="card" id="${bookNumber}">
            <h1 class="title">${shortTitle}</h1>
            <h3 class="sub-title">${subTitle}</h3>
            <h3 class="issued" id="${issued}">${issued}</h3>
            ${author}
            <div class="subjects">${tags}</div>
            <div class="download-buttons">
            <button type="button" class="button" id="download-htm" >
            <a href="https://www.gutenberg.org/files/${bookNumber}/${bookNumber}-h/${bookNumber}-h.htm">
                <i class="fas fa-download"></i>
            </a>
        </button>
        <button type="button" class="button" id="download-html" >
            <a href="https://www.gutenberg.org/cache/epub/${bookNumber}/pg${bookNumber}.html">
                <i class="fas fa-download"></i>
            </a>
        </button>
        <button type="button" class="button" id="download-txt" >
            <a href="https://www.gutenberg.org/files/${bookNumber}/${bookNumber}.txt">
                <i class="fas fa-download"></i>
            </a>
        </button>
            </div>
        </div>
        `;
    })
    .join('');

    bookList.innerHTML = htmlString;
}

// ---------  Full Screen  ------------

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

// ---------  Focus Card  ------------

function focusCard(bookId) {
    Array.from(card).forEach((item) => {item.classList.remove("active")});
    document.getElementById(bookId).classList.add("active");

}

// ---------  Clear Search  ------------

function clearSearch() {
    searchBar.value = "";
    searchBar.placeholder = "Search";
    searchBar.focus();
    displayBooks = [];
    toHtml();
}

// ---------  Panel Navigation  ------------

function tabClick(id) {
    Array.from(tab).forEach((item) => {item.classList.remove("active")});
    Array.from(panel).forEach((item) => {item.classList.remove("active")});
    document.getElementById(id).classList.add("active");
    document.getElementById(id.replace("tab", "panel")).classList.add("active");
}

// ---------  User Inputs  ------------

const eventMap = {
    tag: { click: tagSearch},
    author: { click: authorSearch},
    clear: { click: clearSearch},
    card: { click: focusCard},
    tab: { click: tabClick }
}

function eventHandler(ev) {
// Check if class is in event map
    if (ev.target.className in eventMap && ev.type in eventMap[ev.target.className]) {
        eventMap[ev.target.className][ev.type](ev.target.id);
// Check if id is in event map
    } else if (ev.target.id in eventMap && ev.type in eventMap[ev.target.id]) {
        eventMap[ev.target.id][ev.type]();
// Check if parent's class is in event map
    } else if (ev.target.parentElement.className in eventMap && ev.type in eventMap[ev.target.parentElement.className]) {
        eventMap[ev.target.parentElement.className][ev.type](ev.target.parentElement.id);
// Check if keyboard key is in event map
    } else if (ev.key in eventMap && ev.type in eventMap[ev.key]) {
        eventMap[ev.key][ev.type]();
    }
}

['click', 'keydown', 'keyup'].forEach((eventType) => {
    document.body.addEventListener(eventType, eventHandler);
})

searchBar.addEventListener('input', searchWithDelay);
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
window.addEventListener('load', resizeHeight)
window.addEventListener('resize', resizeHeight)
