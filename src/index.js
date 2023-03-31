import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { search } from './search';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

var lightbox = new SimpleLightbox(".gallery a", {
    // captionsData: "alt",
    // captionPosition: "bottom",
    // captionDelay: 250,
});


const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

window.addEventListener('scroll', debounce(onScrollDocument, DEBOUNCE_DELAY));
form.addEventListener('submit', searchImg);

let page = 1;
let request = '';
let arrayImg = '';
let hits = '';

async function searchImg(e) {
    e.preventDefault();
    gallery.innerHTML = '';
    const {elements: { searchQuery }} = e.currentTarget;
    request = searchQuery.value.trim();
    form.reset();

    if(request === ''){
        gallery.innerHTML = '';
        return;
    }
    const response = await search(request, page)
    arrayImg = response.data.hits;
    hits = response.data.totalHits
    console.log(arrayImg.length);

    if(arrayImg.length <= 0){
     errorMessage();
     return;
    }
    
    renderItemList(arrayImg)
    hitsMessages(hits);
  
}

function renderItemList(item) {
   const listItem = item.map(item =>
        `<div class="photo-card">
                  <a href="${item.largeImageURL}">      
                  <div class="thumb">  
                  <img
                    src="${item.webformatURL}"
                    alt=" ${item.webformatURL}"
                    loading="lazy"
                    />
                    </div>
                  </a>
                  <div class="info">
                    <p class="info-item"><b>Likes</b><br> ${item.likes}</p>
                    <p class="info-item"><b>Views</b><br> ${item.views}</p>
                    <p class="info-item"><b>Comments</b><br> ${item.comments}</p>
                    <p class="info-item"><b>Downloads</b><br> ${item.downloads}</p>
                  </div>
                </div>`
    )
        .join('');

    gallery.insertAdjacentHTML('beforeend', listItem);
    lightbox.refresh();
}

function hitsMessages(hits) {
    Notify.success(`Hooray! We found ${hits} images.`, {timeout: 5000})
}

function onScrollDocument(){
    const scroll = document.documentElement.getBoundingClientRect()
    if(scroll.bottom < document.documentElement.clientHeight + 150){
        page ++;
        search(request, page);
        renderItemList(arrayImg);
    }
}

function errorMessage() {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.', {timeout: 3000})
}


//! функции по: 1(сообщение после прокрутки в самый низ галереии) 2(сообщение при пустом инпуте) 3(симпл лайт бокс)