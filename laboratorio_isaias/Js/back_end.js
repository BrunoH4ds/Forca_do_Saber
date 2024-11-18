// Variaveis
let registro = "";



// </Variaveis>
function teclado(registro) {
    registro =  document.getElementsByClassName("letra-input")[0].value;
    console.log(registro);
    repeticao(registro);
};


function repeticao(registro){
    
    document.getElementsByClassName("letras")[0].innerText = registro;


    };
// classe e objetos que serão a base do nosso jogo-----------------------------------------------
class Nivel{
    constructor(Apalavra, dicaPrincipal, dicaPaga, contaNivel){ 
        this.aWord = Apalavra
        this.hints = dicaPrincipal
        this.hint_pay = dicaPaga
        this.contador = contaNivel

    }
}

const nivel1 = new Nivel("Cristo Redentor", "Uma das 7 maravilhas do mundo moderno", "Deus de uma religião");
console.log(nivel1);

const nivel2 = new Nivel("Statue of Liberty", "It is American cultural heritage", "it is the symbol of freedom");
console.log(nivel2);

const nivel3 = new Nivel("Pica", "Todos tomarão, algum dia", "objeto médico");
console.log(nivel3);

var listNiveis = [nivel1, nivel2, nivel3] 

document.getElementsByClassName("word")[0].innerHTML = nivel1.aWord;
document.getElementsByClassName("hints")[0].innerHTML = nivel1.hints;
document.getElementsByClassName("hint_pay")[0].innerHTML = nivel1.hint_pay;
// fim da seção de classes e objetos--------------------------------------------------------------

console.log(registro, repeticao())
function verificador() {
    let registro = document.getElementsByClassName("letra-input")[0].value;
    if (registro in nivel1.aWord) {
    console.log("positivo");
 }
    else{
        console.log("negativo")

 }    
}
/*
function verificador() {
    let registro = document.getElementsByClassName("letra-input")[0].value; // Captura o valor do input
    if (registro === "C") { // Compara diretamente o valor do input
        console.log("positivo");
    } else {
        console.log("negativo");
    }
}




*/