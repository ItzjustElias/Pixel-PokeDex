const poke_container = document.getElementById("poke-container");
const search = document.getElementById("search");
const random_pokemon_button = document.getElementById("random-btn");
const pokemon_count = 1025;
const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ice: "#A9B5E2",
  ghost: "#D988FF",
  steel: "#D4D4CE",
  dark: "#91609F",
  fairy: "#FAD8F8",
};

const main_types = Object.keys(colors);
let allPokemons = [];
let loadedCount = 0;

const showLoadingScreen = () => {
  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loading-screen";
  loadingScreen.style.position = "fixed";
  loadingScreen.style.top = "0";
  loadingScreen.style.left = "0";
  loadingScreen.style.width = "100vw";
  loadingScreen.style.height = "100vh";
  loadingScreen.style.backgroundColor = "rgba(15, 0, 255, 1)";
  loadingScreen.style.color = "white";
  loadingScreen.style.display = "flex";
  loadingScreen.style.flexDirection = "column";
  loadingScreen.style.justifyContent = "center";
  loadingScreen.style.alignItems = "center";
  loadingScreen.style.zIndex = "1000";
  loadingScreen.style.fontSize = "24px";

  loadingScreen.innerHTML = `
        <div>Loading Pokémon...</div>
        <div id="loading-counter">${loadedCount}/${pokemon_count}</div>
    `;

  document.body.appendChild(loadingScreen);
};

const updateLoadingCounter = () => {
  loadedCount++;
  const counterElement = document.getElementById("loading-counter");
  if (counterElement) {
    counterElement.textContent = `${loadedCount}/${pokemon_count}`;
  }
};

const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    document.body.removeChild(loadingScreen);
  }
};

const fetchPokemons = async () => {
  showLoadingScreen();

  for (let i = 1; i <= pokemon_count; i++) {
    await getPokemon(i);
    updateLoadingCounter();
  }

  hideLoadingScreen();
};

const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  allPokemons.push(data);
  createPokemonCard(data);
};

const createPokemonCard = (pokemon) => {
  const pokemonE1 = document.createElement("div");
  pokemonE1.classList.add("pokemon");

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");

  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) > -1);
  const color = colors[type];

  pokemonE1.style.backgroundColor = color;

  const pokemonInnerHTML = `
    <div class="img-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${type}</span> </small>
        <br>
        <br>
        <button class="stats-button">Stats</button>
    </div>
    `;

  pokemonE1.innerHTML = pokemonInnerHTML;

  poke_container.appendChild(pokemonE1);

  const statsButton = pokemonE1.querySelector(".stats-button");
  statsButton.addEventListener("click", () => showStatsPopup(pokemon));
};

const showStatsPopup = (pokemon) => {
  const popupContainer = document.createElement("div");
  popupContainer.id = "popup-container";
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "0";
  popupContainer.style.left = "0";
  popupContainer.style.width = "100vw";
  popupContainer.style.height = "100vh";
  popupContainer.style.background = "rgba(0, 0, 0, 0.6)";
  popupContainer.style.display = "flex";
  popupContainer.style.justifyContent = "center";
  popupContainer.style.alignItems = "center";
  popupContainer.style.zIndex = "1000";
  popupContainer.style.textDecoration = "none";

  const popup = document.createElement("div");
  popup.style.background = "white";
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.width = "300px";
  popup.style.maxWidth = "90%";
  popup.style.textAlign = "center";
  popup.style.textDecoration = "none";
  popup.style.position = "relative";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

  const closeButton = document.createElement("span");
  closeButton.textContent = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "18px";

  closeButton.addEventListener("click", () => {
    document.body.removeChild(popupContainer);
  });

  const statsHTML = `
        <h2>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          pokemon.id
        }.png" alt="${pokemon.name}">
        <p><strong>ID:</strong> #${pokemon.id.toString().padStart(3, "0")}</p>
        <p><strong>Type:</strong> ${pokemon.types
          .map((type) => type.type.name)
          .join(", ")}</p>
        <p><strong>Stats:</strong></p>
        <ul>
            ${pokemon.stats
              .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
              .join("")}
        </ul>
    `;

  popup.innerHTML = statsHTML;
  popup.appendChild(closeButton);
  popupContainer.appendChild(popup);

  document.body.appendChild(popupContainer);
};

const filterPokemons = (query) => {
  query = query.toLowerCase();
  poke_container.innerHTML = "";

  const filtered = allPokemons.filter((pokemon) => {
    const name = pokemon.name.toLowerCase();
    const id = pokemon.id.toString();
    const types = pokemon.types.map((type) => type.type.name);

    return (
      name.includes(query) ||
      id.includes(query) ||
      types.some((type) => type.includes(query))
    );
  });

  filtered.forEach((pokemon) => createPokemonCard(pokemon));
};

const getRandomPokemon = () => {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  poke_container.innerHTML = "";
  getPokemon(randomId);
};

search.addEventListener("input", (e) => {
  const query = e.target.value;
  filterPokemons(query);
});

random_pokemon_button.addEventListener("click", getRandomPokemon);

fetchPokemons();
