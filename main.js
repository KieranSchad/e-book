

// ---------  Get frequently used elements  ------------
let database;
const tab = document.getElementsByClassName('tab');
const pageTab = document.getElementById('page-tab');
const panel = document.getElementsByClassName('panel');
const settingsPanel = document.getElementById('settings-panel');
const settingsButton = document.getElementById('settings-button');
const bookList = document.getElementById("book-list");
const libraryList = document.getElementById("library-list");
const chapterList = document.getElementById("chapter-list");
let card = document.getElementsByClassName('card');
const page = document.getElementById('page');
const fullscreenWrapper = document.getElementById('fullscreen-wrapper');
const html = document.getElementById('html');
const searchBar = document.getElementById("search-bar");
const fontSlider = document.getElementById("font-slider");
const colorSlider = document.getElementById("color-slider");
const brightnessSlider = document.getElementById("brightness-slider");


// ---------  Get Gutenberg Project catalog  ------------

// import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };

fetch("https://kieranschad.github.io/e-book/pg_caralog_2022_01_28.json")
    .then(res => (res.json())
    .then(data => {
        database = data
        onLoad();
    }))


// ---------  Resize Height  ------------

function resizeHeight() {
    let vh = window.innerHeight * 0.01 - 0.001;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    paginate();
}

resizeHeight();

// ---------  library  ------------

// let displayLibrary = [];
// let htmlLibrary = [];

// ---------  Get local library  ------------

// function getLocalLibrary() {
//     if (localStorage.getItem("displayLibrary") && localStorage.getItem("htmlLibrary")) {
//         displayLibrary = JSON.parse(localStorage.getItem("displayLibrary"));
//         htmlLibrary = JSON.parse(localStorage.getItem("htmlLibrary"));

//     } else {
//         fetch('./library/12-h.htm', {mode: 'no-cors'})
//             .then(response => response.text())
//             .then(data=> htmlLibrary[0] = data)
//             .catch(error => console.error(error));
            
//         fetch('./library/61.txt', {mode: 'no-cors'})
//             .then(response => response.text())
//             .then(data=> htmlLibrary[1] = data)
//             .catch(error => console.error(error));

//         fetch('./library/76-h.htm', {mode: 'no-cors'})
//             .then(response => response.text())
//             .then(data=> htmlLibrary[2] = data)
//             .catch(error => console.error(error));

//         displayLibrary = [ {
//             "Text#": 12,
//             "Type": "Text",
//             "Issued": "2008-06-25",
//             "Title": "Through the Looking-Glass",
//             "Language": "en",
//             "Authors": "Carroll, Lewis, 1832-1898",
//             "Subjects": "Fantasy fiction; Children's stories; Imaginary places -- Juvenile fiction; Alice (Fictitious character from Carroll) -- Juvenile fiction",
//             "LoCC": "PR; PZ",
//             "Bookshelves": "Best Books Ever Listings; Children's Literature"
//             },
//             {
//             "Text#": 61,
//             "Type": "Text",
//             "Issued": "2005-01-25",
//             "Title": "The Communist Manifesto",
//             "Language": "en",
//             "Authors": "Engels, Friedrich, 1820-1895; Marx, Karl, 1818-1883",
//             "Subjects": "Socialism; Communism",
//             "LoCC": "HX",
//             "Bookshelves": "Politics; Philosophy; Banned Books from Anne Haight's list"
//             },
//             {
//             "Text#": 76,
//             "Type": "Text",
//             "Issued": "2004-06-29",
//             "Title": "Adventures of Huckleberry Finn",
//             "Language": "en",
//             "Authors": "Twain, Mark, 1835-1910; Kemble, E. W. (Edward Windsor), 1861-1933 [Illustrator]",
//             "Subjects": "Humorous stories; Bildungsromans; Boys -- Fiction; Male friendship -- Fiction; Adventure stories; Missouri -- Fiction; Race relations -- Fiction; Runaway children -- Fiction; Finn, Huckleberry (Fictitious character) -- Fiction; Fugitive slaves -- Fiction; Mississippi River -- Fiction",
//             "LoCC": "PS",
//             "Bookshelves": "Best Books Ever Listings; Banned Books from Anne Haight's list; Banned Books List from the American Library Association"
//             } ];
//     }
// }

