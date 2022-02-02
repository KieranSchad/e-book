import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };



const tab = document.getElementsByClassName('tab');
const button = document.getElementsByClassName('button');
const panel = document.getElementsByClassName('panel');
const bookList = document.getElementById("book-list");
const libraryList = document.getElementById("library-list");
const chapterList = document.getElementById("chapter-list");
const card = document.getElementsByClassName('card');
const html = document.getElementById('html');
const searchBar = document.getElementById("search-bar");

// ---------  Resize Height  ------------

function resizeHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}


// ---------  Upload  ------------

let displayLibrary = [ {
    "Text#": 12,
    "Type": "Text",
    "Issued": "2008-06-25",
    "Title": "Through the Looking-Glass",
    "Language": "en",
    "Authors": "Carroll, Lewis, 1832-1898",
    "Subjects": "Fantasy fiction; Children's stories; Imaginary places -- Juvenile fiction; Alice (Fictitious character from Carroll) -- Juvenile fiction",
    "LoCC": "PR; PZ",
    "Bookshelves": "Best Books Ever Listings; Children's Literature"
  } ];
let htmlLibrary = [];

fetch('./library/12-h.htm', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> htmlLibrary.push(data))
    .catch(error => console.error(error));

function handleFileSelect(event) {
    const bookId = parseInt(event.target.files[0].name.replace("-h.htm", ""), 10)
    const bookIndex = database.map((book) => parseInt(Object.values(book)[0], 10)).indexOf(bookId);
    displayLibrary.push(database[bookIndex]);
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
  }
  
  function handleFileLoad(event) {
    htmlLibrary.push(event.target.result);
    console.log(displayLibrary);
    console.log(htmlLibrary);
    showLibrary();;
  }
function showLibrary() {
    toHtml(displayLibrary, libraryList);
}

// ---------  Find book for Chapters  ------------

function findChapters(e) {
    const bookId = parseInt(e.target.parentElement.parentElement.id, 10);
    const bookIndex = displayLibrary.map((book) => parseInt(Object.values(book)[0], 10)).indexOf(bookId);
    loadChapters(bookIndex);
}

// ---------  Load Chapters  ------------

function loadChapters(bookIndex) {
    const bookHtml = htmlLibrary[bookIndex];
    let chapters;
    if (/href="#/.test(bookHtml)) {
        chapters = bookHtml
            .match(/href="#.[^n](.|[\s\S])+?(?=\s*<)/g)
            .map((item => item.split(/>\s*/)))
            .filter((pair) => pair[1].length > 0);
    } else {
        chapters = bookHtml
            .match(/<h2>.+(?=<\/h2>)/g)
            .map((item => item.split(/>/)));
            console.log(chapters)
    }
    
    toHtml([displayLibrary[bookIndex]], chapterList, chapters)
    console.log(chapters);
    tabClick("chapters-tab");
}



// ---------  Search  ------------

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
    let searchResult = [];
    for (let i = 0; i < database.length && searchResult.length < 100; i++) {
        const bookData = Object.values(database[i]).join(" ").toLowerCase();
        if (inputValue.every(el => bookData.includes(el))) {
            searchResult.push({...database[i]});
            
        } 
    }
    timeoutId = 0;
    toHtml(searchResult, bookList);

}

function authorSearch(inputValue) {
    let authorSearchResult = [];
    searchBar.value = "";
    searchBar.placeholder = "Author: " + inputValue;
    bookList.scrollTo(0, 0);
    for (let j = 0; j < database.length && authorSearchResult.length < 100; j++) {
        if (database[j].Authors.toLowerCase().includes(inputValue.toLowerCase())) {
            authorSearchResult.push({...database[j]});
        } 
    }
    toHtml(authorSearchResult, bookList);
}

