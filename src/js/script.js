document.addEventListener("DOMContentLoaded", () => {
  // Configurações iniciais
  localStorage.clear();
  const skipButton = document.querySelector(".skip");
  const jogosPorNivel = 6; // Máximo de jogos por nível
  let delayEmAndamento = false;
  let jogoAtual = 1;
  let pontos = 0;
  let palavrasRestantes = [...palavras]; // Cópia da lista original
  let DicaComprada = false;
  let Pulos = 0;
  let PalavraCerta = 0;
  let DicasCompradas = 0;
  let palavraSecreta, dicaInicial, dicaCompravel, letrasDescobertas, tentativas;
  let letrasErradas = [];

  // Imagens do boneco na forca
  const imagensForca = [
    "src/img/forca.png", // Imagem inicial (sem erros)
    "src/img/forca1.png", // 1 erro
    "src/img/forca2.png", // 2 erros
    "src/img/forca3.png", // 3 erros
    "src/img/forca4.png", // 4 erros
    "src/img/forca5.png", // 5 erros
    "src/img/forca6.png", // 6 erros
  ];

  // Seleção de palavra aleatória
  function selecionarPalavraAleatoria() {
    if (palavrasRestantes.length === 0) {
      palavrasRestantes = [...palavras]; // Reinicia a lista se esgotada
    }

    const indiceAleatorio = Math.floor(Math.random() * palavrasRestantes.length);
    const palavraAleatoria = palavrasRestantes.splice(indiceAleatorio, 1)[0]; // Remove a palavra escolhida
    palavraSecreta = palavraAleatoria.palavra.toLowerCase();
    dicaInicial = palavraAleatoria.dicaInicial;
    dicaCompravel = palavraAleatoria.dicaCompravel;
    letrasDescobertas = Array(palavraSecreta.length).fill("_");
    tentativas = 6;
    DicaComprada = false; // Reinicia a condição de dica
    atualizarImagemForca(); // Reseta a imagem da forca
  }

  // Atualizar interface do jogo
  function atualizarInterface() {
    document.querySelector("#Dica_init").textContent = `Dica inicial: ${dicaInicial}`;
    document.querySelector("#Dica_init + h1").textContent = letrasDescobertas.join(" ");
    document.querySelector("#pontuacao").textContent = ` ${String(pontos).padStart(3, "0")}`;
    document.querySelector("#progressoFase").textContent = `${jogoAtual}/${jogosPorNivel}`;
    skipButton.innerHTML = `<i class="bi bi-skip-end"></i> Pular ${Pulos}/3`;
  }

  // Atualizar a imagem da forca com base no número de tentativas
  function atualizarImagemForca() {
    const imagemElement = document.querySelector(".forca-img");
    const indiceImagem = 6 - tentativas; // Calcula o índice com base nas tentativas restantes
    imagemElement.src = imagensForca[indiceImagem];
  }

  function salvarEstatisticas() {
    const estatisticas = {
      palavrasCertas: PalavraCerta,
      dicasCompradas: DicasCompradas ? 1 : 0, // Pode incrementar em cada compra se houver mais de uma dica
      pulos: Pulos,
      pontos: pontos,
    };
    localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticas));
  }

  // Limpar mensagens no container
  function limparMensagens() {
    document.querySelector(".container .content p").textContent = ""; // motivo do bug da msg nao ser exibida
  }

  // Exibir mensagem no container
  function exibirMensagem(mensagem) {
    limparMensagens(); // Limpa mensagens anteriores
    document.querySelector(".container .content p").textContent = mensagem;
  }

  function atualizarLetrasErradas() {
    const letrasErradasElement = document.querySelector("#latters_incorrect");
    letrasErradasElement.textContent = `Letras Erradas: ${letrasErradas.join(", ")}`;
  }

  // Verificar vitória
  function verificarVitoria() {
    if (!letrasDescobertas.includes("_")) {
      pontos += 6; // Pontos por completar a palavra
      PalavraCerta++;
      if (jogoAtual < jogosPorNivel) {
        jogoAtual++;

        // Adiciona um delay de 2 segundos antes de avançar
        setTimeout(() => {
          avancarPalavra();
        }, 500);
      } else {
        salvarEstatisticas(); // Salvar os dados antes de redirecionar
        window.location.href = "src/more_html/winner.html";
      }
    }
  }

  // Avançar para a próxima palavra
  function avancarPalavra() {
    limparMensagens();
    letrasErradas = []; // Limpa a lista de letras erradas
    atualizarLetrasErradas();
    selecionarPalavraAleatoria();
    atualizarInterface();
  }

  // Evento ao inserir uma letra
  document.querySelector(".entry").addEventListener("input", (event) => {
    // Se as tentativas acabaram e o delay está ativo, bloqueia a entrada
    if (tentativas <= 0 && delayEmAndamento) {
      return; // Não permite mais tentativas enquanto o delay está em andamento
    }

    const letra = event.target.value.toLowerCase();
    event.target.value = ""; // Limpa o campo de entrada

    // Verifica se a entrada é uma letra usando expressão regular
    if (!/^[a-z]$/.test(letra)) {
      exibirMensagem("Ops, parece que o que você digitou não é uma letra. Tente novamente.");
      return; // Sai da função
    }

    // Verifica se a letra já foi usada (em letras erradas ou já descobertas)
    if (letrasErradas.includes(letra) || letrasDescobertas.includes(letra)) {
      return; // Sai da função se a letra já foi usada
    }

    let acerto = false;

    palavraSecreta.split("").forEach((char, index) => {
      if (char === letra && letrasDescobertas[index] === "_") {
        letrasDescobertas[index] = letra;
        acerto = true;
      }
    });

    if (!acerto) {
      tentativas--;
      letrasErradas.push(letra);
      exibirMensagem(`Ops! A letra "${letra}" não está na palavra. Tentativas restantes: ${tentativas}`);
      atualizarLetrasErradas(); // Atualiza a lista de letras erradas
      atualizarImagemForca(); // Atualiza a imagem da forca
      
      // Seleciona o campo de entrada
      const letraInput = document.querySelector(".entry");

      // Aplica a classe "errado" para mudar a cor para vermelho
      letraInput.classList.add("errado");

      // Aplica a animação "shake"
      letraInput.classList.add("shake");

      // Remove a classe "errado" e a animação "shake" após 1 segundo
      setTimeout(() => {
          letraInput.classList.remove("errado");
          letraInput.classList.remove("shake");
      }, 1000); // Tempo de duração para a animação e reset da cor
    }

    // Redirecionamento em caso de derrota
    if (tentativas <= 0) {
      salvarEstatisticas(); // Salvar os dados antes de redirecionar
      delayEmAndamento = true; // Marca que o delay está em andamento
      setTimeout(() => {
        window.location.href = "src/more_html/loser.html";
      }, 1500); // Adiciona o delay de 1,5 segundos
    }

    atualizarInterface();
    verificarVitoria();
  });
  
  // Evento para comprar dica
  document.querySelector(".tip").addEventListener("click", () => {
    if (!DicaComprada) {
      if (pontos >= 10) {
        DicaComprada = true;
        pontos -= 10;
        DicasCompradas++;
        exibirMensagem(`Dica Comprada: ${dicaCompravel}`);
        atualizarInterface();
      } else {
        exibirMensagem("Você não tem pontos suficientes para comprar uma dica.");
      }
    }
  });

  // Evento de pular palavra
  skipButton.addEventListener("click", () => {
    if (Pulos < 3) {
      Pulos++;
      avancarPalavra();
    }
  });

  // Iniciar o jogo
  selecionarPalavraAleatoria();
  atualizarInterface();
});