// ---------  Upload  ------------

// function handleFileSelect(event) {
//     const bookId = parseInt(event.target.files[0].name.match(/\d+(?=((-\w)*\.(htm|txt)))/i), 10)   //match number in filename, lookahead to extension
//     if (database.some((book) => Object.values(book)[0] == bookId)) {
//         const bookIndex = database.map((book) => parseInt(Object.values(book)[0], 10)).indexOf(bookId);
//         displayLibrary.push(database[bookIndex]);
//         const reader = new FileReader();
//         reader.onload = handleFileLoad;
//         reader.readAsText(event.target.files[0])
//         card = document.getElementsByClassName('card');
//     } else {
//         alert("File does not match any books in the database")
//     }

//   }
  
//   function handleFileLoad(event) {
//     htmlLibrary.push(event.target.result);
//     localStorage.setItem("displayLibrary", JSON.stringify(displayLibrary))
//     localStorage.setItem("htmlLibrary", JSON.stringify(htmlLibrary));
//     showLibrary();;
//   }


// ---------  Get Index from Number  ------------

function getIndexFromNumber(number) {
    return database.map((book) => parseInt(Object.values(book)[0], 10)).indexOf(parseInt(number, 10));
}

// ---------  Get Number from Index  ------------

function getNumberFromIndex(index) {
    return Object.values(database[index])[0];
}

// ---------  Get Library  ------------

let libraryArray = [{number: 12, bookMark: 0}, {number: 61, bookMark: 0}, {number: 76, bookMark: 0}];

if (localStorage.getItem("libraryArray")) {
    libraryArray = JSON.parse(localStorage.getItem("libraryArray"));
}

function showLibrary() {
    let libraryObjectArray = libraryArray.map(obj => database[getIndexFromNumber(obj.number)])
    toHtml(libraryObjectArray, libraryList);
}


// ---------  Get Book  ------------

let currentBook = -1;
let libraryIndex;
let bookData;
if (localStorage.getItem("currentBook")) {
    currentBook = localStorage.getItem("currentBook");
    libraryIndex = getLibraryIndex(currentBook);
}




function getBook(e, bookNumber, goToPanel) {
    if (e) {
        bookNumber = parseInt(e.target.parentElement.parentElement.id.slice(7), 10);
    }
    let bookIndex = getIndexFromNumber(bookNumber);
    currentBook = bookNumber;
    localStorage.setItem("currentBook", currentBook);
    libraryIndex = getLibraryIndex(currentBook);
    if (libraryIndex >= 0) {
        bookMark = libraryArray[libraryIndex].bookMark;
    }


    fetch(`https://kieranschad.github.io/e-book/library/${bookNumber}-h.htm`)
        .then(res => {
            if (res.ok) {
                res.text()
                    .then((data) => {
                        bookData = data;
                        loadBook(bookIndex, goToPanel);
                        // loadPage(false, currentBook, "stay");
                    })
            } else {
                fetch(`https://kieranschad.github.io/e-book/library/${bookNumber}.html`)
                    .then(res => {
                        if (res.ok) {
                            res.text()
                                .then((data) => {
                                    bookData = data;
                                    loadBook(bookIndex, goToPanel);
                                    // loadPage(false, currentBook, "stay");
                                })
                        } else {
                            fetch(`https://kieranschad.github.io/e-book/library/${bookNumber}.txt`)
                                .then(res => {
                                    if (res.ok) {
                                        res.text()
                                            .then((data) => {
                                                bookData = data;
                                                loadBook(bookIndex, goToPanel);
                                                // loadPage(false, currentBook, "stay");
                                            })
                                    } else {
                                        alert("Book Not Found");
                                        currentBook = -1;
                                        localStorage.setItem("currentBook", currentBook);
                                    }
                                })
                        }
                    })
            }
        })
        // .then(res => (res.text())
        // .then((data) => {
        //     bookData = data;
        //     loadBook(bookIndex, goToPanel);
        //     // loadPage(false, currentBook, "stay");
        // }))
}

