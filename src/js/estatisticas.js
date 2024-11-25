// O evento 'DOMContentLoaded' é disparado quando o HTML é completamente carregado.
document.addEventListener("DOMContentLoaded", () => {
  
  // Recupera as estatísticas do jogo armazenadas no LocalStorage e converte de JSON para objeto.
  const estatisticas = JSON.parse(localStorage.getItem("estatisticasJogo"));

  // Se as estatísticas existirem, atualiza os elementos da página com essas informações.
  if (estatisticas) {
    document.querySelector(".correct p").textContent = `Acertos: ${estatisticas.palavrasCertas}`;
    document.querySelector(".purchased p").textContent = `Dicas Compradas: ${estatisticas.dicasCompradas}`;
    document.querySelector(".jumps p").textContent = `Pulos: ${estatisticas.pulos}`;
    document.querySelector(".points p").textContent = `Pontos Acumulados: ${estatisticas.pontos}`;
  }
});

