const apiOptions = {
    method: 'GET',
    headers:{
        accept:'application/json',
        Authorization:'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I'
    }
}

const state = {
    movieList:[],
    likeList:[],
    toltalPages:0,
    currentPage:1,
    currentFilter:'popular',
    currentTab: "HOME"
}

const BASE_URL = "https://api.themoviedb.org/3"
const BASE_IMG_SRC = "https://image.tmdb.org/t/p/w500"

const list_container = document.querySelector("#movieList")
function createMovieCard(title,img,rating,id){
    const isLiked = state.likeList.some((movie) => {
        return movie.id === id
    });

    const card = document.createElement('div')
    card.className = 'movie-card';
    card.id = id

    const cardImgDiv = document.createElement("div");
    cardImgDiv.className = 'movie-card-img';
    
    const image = document.createElement('img');
    image.src = `${BASE_IMG_SRC}${img}`;
    cardImgDiv.append(image);
    
    const titleH4 = document.createElement("h4");
    titleH4.innerHTML = title;
    titleH4.className = 'movie-card-title';

    const ratingDiv = document.createElement("div")
    ratingDiv.className = 'rating';
    const ratingStarNumberDiv = document.createElement('div')
    ratingStarNumberDiv.className = 'rating-star-div'
    const ratingIcon = document.createElement('i');
    const ratingNumber = document.createElement("span")
    ratingNumber.innerHTML = rating;
    ratingIcon.className = "icon ion-md-star rating-icon"
    ratingStarNumberDiv.append(ratingIcon)
    ratingStarNumberDiv.append(ratingNumber)
    ratingDiv.append(ratingStarNumberDiv)

    const likeDiv = document.createElement('div')
    likeDiv.className = 'like-div'
    const likeIcon = document.createElement('i');
    likeIcon.className = `like-icon icon ${isLiked ? 'ion-md-heart' : 'ion-md-heart-empty'}`
    likeDiv.append(likeIcon)
    ratingDiv.append(likeDiv)

    likeDiv.addEventListener("click",() => {
        const movie = { title,img:`${BASE_IMG_SRC}${img}`,rating,id }
        if(!isLiked){
            state.likeList.push(movie)
        }else{
            state.likeList = state.likeList.filter(movie => movie.id !== id)
        }
        renderMovies()
    })
    
    card.append(cardImgDiv);
    card.append(titleH4);
    card.append(ratingDiv);
    return card;
}

function renderMovies(){
    list_container.innerHTML = ''

    if(state.currentTab === 'HOME'){
        state.movieList.map(movie => {
            const card = createMovieCard(movie.title,movie.poster_path,movie.vote_average,movie.id)
            list_container.append(card)
        })
    }else if(state.currentTab === 'LIKED'){
        state.likeList.map(movie => {
            const card = createMovieCard(movie.title,movie.img,movie.rating,movie.id)
            list_container.append(card)
        })
    }
}

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',apiOptions)
//     .then(res => res.json())
//     .then(res => {
//         state.movieList = res.results;
//         console.log(state.movieList);
//         renderMovies();
//     })
//     .catch(err => console.error(err));

function fetchData(category = "popular", page = 1){
    const movieData = fetch(`${BASE_URL}/movie/${category}?language=en-US&page=${page}`,apiOptions)
                        .then( res =>{
                            if(res.ok){
                                return res.json();
                            }else{
                                return [];
                            }
                        })
    return movieData;
}

async function handleFilterChange(){
    const filters = document.querySelector(".filter-select");
    const selectedFilter = filters.value;
    state.currentFilter = selectedFilter;
    const data = await fetchData(selectedFilter);
    state.movieList = data.results;
    renderMovies();
}

function handleTabChange(e){
    const clickedTab = e.target;
    const tabName = clickedTab.getAttribute("name");
    state.currentTab = tabName;
    document.querySelectorAll(".tab-item").forEach( tab =>{
        tab.classList.remove("active");
    });
    clickedTab.classList.add("active");
    renderMovies();
}

function addEventListners(){
    // filter eventListner:
    const tabSelect = document.querySelector(".filter-select");
    tabSelect.addEventListener("change", handleFilterChange);

    // tab eventListner:
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener("click", handleTabChange);
    })

}

async function onload(){
    const data = await fetchData("popular",1);
    state.movieList = data.results;


    renderMovies();
    addEventListners();
}

onload();