// ---------  Load Book  ------------

function loadBook(bookIndex, goToPanel) {
    let chapters;
    if (/href="#/.test(bookData)) {
        chapters = bookData
            .match(/href="#.[^n](.|[\s\S])+?(?=\s*<)/g)             // match any links
            .map((item, index) => [...item.split(/>\s*/), index])
            .filter((pair) => pair[1].length > 0);
    } else if (/(Chapter|CHAPTER)\s+(1|I)/.test(bookData)) {
        chapters = bookData
            .replace(/[\s\S]*?START\sOF\sTH..?\sPROJECT\sGUTENBERG.+?\*/, "")         // remove everything before first hr tag
            .replace(/END\sOF\sTH..?\sPROJECT\sGUTENBERG[\s\S]*/, "")              //remove everything after second hr tag
            .match(/(Chapter|CHAPTER)\s+((\d)+|(|I|V|X|C|L)+)/g)                   // match chapter + number or roman numeral
            .map((item, index) => ["chapter", item, index]);           
    } else if (/<h2>/.test(bookData)) {
        chapters = bookData
            .replace(/[\s\S]*?START\sOF\sTH..?\sPROJECT\sGUTENBERG.+?\*/, "")         // remove everything before first hr tag
            .replace(/END\sOF\sTH..?\sPROJECT\sGUTENBERG[\s\S]*/, "")              //remove everything after second hr tag
            .match(/(?<=<h2>)[\s\S]*?(?=<\/h2>)/g)                              // match anything in an h2 tag
            .map((item, index) => ["h2", item, index]);
    } else {
        chapters = bookData
            .replace(/[\s\S]*?START\sOF\sTH..?\sPROJECT\sGUTENBERG.+?\*/, "")      // remove everything before first hr tag
            .replace(/END\sOF\sTH..?\sPROJECT\sGUTENBERG[\s\S]*/, "")              // remove everything after second hr tag
            .split(/\n/g)                                                          // split book into lines
            .filter((line) => {                                                    // only keep lines that pass the test
                return (!(line.match(/[a-z]+/g)) && line.match(/[A-Z]/g))           
                })
            .map((item, index) => ["capital", item, index]);
    }
    chapters.unshift(["restart-button", "OPENING. Start at the Beginning"])
    toHtml([database[bookIndex]], chapterList, chapters)
    if (goToPanel !== "stay") {
        tabClick("book-tab");
    }
}

// ---------  Restart Book  ------------

function restartBook(e) {
    bookMark = 0;
    if (libraryIndex >= 0) {
        libraryArray[libraryIndex].bookMark = bookMark;
        localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
    }
    loadPage(e);
}

// ---------  Load Text  ------------

let bookArray;

function loadPage(e, bookNumber, gotoPanel) {

    if (e) {
        bookNumber = parseInt(e.target.parentElement.parentElement.id.slice(7), 10);
    }
    bookArray = [];
    
    if (/<!DOCTYPE\s+?html/i.test(bookData)) {
        let tag = "split";
        bookData
            .replace(/<style[\s\S]*?<\/style>/gi, "")                   // delete inline styling
            .replace(/style=('|")[\s\S]*?>/gi, ">")                     // delete style attributes
            .replace(/^[\s\S]*?<body>/i, "")                            // delete everything before body tag
            .replace(/<\/body>[\s\S]*?$/i, "")                          // delete everything after /body tag
            .replace(/src="images/gi, `src="https://www.gutenberg.org/files/${bookNumber}/${bookNumber}-h/images`)
            .replace(/<br[\s\S]*?>/gi, "<hr>")
            .split(/(?=<)|(?<=>)/g)
            .forEach((item) => {
                if (tag === "split" && !/^</.test(item)) {
                    bookArray.push(...item.split(/\s|\r|\n/g).filter(item => item))
                } else if (tag === "split") {
                    bookArray.push(item)
                } else {
                    bookArray[bookArray.length - 1] = bookArray[bookArray.length - 1] + item;
                }
                if (tag == "split" && /<a/i.test(item)) {
                    tag = "a";
                } else if (tag == "split" && /<img/i.test(item)) {
                    tag = "img";
                } else if (tag == "split" && /<i/i.test(item)) {
                    tag = "i";
                } else if (tag == "split" && /<h\d/i.test(item)) {
                    tag = "h";
                } else if (tag == "split" && /<table/i.test(item)) {
                    tag = "table";
                } else if (tag == "a" && /<\/a/i.test(item)) {
                    tag = "split";
                } else if (tag == "img") {
                    tag = "split";
                } else if (tag == "i" && /<\/i/i.test(item)) {
                    tag = "split";
                } else if (tag == "h" && /<\/h\d/i.test(item)) {
                    tag = "split";
                } else if (tag == "table" && /<\/table/i.test(item)) {
                    tag = "split";
                }
            })
    } else {
        bookArray = bookData
            .replace(/\n\s\n/g, " <br><br> ")
            .split(/\s|\r|\n/g)
            .filter(item => item);
    }
    if (gotoPanel !== "stay") {
        tabClick("page-tab");
        paginate();
    }
    currentBook = bookNumber;
    localStorage.setItem("currentBook", currentBook);
    libraryIndex = getLibraryIndex(currentBook);
    if (libraryIndex >= 0) {
        bookMark = libraryArray[libraryIndex].bookMark;
    }
}

// ---------  Paginate  ------------

let bookMark = 0;

if (libraryIndex >= 0) {
    bookMark = libraryArray[libraryIndex].bookMark;
}
function getLibraryIndex(number) {
    return libraryArray.map((obj) => parseInt(obj.number, 10)).indexOf(parseInt(number, 10));
}


let firstWord = -1;
let lastWord = -1;
let wordIndex = -1;
let pageArray = [];

function nextPage() {
    if (pageTab.classList.contains("active")) {
        if (wordIndex < bookArray.length) {
            
            pageArray = [];
            page.innerHTML = pageArray;
            firstWord = lastWord + 1;
            wordIndex = firstWord;
            let skipGaps = true;
            while (page.scrollHeight <= page.offsetHeight && wordIndex < bookArray.length) {
                if (skipGaps && /^(<br|<div|<hr|&nbsp)/i.test(bookArray[wordIndex])) {
                    wordIndex++;
                    
                } else if (!skipGaps && /<h1|<img|class="chapter"/i.test(bookArray[wordIndex])) {
                    break;
                } else {
                    pageArray.push(bookArray[wordIndex]);
                    page.innerHTML = pageArray.join(" ");
                    wordIndex++;
                    skipGaps = false;
                }
                
            }
            
            if (page.scrollHeight > page.offsetHeight && pageArray.length > 1) {
                pageArray.pop();
                wordIndex--;
            }
            page.innerHTML = pageArray.join(" ");
            lastWord = wordIndex - 1;
            bookMark = firstWord;

            if (libraryIndex >= 0) {
                libraryArray[libraryIndex].bookMark = bookMark;
                localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
            }

            getProgress();
        }
    }
}

function paginate() {
    if (pageTab.classList.contains("active")) {
        if (wordIndex < bookArray.length) {
            pageArray = [];
            page.innerHTML = pageArray;
            if (libraryIndex >= 0) {
                firstWord = bookMark;
            } else {
                firstWord = 0;
            }
            let skipGaps = true;
            wordIndex = firstWord;
            while (page.scrollHeight <= page.offsetHeight && wordIndex < bookArray.length) {
                
                if (skipGaps && /^(<br|<div|<hr|&nbsp)/i.test(bookArray[wordIndex])) {
                    wordIndex++;
                    
                } else if (!skipGaps && /<h1|<img|class="chapter"/i.test(bookArray[wordIndex])) {
                    
                    break;
                    
                } else {
                    pageArray.push(bookArray[wordIndex]);
                    page.innerHTML = pageArray.join(" ");
                    wordIndex++;
                    skipGaps = false;
                }
            }
            if (page.scrollHeight > page.offsetHeight && pageArray.length > 1) {
                pageArray.pop();
                wordIndex--;
            }
            

            page.innerHTML = pageArray.join(" ");
            lastWord = wordIndex - 1;
            bookMark = firstWord;
            if (libraryIndex >= 0) {
                libraryArray[libraryIndex].bookMark = bookMark;
                localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
            }

            getProgress();
        }
    }
}

function previousPage() {
    if (pageTab.classList.contains("active")) {
        if (wordIndex >= 0) {
            pageArray = [];
            page.innerHTML = pageArray;
            lastWord = firstWord - 1;
            wordIndex = lastWord;
            let skipGaps = true;
            while (page.scrollHeight <= page.offsetHeight && wordIndex >= 0) {
                
                if (skipGaps && /^(<br|<div|<hr|&nbsp)/i.test(bookArray[wordIndex])) {
                    wordIndex--;
                } else if (/<h1|<img|class="chapter"/i.test(bookArray[wordIndex])) {
                    pageArray.unshift(bookArray[wordIndex]);
                    page.innerHTML = pageArray.join(" ");
                    break;
                } else {
                    pageArray.unshift(bookArray[wordIndex]);
                    page.innerHTML = pageArray.join(" ");
                    wordIndex--;
                    skipGaps = false;
                }
            }
            if (page.scrollHeight > page.offsetHeight && pageArray.length > 1) {
                pageArray.shift();
                wordIndex += 2;
            }
            

            page.innerHTML = pageArray.join(" ");
            firstWord = wordIndex;
            bookMark = firstWord;
            if (libraryIndex >= 0) {
                libraryArray[libraryIndex].bookMark = bookMark;
                localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
            }

            getProgress();
        }
    }
}

// ---------  Progress  ------------

function getProgress() {
    let progress = bookMark / bookArray.length;
    if (progress < 0.01) {
        progress = 0.01;
    } else if (progress > 1) {
        progress = 1;
    }
    console.log(progress)
    document.documentElement.style.setProperty('--progress', `${progress}`);
}


// ---------  Search  ------------

let timeoutId = 0;
let lastSearch = [];

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
    lastSearch = searchResult;

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
    tabClick("browse-tab");
    lastSearch = authorSearchResult;
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
    tabClick("browse-tab");
    lastSearch = tagSearchResult;
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
        let issued = [date[1], date[2], date[0]].join("-");
        // let issuedHtml = "";

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
        let bookNumber = Object.values(book)[0];

        let addDeleteId;
        let addDeleteLabel;
        if (getLibraryIndex(bookNumber) < 0) {
            addDeleteId = "add";
            addDeleteLabel = "fas fa-plus";
        } else {
            addDeleteId = "delete";
            addDeleteLabel = "fas fa-trash-alt";
        }

        let buttonHtml;
        if (location == bookList) {
            bookNumber = "results" + bookNumber;
            buttonHtml = `
            <div class="library-buttons">
                <a class="button fas fa-book-open" id="read-button" ></a>
                <a class="button ${addDeleteLabel}" id="${addDeleteId}-button" ></a>
            </div>`
        } else if (location == libraryList) {
            bookNumber = "library" + bookNumber;
            buttonHtml = `
                <div class="library-buttons">
                    <a class="button fas fa-book-open" id="read-button" ></a>
                    <a class="button ${addDeleteLabel}" id="${addDeleteId}-button" ></a>
                </div>`
        } else if (location == chapterList) {
            // issuedHtml = `<h3 class="issued">Issued as an eBook on ${issued}</h3>`
            bookNumber = "chapter" + bookNumber;
            tags = ``;
            chapters = chapterArr.map((chapter) => {
                return `
                    <button type="button" class="chapterButton" id="${chapter[0]}">${chapter[1].replace(chapterRegex, "<br>")}</button>`
            }).join("");
            buttonHtml = `
                <div class="book-buttons">
                    <a class="button fas fa-play" id="start-button" ></a>
                    <a class="button ${addDeleteLabel}" id="${addDeleteId}-button" ></a>
                </div>`
        }
        
        return `
        <div class="card" id="${bookNumber}">
            <h1 class="title">${shortTitle}</h1>
            <h3 class="sub-title">${subTitle}</h3>
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


function enterFullScreen() {
    if (fullscreenWrapper.requestFullscreen) {
        fullscreenWrapper.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        fullscreenWrapper.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        fullscreenWrapper.msRequestFullscreen();
    }
}

function exitFullScreen() {
    let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
    if (isInFullScreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        setTimeout(resizeHeight, 100);   
    }
}

// ---------  Focus Card  ------------

function focusCard(bookNumber) {
    if (document.getElementById(bookNumber).classList.contains("active")) {
        document.getElementById(bookNumber).classList.remove("active");
    } else {
        Array.from(card).forEach((item) => {item.classList.remove("active")});
        document.getElementById(bookNumber).classList.add("active");
    }

}

// ---------  Clear Search  ------------

function clearSearch() {
    searchBar.value = "";
    searchBar.placeholder = "Search";
    searchBar.focus();
    toHtml([], bookList);
}

// ---------  Delete Book  ------------

function deleteBook(e) {
    let bookNumber = parseInt(e.target.parentElement.parentElement.id.slice(7), 10);
    let bookIndex = getIndexFromNumber(bookNumber);
    let bookTitle = database[bookIndex].Title;
    if (confirm(`Remove "${bookTitle}" from your library?`)) {
        libraryArray.splice(libraryArray.map(obj => obj.number).indexOf(bookNumber), 1);
        toHtml(lastSearch, bookList);
        if (bookNumber = currentBook) {
            getBook(false, currentBook, "stay");
        }
        showLibrary();
        localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
    }
    }


// ---------  Add Book  ------------

function addBook(e) {
    let bookNumber = parseInt(e.target.parentElement.parentElement.id.slice(7), 10);
    libraryArray.unshift({number: bookNumber, bookMark: 0});
    toHtml(lastSearch, bookList);
    if (bookNumber = currentBook) {
        getBook(false, currentBook, "stay");
    }
    showLibrary();
    tabClick("library-tab")
    localStorage.setItem("libraryArray", JSON.stringify(libraryArray));
}

// ---------  Panel Navigation  ------------

function tabClick(id) {
    Array.from(tab).forEach((item) => {item.classList.remove("active")});
    Array.from(panel).forEach((item) => {item.classList.remove("active")});
    document.getElementById(id).classList.add("active");
    document.getElementById(id.replace("tab", "panel")).classList.add("active");
    if (id == "page-tab" && currentBook >= 0) {
        loadPage(false, currentBook, "stay");
        paginate();
    }
}

// ---------  Book Navigation  ------------

// function previousBook() {
//     if (currentBook == 0) {
//         currentBook = libraryArray.length;
//     }
//     getBook(false, currentBook -1);
// }

// function nextBook() {
//     if (currentBook == libraryArray.length - 1) {
//         currentBook = -1;
//     }
//     getBook(false, currentBook + 1);
// }

// ---------  Settings Panel  ------------

function toggleSettings() {
 if (settingsPanel.classList.contains("active")) {
    settingsPanel.classList.remove("active");
    settingsButton.classList.remove("active");
    document.documentElement.style.setProperty('--settings-height', "8px");
    paginate();
 } else {
     settingsPanel.classList.add("active");
     settingsButton.classList.add("active");
     document.documentElement.style.setProperty('--settings-height', "216px");
     paginate();
    }
}

let timeout;

function fontSize(e) {
    let fontSize = e.target.value / 10;
    let controlSize = 12 + e.target.value / 40;
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--control-size', `${controlSize}px`);
    
    clearTimeout(timeout)
    timeout = setTimeout(paginate, 100);
}

function color(e) {
    let hue = e.target.value;
    let saturation1 = 50;
    if (e.target.value <= 50) {
        saturation1 = e.target.value;
    }
    let saturation2 = saturation1 * 2;
    let saturation3 = saturation1 * 2;
    document.documentElement.style.setProperty('--hue', hue);
    document.documentElement.style.setProperty('--saturation1', `${saturation1}%`);
    document.documentElement.style.setProperty('--saturation2', `${saturation2}%`);
    document.documentElement.style.setProperty('--saturation3', `${saturation3}%`);
}

function brightness(e) {
    let slider = e.target.value;
    let bw;
    let opA;
    let opE;
    let txt;
    let lit;
    if (slider > 128) {
        bw = 255;
        opA = slider / 255
        opE = opA * 0.75
        txt = (255 - slider) * 0.3;
        lit = slider / 3 + 15;
    } else {
        bw = 0;
        opA = 1 - slider / 255
        opE = opA * 0.75
        txt = (slider / 2) + 36;
        lit = slider / 4;
    }

    document.documentElement.style.setProperty('--bw', bw);
    document.documentElement.style.setProperty('--opA', opA);
    document.documentElement.style.setProperty('--opE', opE);
    document.documentElement.style.setProperty('--txt', `${txt}%`);
    document.documentElement.style.setProperty('--lit', `${lit}%`);
}

// ---------  After Page Load  ------------

function onLoad() {
    showLibrary();
    if (currentBook >= 0) {
        getBook(false, currentBook, "stay");
    }
}

// ---------  User Inputs  ------------

const eventMap = {
    tag: { click: tagSearch },
    author: { click: authorSearch },
    clear: { click: clearSearch },
    card: { click: focusCard },
    "card active": { click: focusCard },
    "read-button": { click: getBook },
    "delete-button": { click: deleteBook },
    "add-button": { click: addBook },
    "restart-button": { click: restartBook },
    "start-button": { click: loadPage },
    "full-screen-button": { click: enterFullScreen },
    // "previous-book-button": { click: previousBook },
    // "next-book-button": { click: nextBook },
    "next-page-button": { click: nextPage },
    "previous-page-button": { click: previousPage },
    "settings-button": { click: toggleSettings },
    tab: { click: tabClick },
    ArrowLeft: { keydown: previousPage },
    ArrowRight: { keydown: nextPage },
    ArrowUp: { keydown: toggleSettings },
    ArrowDown: { keydown: toggleSettings }
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
fontSlider.addEventListener('input', fontSize);
colorSlider.addEventListener('input', color);
brightnessSlider.addEventListener('input', brightness);
// document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
// window.addEventListener('load', getLocalLibrary);
// window.addEventListener("load", () => setTimeout(function(){
//     onLoad();
// },50));
window.addEventListener('resize', resizeHeight);


// ---------  Swipe  ------------

let touchstartX = 0
let touchendX = 0
let touchstartY = 0
let touchendY = 0

function handleGesture() {
    if (touchendX < touchstartX - 40 && touchendY - touchstartY < 80) nextPage()
    if (touchendX > touchstartX + 40 && touchendY - touchstartY < 80) previousPage()
    if (touchendY > touchstartY + 80 && touchendX - touchstartX < 80) {
    if (settingsPanel.classList.contains("active")) {
        toggleSettings();
    } else {
        exitFullScreen();
        }
    }
    if (touchendY < touchstartY - 80 && touchendX - touchstartX < 80) {
        if (!settingsPanel.classList.contains("active")) {
            toggleSettings();
        }
    }
}

page.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
  touchstartY = e.changedTouches[0].screenY
})

page.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  touchendY = e.changedTouches[0].screenY
  handleGesture()
})
