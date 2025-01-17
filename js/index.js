const direccionAPI = "http://localhost:3001/";
const ficheroAPI = "palabras.json";

const botonModo = document.querySelector(".boton-modo");
const casillas = document.querySelector(".casillas");
const inputLetra = document.querySelector(".input-letra");
const buzonLetras = document.querySelector(".letras-usadas");
const finalJuego = document.querySelector(".final-juego");
let letrasPalabra;
let palabraAleatoria = "";
let numeroIntentos = 0;
const totalIntentos = 11;

botonModo.addEventListener("click", (event) => {
  event.preventDefault();
  const bodyElemento = document.querySelector("body");
  const icono = botonModo.querySelector(".icono");
  bodyElemento.classList.toggle("dark");
  icono.textContent = bodyElemento.classList.contains("dark")
    ? "dark_mode"
    : "light_mode";
});
const getPalabrasAPI = () =>
  new Promise((resolve, reject) =>
    fetch(`${direccionAPI}${ficheroAPI}`)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error))
  );
const getPalabraAleatoria = ({ palabras: { lista } }) => {
  const palabraAleatoria = Math.floor(Math.random() * lista.length);
  return lista[palabraAleatoria];
};
const pintaPalabraAleatoria = (palabra) => {
  const arrayLetras = palabra.split("");
  for (const letra of arrayLetras) {
    const nuevaCasilla = document
      .querySelector(".casilla-dummy")
      .cloneNode(true);
    nuevaCasilla.classList.remove("casilla-dummy");
    nuevaCasilla.querySelector(".letra").textContent = letra;
    casillas.appendChild(nuevaCasilla);
  }
};
const checkLetra = (letra) => /[A-Za-z]/.test(letra);
const guardarCaracter = (caracter) => {
  const nuevoCaracter = document
    .querySelector(".letra-usada-dummy")
    .cloneNode(true);
  nuevoCaracter.classList.remove("letra-usada-dummy");
  nuevoCaracter.textContent = caracter.toUpperCase();
  buzonLetras.appendChild(nuevoCaracter);
};
const caracterExiste = (caracter) =>
  Array.from(
    buzonLetras.querySelectorAll(".letra-usada:not(.letra-usada-dummy)")
  ).some((elemento) =>
    checkLetra(caracter)
      ? elemento.textContent.toLowerCase() === caracter.toLowerCase()
      : elemento.textContent === caracter
  );
const finalizarJuego = (finalizadoCorrectamente) => {
  inputLetra.setAttribute("disabled", "true");
  finalJuego.textContent = finalizadoCorrectamente
    ? `Enhorabuena, la palabra era: ${palabraAleatoria}`
    : `Lo sentimos, ha finalizado el juego!`;
  finalJuego.classList.add(finalizadoCorrectamente ? "victoria" : "derrota");
};
const pintarMunyeco = () => {
  document.querySelector(`.stage${numeroIntentos}`).classList.add("show");
};
const comprobarLetra = (letraEscrita) => {
  let ocurrencia = false;
  for (const casilla of casillas.querySelectorAll(
    ".casilla:not(.casilla-dummy)"
  )) {
    const letra = casilla.querySelector(".letra");
    if (letra.textContent.toLowerCase() === letraEscrita.toLowerCase()) {
      if (!ocurrencia) ocurrencia = true;
      casilla.classList.add("show");
    }
  }
  return ocurrencia;
};
const contarFallo = () => {
  ++numeroIntentos;
  pintarMunyeco();
  if (numeroIntentos === totalIntentos) return finalizarJuego(false);
};
const comprobarPalabra = () => {
  let mostradas = true;
  for (const casilla of casillas.querySelectorAll(
    ".casilla:not(.casilla-dummy)"
  )) {
    if (!casilla.classList.contains("show") && mostradas) {
      mostradas = false;
    }
  }
  return mostradas;
};
inputLetra.addEventListener("input", (event) => {
  try {
    let letraEscrita = event.target.value;
    setTimeout(() => {
      inputLetra.value = "";
      if (letraEscrita.length > 1) letraEscrita = letraEscrita.charAt(0);
      if (caracterExiste(letraEscrita)) return;
      guardarCaracter(letraEscrita);
      if (checkLetra(letraEscrita)) {
        if (!comprobarLetra(letraEscrita)) {
          contarFallo();
        } else if (comprobarPalabra()) {
          finalizarJuego(true);
        }
      } else {
        contarFallo();
      }
    }, 500);
  } catch (error) {
    console.error(error.message);
  }
});
(async () => {
  try {
    const palabras = await getPalabrasAPI();
    palabraAleatoria = getPalabraAleatoria(palabras);
    pintaPalabraAleatoria(palabraAleatoria);
  } catch (error) {
    console.error(error.message);
  }
})();
