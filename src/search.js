import axios from "axios";
const url = 'https://pixabay.com/api/'
const key = '34923936-72b1522875746ba4d44cc2019'
let page = 1;

async function search(item) {
    const adress = `${url}?key=${key}&q=${item}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    try {
        return await axios.get(adress);
    } catch (error) {
        console.log(error);
    }

}

export {search};
