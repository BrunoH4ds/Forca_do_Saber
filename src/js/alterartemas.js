document.addEventListener("DOMContentLoaded", () => {
  // Função para alterar o tema e redirecionar para o jogo
  function alterartema(tema) {
    localStorage.setItem("tema", tema);  // Armazena o tema no localStorage
    console.log("tema selecionado: ", tema);  // Verifica no console se o tema está sendo salvo
    window.location.href = "Game.html";  // Redireciona para a página do jogo
  }


  // Eventos para alternar tema
  document.getElementById("portugues").addEventListener("click", () => alterartema("pt"));
  document.getElementById("ingles").addEventListener("click", () => alterartema("en"));
});

