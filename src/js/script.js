document.addEventListener("DOMContentLoaded", () => {
  // Configurações iniciais
  let nivelAtual = "facil";
  const jogosPorNivel = 6; // Máximo de jogos por nível
  let jogoAtual = 1;
  let pontos = 0;
  let palavrasDoNivel = palavras[nivelAtual];
  let indiceAtual = 0;
  let palavraSecreta, dicaInicial, dicaCompravel, letrasDescobertas, tentativas;

  // Atualizar configurações do jogo
  function atualizarConfiguracoes() {
    palavraSecreta = palavrasDoNivel[indiceAtual].palavra.toLowerCase();
    dicaInicial = palavrasDoNivel[indiceAtual].dicaInicial;
    dicaCompravel = palavrasDoNivel[indiceAtual].dicaCompravel;
    letrasDescobertas = Array(palavraSecreta.length).fill("_");
    tentativas = 6;
  }

  // Atualizar interface
  function atualizarInterface() {
    document.querySelector("#Dica_init").textContent = `Dica inicial: ${dicaInicial}`;
    document.querySelector("#Dica_init + h1").textContent = letrasDescobertas.join(" ");
    document.querySelector("#pontuacao").textContent = ` ${String(pontos).padStart(3, "0")}`;
    document.querySelector("#progressoFase").textContent = `Jogo: ${jogoAtual}/${jogosPorNivel}`;
    document.querySelector("#nivelAtual").textContent = `Nível: ${nivelAtual[0].toUpperCase() + nivelAtual.slice(1)}`;
  }

  // Função para verificar vitória
  function verificarVitoria() {
    if (!letrasDescobertas.includes("_")) {
      pontos += 6; // Pontos por completar a palavra
      if (jogoAtual < jogosPorNivel) {
        jogoAtual++;
        avancarPalavra();
      } else {
        mudarNivel();
      }
    }
  }

  // Avançar para próxima palavra no mesmo nível
  function avancarPalavra() {
    indiceAtual = (indiceAtual + 1) % palavrasDoNivel.length;
    atualizarConfiguracoes()
    atualizarInterface()
    document.querySelector(".container .content p").textContent = ``;
  }

  // Mudar de nível
  function mudarNivel() {
    if (nivelAtual === "facil") {
      
      nivelAtual = "medio";
    } else if (nivelAtual === "medio") {
      
      nivelAtual = "dificil";
    } else {
      // Finalizar o jogo se todos os níveis forem completados
      window.location.href = "src/more_html/winner.html";
      return;
    }

    jogoAtual = 1;
    palavrasDoNivel = palavras[nivelAtual];
    indiceAtual = 0;
    atualizarConfiguracoes();
    atualizarInterface();
  }

  // Evento para entrada de letras
  document.querySelector(".entry").addEventListener("input", (event) => {
    const letra = event.target.value.toLowerCase();
    event.target.value = ""; // Limpar campo
    let acerto = false;

    palavraSecreta.split("").forEach((char, index) => {
      if (char === letra && letrasDescobertas[index] === "_") {
        letrasDescobertas[index] = letra;
        acerto = true;
      }
    });

    if (acerto) {
      pontos += 3;
    } else {
      tentativas--;
    }

    if (tentativas <= 0) {
      window.location.href = "src/more_html/loser.html";
    }

    atualizarInterface();
    verificarVitoria();
  });

  // Evento para comprar dica
  document.querySelector(".tip").addEventListener("click", () => {
    if (pontos >= 10) {
      pontos -= 10;
      
      document.querySelector(".container .content p").textContent = `Dica: ${dicaCompravel}`;
      atualizarInterface();
    } else {
      document.querySelector(".container .content p").textContent = "Você não tem pontos suficientes para comprar uma dica!";
    }
  });

  // Evento para pular palavra
  document.querySelector(".skip").addEventListener("click", () => {
    if (jogoAtual < jogosPorNivel) {
      jogoAtual++;
      avancarPalavra();
    } else {
      document.querySelector(".container .content p").textContent = "Não há mais palavras para pular neste nível!";
    }
  });

  // Iniciar jogo
  atualizarConfiguracoes();
  atualizarInterface();
});
