import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { search } from './search';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const DEBOUNCE_DELAY = 300;

var lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
});


const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', searchImg);

async function searchImg(e) {
    e.preventDefault();
    gallery.innerHTML = '';
    const {elements: { searchQuery }} = e.currentTarget;
    let request = searchQuery.value.trim();
    const response = await search(request)
    const arrayImg = response.data.hits;
    const hits = response.data.totalHits
    if(request === ''){
        gallery.innerHTML = '';
        return;
    }
    renderItemList(arrayImg)
    hitsMessages(hits);
    form.reset()
}

function renderItemList(item) {
    listItem = item.map(item =>
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
}

function hitsMessages(hits) {
    Notify.success(`Hooray! We found ${hits} images.`, {timeout: 5000})
}