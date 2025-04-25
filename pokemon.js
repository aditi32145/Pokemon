const form = document.querySelector('form');
const search = document.querySelector('#search');
const loading = document.querySelector('.loading');
const result = document.querySelector('.result');
const randomBtn = document.querySelector('.btn-random');

document.addEventListener('DOMContentLoaded',() =>{
    search.focus();
});

randomBtn.addEventListener('click',() =>{
removeResult();
loading.classList.remove('d-none');
let ranNum = Math.floor(Math.random()*1025)+1; //0.2*1025 = 205+1 = 206
const URI = `https://pokeapi.co/api/v2/pokemon/${ranNum}`;
getPokemon(URI,ranNum);
});

form.addEventListener('submit', (e) =>{
e.preventDefault();
removeResult();
loading.classList.remove('d-none');
loadPokemon();
});

function removeResult(){
    result.className= 'result';
    result.innerHTML = null;
}

result.addEventListener('click', removeResult);

const getPokemon = async(URI, text) =>{
try{
const res = await fetch(URI);
if(!res.ok|| !text || text<=0 || text >= 1025){
    throw 'Please only numbers between 1 and 1024 or type the name correctly';
}
const data = await res.json();
console.log(data);

const {id,name,
    sprites:{
        other:{
            dream_world: {front_default}
        }
    }
} = data;

console.log("Image URL: ", front_default);

const imgSrc = front_default?? 'https://via.placeholder.com/200?text=No+Image';

setTimeout(()=>{
loading.classList.add('d-none');
result.className = 'result';
result.innerHTML = `
<div class="pokebox found">
          <span class="closebox">&#10008;</span>
          <img src="${imgSrc}" alt="${name}" class="pokemon">
          <h3 class="pokename">${name}</h3>
          <p class="pokenumber">#${id.toString().padStart(4,'0')}</p>
        </div> ` ;
        search.value = null;
},1600);

}catch(error){
console.log(error);

let pokenumber = search.value ? (isNaN(search.value)?search.value:
`#${search.value}`):'';

setTimeout(()=>{
    loading.classList.add('d-none');
    result.className = 'result';
    result.innerHTML = `
    <div class="pokebox notfound">
              <span class="closebox">&#10008;</span>
             <h1><img src="images/error.png" alt="pokeball"/>
             </h1>
             <p>Pokemon <span class="pokenumber">${pokenumber}</span> not found </p>
            </div> ` ;
    },1600);
}
};

function loadPokemon(){
    let text=search.value.trim();
    if (isNaN(text)) text = text.toLowerCase();
    const URI = `https://pokeapi.co/api/v2/pokemon/${text}`;
    getPokemon(URI,text)
}
