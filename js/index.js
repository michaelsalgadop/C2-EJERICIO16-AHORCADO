const botonModo = document.querySelector(".boton-modo");
botonModo.addEventListener("click", (event) => {
  event.preventDefault();
  const bodyElemento = document.querySelector("body");
  const icono = botonModo.querySelector(".icono");
  bodyElemento.classList.toggle("dark");
  icono.textContent = bodyElemento.classList.contains("dark")
    ? "dark_mode"
    : "light_mode";
});
