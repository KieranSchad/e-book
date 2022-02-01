import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };

const tab = document.getElementsByClassName('tab');
const button = document.getElementsByClassName('button');
const panel = document.getElementsByClassName('panel');
const bookList = document.getElementById("book-list");

const html = document.getElementById('html');
const searchBar = document.getElementById("search-bar");

let displayBooks = [];

function searchFunction(e) {
    const inputValue = e.target.value
        .toLowerCase().split(" ")
        .filter(item => item) ;

    displayBooks = [];
    for (let i = 0; i < database.length && displayBooks.length < 20; i++) {
        const bookData = Object.values(database[i]).join(" ").toLowerCase();
        if (inputValue.every(el => bookData.includes(el))) {
            displayBooks.push({...database[i]});
        } 
    }

    toHtml();

}

function authorsSearch(inputValue) {
    displayBooks = [];
    searchBar.value = inputValue;
    bookList.scrollTo(0, 0);
    for (let j = 0; j < database.length && displayBooks.length < 20; j++) {
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
    for (let j = 0; j < database.length && displayBooks.length < 20; j++) {
        if (database[j].Subjects.toLowerCase().includes(inputValue.toLowerCase()) || database[j].Bookshelves.toLowerCase().includes(inputValue.toLowerCase())) {
            displayBooks.push({...database[j]});
        } 
    }
    toHtml();
}

function toHtml() {
    const htmlString = displayBooks.map((book) => {
        book.Tags = [...new Set(book.Subjects
            .concat(';', book.Bookshelves)                       //join subjects and bookshelves to one string
            .split(/;\s*|\s*--\s*|\.\s+|\,\s+/ig))]              //split into array based on regex
            .filter(item => item)                                //filter out empty strings
            .map((tag) => {                                      //asign html to each array item
                return `<button class="tag" id="${tag}">${tag}</button>`;          
            })
            .join('');                                           //convert array to string
        return `
        <div class="card" id="${Object.values(book)[0]}">
            <h1 class="title">${book.Title}</h1>
            <h3 class="issued">${book.Issued}</h3>
            <h2 class="author" id="aut${book.Authors}" >${book.Authors}</h2>
            <div class="subjects">${book.Tags}</div>
        </div>
        `;
    })
    .join('');

    bookList.innerHTML = htmlString;
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

function tabClick(id) {
    Array.from(tab).forEach((item) => {item.classList.remove("active")});
    Array.from(panel).forEach((item) => {item.classList.remove("active")});
    document.getElementById(id).classList.add("active");
    document.getElementById(id.replace("tab", "panel")).classList.add("active");
}

const eventMap = {
    tag: { mousedown: tagSearch},
    tab: { mousedown: tabClick }
}

function eventHandler(ev) {
    if (ev.target.className in eventMap && ev.type in eventMap[ev.target.className]) {
        eventMap[ev.target.className][ev.type](ev.target.id);
    } else if (ev.key in eventMap && ev.type in eventMap[ev.key]) {
        eventMap[ev.key][ev.type]();
    }
}

['mousedown', 'mouseup', 'keydown', 'keyup'].forEach((eventType) => {
    window.addEventListener(eventType, eventHandler);
})

searchBar.addEventListener('input', searchFunction);
