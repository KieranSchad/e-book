

import database from "./pg_caralog_2022_01_28.json" assert { type: "json" };


const databaseTest = [
    {
      "Text#": 1,
      "Type": "Text",
      "Issued": "1971-12-01",
      "Title": "The Declaration of Independence of the United States of America",
      "Language": "en",
      "Authors": "Jefferson, Thomas, 1743-1826",
      "Subjects": "United States -- History -- Revolution, 1775-1783 -- Sources; United States. Declaration of Independence",
      "LoCC": "E201; JK",
      "Bookshelves": "Politics; American Revolutionary War; United States Law"
    },
    {
      "Text#": 2,
      "Type": "Text",
      "Issued": "1972-12-01",
      "Title": "The United States Bill of Rights\nThe Ten Original Amendments to the Constitution of the United States",
      "Language": "en",
      "Authors": "United States",
      "Subjects": "Civil rights -- United States -- Sources; United States. Constitution. 1st-10th Amendments",
      "LoCC": "JK; KF",
      "Bookshelves": "Politics; American Revolutionary War; United States Law"
    },
    {
      "Text#": 3,
      "Type": "Text",
      "Issued": "1973-11-01",
      "Title": "John F. Kennedy's Inaugural Address",
      "Language": "en",
      "Authors": "Kennedy, John F. (John Fitzgerald), 1917-1963",
      "Subjects": "United States -- Foreign relations -- 1961-1963; Presidents -- United States -- Inaugural addresses",
      "LoCC": "E838",
      "Bookshelves": ""
    },
    {
        "Text#": 4,
        "Type": "Text",
        "Issued": "1973-11-01",
        "Title": "Lincoln's Gettysburg Address\nGiven November 19, 1863 on the battlefield near Gettysburg, Pennsylvania, USA",
        "Language": "en",
        "Authors": "Lincoln, Abraham, 1809-1865",
        "Subjects": "Consecration of cemeteries -- Pennsylvania -- Gettysburg; Soldiers' National Cemetery (Gettysburg, Pa.); Lincoln, Abraham, 1809-1865. Gettysburg address",
        "LoCC": "E456",
        "Bookshelves": "US Civil War"
      },
      {
        "Text#": 5,
        "Type": "Text",
        "Issued": "1975-12-01",
        "Title": "The United States Constitution",
        "Language": "en",
        "Authors": "United States",
        "Subjects": "United States -- Politics and government -- 1783-1789 -- Sources; United States. Constitution",
        "LoCC": "JK; KF",
        "Bookshelves": "United States; Politics; American Revolutionary War; United States Law"
      },
      {
        "Text#": 6,
        "Type": "Text",
        "Issued": "1976-12-01",
        "Title": "Give Me Liberty or Give Me Death",
        "Language": "en",
        "Authors": "Henry, Patrick, 1736-1799",
        "Subjects": "Speeches, addresses, etc., American; United States -- Politics and government -- 1775-1783 -- Sources; Virginia -- Politics and government -- 1775-1783 -- Sources",
        "LoCC": "E201",
        "Bookshelves": "American Revolutionary War"
      },
]


const searchInput = document.getElementById("search-bar");
const bookCards = document.getElementById("book-cards");

let displayBooks = [];

function searchFunction(e) {
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
        <div class="card">
            <h1 class="title">${book.Title}</h1>
            <h2 class="subjects">${book.Subjects}</h2>
            <h3 class="author">${book.Authors}</h3>
        </div>
        `;
    })
    .join('');
    bookCards.innerHTML = htmlString;
}




searchInput.addEventListener("input", searchFunction)


// searchInput.addEventListener("input", e => {
//     const value = e.target.value
//     books.forEach(book => {
//         const isVisible = book.title.includes(value) || book.subTitle.includes(value) || book.author.includes(value)
//         book.element.classList.toggle("hide", !isVisible)
//     })
    
// })

// displayBooks.map(book => {
//     const card = cardTemplate.content.cloneNode(true).children[0]
//     const title = card.querySelector("[title]")
//     const subTitle = card.querySelector("[subTitle]")
//     const author = card.querySelector("[author]")
//     title.textContent = book.Title
//     subTitle.textContent = book.Subjects
//     author.textContent = book.Authors
//     bookCards.append(card)
// })
