// film numbers
ids = [4, 5, 6, 1, 2, 3];

// contains the information of films. jsonContent[i] contains the information about the film with id = i
jsonContent = []

// allStarships = new Array(ids.length)

// the wrapper is content-box (div tag) that contains all elements
wrapper = document.getElementById('content-box');

// fetching data
async function fetchMovieData(url) {
    const response = await fetch(url);
    return await response.json();


}

// the state of the data, the page which we are in it, number of rows to show in each page
var state = {
    'querySet': null,
    'page': 1,
    'rows': 5,
}

/*
* slicing all starships of a movie in groups with maximum 5 members
* this is because we want to show 5 starship in each page
*/
function pagination(querySet, page, rows) {
    const trimStart = (page - 1) * rows;
    const trimEnd = trimStart + rows;
    console.log(querySet);
    const trimmedData = querySet.slice(trimStart, trimEnd);

    const pages = Math.ceil(querySet.length / rows);
    console.log(pages)
    return {
        'querySet': trimmedData,
        'pages': pages
    }
}

/* creating page buttons AND and them to the content */
function pageButtons() {

    const prvPageBtn = document.createElement('button');
    const nextPageBtn = document.createElement('button');
    const mainPageBtn = document.createElement('button');

    prvPageBtn.className = 'page';
    prvPageBtn.className = 'page';
    prvPageBtn.className = 'page';

    prvPageBtn.id = 'prv-button';
    nextPageBtn.id = 'next-button';
    mainPageBtn.id = 'mainmenu-button';

    prvPageBtn.innerText = "previous page";
    nextPageBtn.innerText = 'next page';
    mainPageBtn.innerText = 'Main Menu';
    const pageNumberlabel = document.createElement('label');
    pageNumberlabel.innerText = "Page-" + state.page;

    if (state.page + 1 > this.state.pages)
        nextPageBtn.disabled = true;
    if (state.page <= 1)
        prvPageBtn.disabled = true;

    prvPageBtn.addEventListener('click', handlePrvPage);
    nextPageBtn.addEventListener('click', handleNextPage);
    mainPageBtn.addEventListener('click', setMovies);

    const pageWrapper = document.createElement("div");
    pageWrapper.id = "pageWrapper";

    const pagesDiv = document.createElement('div');
    pagesDiv.className = 'pages-div';
    pagesDiv.appendChild(prvPageBtn);
    pagesDiv.appendChild(pageNumberlabel);
    pagesDiv.appendChild(nextPageBtn);

    // pageWrapper.appendChild(mainPageBtn);

    const mainMenuDiv = document.createElement('div');
    mainMenuDiv.appendChild(mainPageBtn)
    mainMenuDiv.className = 'pages-div';

    document.getElementById('starships-name-column').appendChild(pageWrapper)
    pageWrapper.appendChild(pagesDiv);
    pageWrapper.appendChild(mainMenuDiv)
    // document.getElementById('starships-name-column').appendChild(mainMenuDiv)

}

// handle prv page button
function handlePrvPage() {
    if (state.page <= 1) {

        return
    }

    state.page = state.page - 1;
    buildSecondPageContent()

}

// handle next page button
function handleNextPage() {

    if (state.page + 1 > state.pages) {
        return
    }
    state.page = state.page + 1;

    buildSecondPageContent()
}


async function iterateMovies(moviesList) {
    let list = []
    for (let url of moviesList) {
        const json = await fetchMovieData(url);
        console.log(json.title);
        list.push(json.title);


    }
    return list;
}

// with clicking on starship names this function will be executed
function handleShipNameBtn(evt, starshipInfo) {

    document.querySelectorAll(".activated").forEach(el => el.classList.remove('activated'));
    evt.target.classList.add("activated");
    const rightCol = document.getElementById('starship-info-column');
    rightCol.innerHTML = '';
    Object.entries(starshipInfo).map(async ([key, value]) => {

        if (key == 'model' || key == 'manufacturer' || key == 'crew' || key == 'passengers' || key == 'films') {

            const itemDiv = document.createElement('div');
            itemDiv.className = "item-div";
            rightCol.appendChild(itemDiv);

            const keySpan = document.createElement('span');
            keySpan.className = 'key-span';
            const valSpan = document.createElement('span');
            valSpan.className = 'val-span';
            itemDiv.appendChild(keySpan);
            itemDiv.appendChild(valSpan);
            keySpan.innerText = key + ':';


            if (key == 'films') {
                const list = await iterateMovies(value);
                console.log(list)
                for (const el of list) {
                    const div = document.createElement('div');
                    div.innerText = el;
                    console.log(el)
                    valSpan.appendChild(div);

                }
                return
            }

            valSpan.innerText = value + "";

        }
    });


}

