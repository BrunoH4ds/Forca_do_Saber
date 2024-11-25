document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("estatisticasJogo");
  const skipButton = document.querySelector(".skip");
  const jogosPorNivel = 10; // Máximo de jogos por nível
  let delayEmAndamento = false;
  let jogoAtual = 1;
  let pontos = 0;
  const temaAtual = localStorage.getItem("tema") || "pt"; // Carrega o tema do localStorage
  let palavrasRestantes = [...palavras[temaAtual]]; // Usa o banco de palavras com base no tema
  let dicaComprada = false;
  let pulos = 0;
  let palavraCerta = 0;
  let dicasCompradas = 0;
  let palavraSecreta, dicaInicial, dicaCompravel, letrasDescobertas, tentativas;
  let letrasErradas = [];

  // Define o volume inicial para 2%
  document.getElementById('music').volume = 0.02; 

  // Altera o conteúdo do header com base no tema
  const headerGame = document.querySelector(".matter h1");
  if (temaAtual === "pt") {
    headerGame.textContent = "Português"; // Se o tema for Português
  } else if (temaAtual === "en") {
    headerGame.textContent = "Inglês"; // Se o tema for Inglês
  }

  // Imagens do boneco na forca
  const imagensForca = [
    "src/img/forca/forca.png", // Imagem inicial (sem erros)
    "src/img/forca/forca1.png", // 1 erro
    "src/img/forca/forca2.png", // 2 erros
    "src/img/forca/forca3.png", // 3 erros
    "src/img/forca/forca4.png", // 4 erros
    "src/img/forca/forca5.png", // 5 erros
    "src/img/forca/forca6.png", // 6 erros
  ];

  // Seleção de palavra aleatória
  function selecionarPalavraAleatoria() {
    if (palavrasRestantes.length === 0) {
      palavrasRestantes = [...palavras[temaAtual]]; // Reinicia a lista se esgotada
    }
  
    const indiceAleatorio = Math.floor(Math.random() * palavrasRestantes.length);
    const palavraAleatoria = palavrasRestantes.splice(indiceAleatorio, 1)[0]; // Remove a palavra escolhida
    palavraSecreta = palavraAleatoria.palavra.toLowerCase();
    dicaInicial = palavraAleatoria.dicaInicial;
    dicaCompravel = palavraAleatoria.dicaCompravel;
  
    // Gera o array letrasDescobertas, mostrando espaços visíveis
    letrasDescobertas = Array.from(palavraSecreta, char => (char === " " ? "-" : "_"));
  
    tentativas = 6;
    dicaComprada = false; // Reinicia a condição de dica
    atualizarImagemForca(); // Reseta a imagem da forca
  }  

  // Atualizar interface do jogo
  function atualizarInterface() {
    document.querySelector("#Dica_init").textContent = dicaInicial;
    document.querySelector("#Dica_init + h1").textContent = letrasDescobertas.join(" ");
    document.querySelector("#pontuacao").textContent = ` ${String(pontos).padStart(3, "0")}`;
    document.querySelector("#progressoFase").textContent = `${jogoAtual}/${jogosPorNivel}`;
    skipButton.innerHTML = `<i class="bi bi-skip-end"></i> Pular ${pulos}/3`;
  }

  // Atualizar a imagem da forca com base no número de tentativas
  function atualizarImagemForca() {
    const imagemElement = document.querySelector(".forca-img");
    const indiceImagem = 6 - tentativas; // Calcula o índice com base nas tentativas restantes
    imagemElement.src = imagensForca[indiceImagem];
  }

  function salvarEstatisticas() {
    const estatisticas = {
      palavrasCertas: palavraCerta,
      dicasCompradas: dicasCompradas ? 1 : 0, // Pode incrementar em cada compra se houver mais de uma dica
      pulos: pulos,
      pontos: pontos,
    };
    localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticas));
  }

  // Limpar mensagens no container
  function limparMensagens() {
    document.querySelector(".container .content p").textContent = ""; // Motivo do bug da mensagem não ser exibida
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
      pontos += 8; // Pontos por completar a palavra
      palavraCerta++;
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
      const camp_message = document.querySelector(".message");

      // Aplica a classe "errado" para mudar a cor para vermelho
      camp_message.classList.add("errado");

      // Aplica a animação "shake"
      camp_message.classList.add("shake");

      // Remove a classe "errado" e a animação "shake" após 1 segundo
      setTimeout(() => {
        camp_message.classList.remove("errado");
        camp_message.classList.remove("shake");
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
    if (!dicaComprada) {
      if (pontos >= 10) {
        dicaComprada = true;
        pontos -= 10;
        dicasCompradas++;
        exibirMensagem(`Dica Comprada: ${dicaCompravel}`);
        atualizarInterface();
      } else {
        exibirMensagem("Você não tem pontos suficientes para comprar uma dica.");
      }
    }
  });

  // Evento de pular palavra
  skipButton.addEventListener("click", () => {
    // Verifica se ainda há jogos restantes e se o limite de pulos não foi alcançado
    if (jogoAtual < jogosPorNivel && pulos < 3) {
      pulos++; // Incrementa o número de pulos
      jogoAtual++; // Avança o jogo
      avancarPalavra(); // Avança para a próxima palavra
    }
    // Bloqueia o botão se atingir o máximo de jogos ou o limite de pulos
    if (jogoAtual >= jogosPorNivel || pulos >= 3) {
      skipButton.style.filter = "grayscale(1)"; // Aplica o filtro cinza
      skipButton.disabled = true; // Desativa o botão
      skipButton.classList.remove("upscale");
      skipButton.classList.add("shake");
    }
  });

  // Iniciar o jogo
  selecionarPalavraAleatoria();
  atualizarInterface();
});
