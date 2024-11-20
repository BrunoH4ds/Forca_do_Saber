document.addEventListener("DOMContentLoaded", () => {
  const estatisticas = JSON.parse(localStorage.getItem("estatisticasJogo"));

  if (estatisticas) {
  document.querySelector(".correct p").textContent = `Acertos: ${estatisticas.palavrasCertas}`;
  document.querySelector(".purchased p").textContent = `Dicas Compradas: ${estatisticas.dicasCompradas}`;
  document.querySelector(".jumps p").textContent = `Pulos: ${estatisticas.pulos}`;
  document.querySelector(".points p").textContent = `Pontos Acumulados: ${estatisticas.pontos}`;
  }
});