function tagSearch(inputValue) {
    let tagSearchResult = [];
    searchBar.value = "";
    searchBar.placeholder = "Tag: " + inputValue;
    bookList.scrollTo(0, 0);
    for (let j = 0; j < database.length && tagSearchResult.length < 100; j++) {
        if (database[j].Subjects.toLowerCase().includes(inputValue.toLowerCase()) 
            || database[j].Bookshelves.toLowerCase().includes(inputValue.toLowerCase())) {
            tagSearchResult.push({...database[j]});
        } 
    }
    toHtml(tagSearchResult, bookList);
}

// ---------  Display Search Results  ------------

function toHtml(bookArray, location, chapterArr) {
    const htmlString = bookArray.map((book) => {

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
        
        let tags = [...new Set(book.Subjects
            .concat(';', book.Bookshelves)                       //join subjects and bookshelves to one string
            .split(/;\s*|\s*--\s*|\.\s+|\,\s+/ig))]              //split into array based on regex
            .filter(item => item)                                //filter out empty strings
            .map((tag) => {                                      //asign html to each array item
                return `<button type="button" class="tag" id="${tag}">${tag}</button>`;          
            })
            .join('');                                           //convert array to string

        let chapters = ``;
        const chapterRegex = /(?<!\s(mr)|(ms)|(mrs)|(dr)|(sr)|(jr))\.\s+/i
        const bookNumber = Object.values(book)[0];
        let buttonHtml;
        if (location == bookList) {
            buttonHtml = `
                <div class="download-buttons">
                    <a class="button fas fa-download" id="download-htm" href="https://www.gutenberg.org/files/${bookNumber}/${bookNumber}-h/${bookNumber}-h.htm"></a>
                    <a class="button fas fa-download" id="download-html" href="https://www.gutenberg.org/cache/epub/${bookNumber}/pg${bookNumber}.html"></a>
                    <a class="button fas fa-download" id="download-txt" href="https://www.gutenberg.org/files/${bookNumber}/${bookNumber}.txt"></a>
                </div>`
        } else if (location == libraryList) {
            buttonHtml = `
                <div class="library-buttons">
                    <a type="button" class="button fas fa-book-open" id="readButton" ></a>
                    <a type="button" class="button fas fa-trash-alt" id="deleteButton" ></a>
                </div>`
        } else if (location == chapterList) {
            tags = ``;
            chapters = chapterArr.map((chapter) => {
                return `
                    <button type="button" class="chapterButton" id="${chapter[0]}">${chapter[1].replace(chapterRegex, "<br>")}</button>`
            }).join("");
            buttonHtml = `
                <div class="chapters-buttons">
                    <a type="button" class="button fas fa-redo-alt" id="restartButton" ></a>
                    <a type="button" class="button fas fa-bookmark" id="bookmarkButton" ></a>
                </div>`
        }
        
        return `
        <div class="card" id="${bookNumber}">
            <h1 class="title">${shortTitle}</h1>
            <h3 class="sub-title">${subTitle}</h3>
            <h3 class="issued" id="${issued}">${issued}</h3>
            ${author}
            <div class="subjects">${tags}</div>
            ${buttonHtml}
            <div class="subjects">${chapters}</div>
        </div>
        `;
    })
    .join('');

    location.innerHTML = htmlString;
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
    toHtml([], bookList);
}

function deleteBook() {
    console.log("delete book");
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
    tag: { click: tagSearch },
    author: { click: authorSearch },
    clear: { click: clearSearch },
    card: { click: focusCard },
    readButton: { click: findChapters },
    deleteButton: { click: deleteBook },
    tab: { click: tabClick }
}

function eventHandler(ev) {
// Check if class is in event map
    if (ev.target.className in eventMap && ev.type in eventMap[ev.target.className]) {
        eventMap[ev.target.className][ev.type](ev.target.id);
// Check if id is in event map
    } else if (ev.target.id in eventMap && ev.type in eventMap[ev.target.id]) {
        eventMap[ev.target.id][ev.type](ev);
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
window.addEventListener('load', resizeHeight);
window.addEventListener('load', showLibrary);
window.addEventListener('resize', resizeHeight);