// this function build the second page that contains the starship names and information
function buildSecondPageContent() {


    const data = pagination(state.querySet, state.page, state.rows);

    console.log('Data:', data);
    // myList = data.querySet;
    const myList = data.querySet;

    state.pages = data.pages;

    var wrapper = document.getElementById('content-box');
    wrapper.innerHTML = '';

    const leftColumn = document.createElement("div");
    leftColumn.id = 'starships-name-column';

    const rightColumn = document.createElement("div");
    rightColumn.id = 'starship-info-column';
    const columnsContainer = document.createElement("div");

    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    columnsContainer.id = 'all-column-container';
    wrapper.appendChild(columnsContainer);
    const ul = document.createElement('ul');


    for (let e of myList) {


        const shipNameBtn = document.createElement("button");
        shipNameBtn.innerText = e.name + ""
        shipNameBtn.className = 'ship-name-button';
        shipNameBtn.onclick = (evt) => handleShipNameBtn(evt, e);

        console.log(e.name)

        const li = document.createElement("li");
        li.className = 'starship-name-li'
        li.appendChild(shipNameBtn);
        ul.appendChild(li);

        leftColumn.appendChild(ul)

    }
    pageButtons();

}

/* with clicking on starship button this function execute
* js argument is a film data
* we get the starships of that movie
* then setting querySet to this data that contains the starships of a movie
* then with buildSecondPageContent the second page will create
* */
async function handleStarshipBtn(js) {
    let starshipUrls = js.starships;
    const starshipsOfAMovie = []

    for (let urlKey of starshipUrls) {
        const response = await fetch(`${urlKey}`);
        const ja = await response.json();
        starshipsOfAMovie.push(ja);
    }

    // return starshipsOfAMovie;
    state.querySet = starshipsOfAMovie
    buildSecondPageContent()
}

/*this function gets all the starships information of a movie
* and returns this information to the handleStarshipBtn function
* */
/*async function getStarshipsInfo(js) {


}*/

/*
async function getAllStarshipInfo() {
    // starshipUrls = new Array(ids.length);
    // for (let i of ids) {
    // making 2d Array
    for (let i of ids) {
        // urls[i] = []
        allStarships[i] = []

    }
    let urls = [];
    for (let i of ids) {
        // console.log(jsonContent[i])
        // urls = await jsonContent[i].starships;
        urls = jsonContent[i].starships;

        // console.log(urls[i])
        for (let urlKey of urls) {
            // console.log(urlKey)
            const response = await fetch(`${urlKey}`);
            // console.log(response);
            const starshipInformation = await response.json();
            // console.log(starshipInformation);
            allStarships[i].push(starshipInformation);

        }
        console.log(allStarships[i])

    }


}
*/

// the main page rise up with this function
async function setMovies() {
    state.page = 1;
    // clear all HTML content of content-box
    wrapper.innerHTML = '';

    // Creating 'Movies' header element
    const header = document.createElement('h2');
    header.id = "title";
    header.innerText = "Movies";
    wrapper.appendChild(header);

    // Creating ul element that contains film names in first page
    const ul = document.createElement('ul');
    wrapper.appendChild(ul);

    for (let i of ids) {

        // fetching data from urls
        let json = await fetchMovieData(`https://swapi.dev/api/films/${i}`);
        jsonContent[i] = json;

        // getting the title, epId, date and adding the element on page
        let title = json.title;
        let epId = json.episode_id;
        let date = json.release_date;


        const str = title + "       " + epId + "       " + date;

        const p = document.createElement("pre");
        const node = document.createTextNode(str);
        p.appendChild(node);

        const starshipButton = document.createElement("button");
        starshipButton.innerText = "Starship";
        starshipButton.className = "StarshipBtn"

        starshipButton.onclick = () => handleStarshipBtn(json)


        const div = document.createElement("div");
        div.className = 'each-movie-div';


        const div2 = document.createElement("div");
        div2.className = 'div2';
        div2.appendChild(starshipButton);

        div.appendChild(p);
        div.appendChild(div2);

        const li = document.createElement("li");
        li.appendChild(div);

        ul.id = 'movies-list'
        ul.appendChild(li);


    }
    // state.page = '1';
}

setMovies();
