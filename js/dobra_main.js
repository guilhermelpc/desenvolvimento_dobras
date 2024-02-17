var espessuraIn = document.getElementById('espessura');
var qtdLadosIn = document.getElementById('qtd_lados');
var qtd_lados = 0;
var dropDown = document.getElementById('dropdown');
var div_lados = document.getElementById('container_lados');
var raioIn = document.getElementById('raio');
var fatorKIn = document.getElementById('fator_k');
var comprimentoIn = document.getElementById('comprimento');
const botaoCalc = document.getElementById('calcular');
const botaoReset = document.getElementById('reset'); 
var outWarn = document.getElementById('output_warn1');
var outWarnB = document.getElementById('output_warn2');
var output = document.getElementById('output_div');
var desenvOut = document.getElementById('desenv_teorico');
var somaOut = document.getElementById('soma_internas');
var pesoOut = document.getElementById('peso');
var fkOut = document.getElementById('fk_recomendado');
var ton_metro = document.getElementById('ton_metro');
var ton = document.getElementById('ton');

function desenvolvimento(esp, lados, tipo, raio, fator) {
    soma = lados.reduce((acc, cur) => {return acc + cur}, 0);
    qtd_dobras = lados.length - 1;
    deduct = 2 * Math.tan(Math.PI * 90/360) * (raio+esp) - Math.PI*90/180*(raio+fator*esp);
    if (tipo == 'externas') {
        return soma - qtd_dobras * deduct;
    }
    externas = soma + (qtd_dobras) * 2 * esp;
    return externas - qtd_dobras * deduct;
}

function soma_internas(esp, lados, tipo) {
    soma = lados.reduce((acc, cur) => {return acc + cur}, 0);
    if (tipo == 'internas') {
        return soma;
    }
    soma = soma - 2 * (lados.length-1) * esp;
    return soma;
}

function fator_k_recomendado(ri, esp) {
    return Math.log(Math.min(100, Math.max(20*ri,esp)/esp))/(2*Math.log(100));
}

function reset_output() {
    outWarn.innerHTML = '';
    outWarnB.innerHTML = '';
    desenvOut.innerHTML = '';
    somaOut.innerHTML = '';
    pesoOut.innerHTML = '';
    fkOut.innerHTML = '';
    ton_metro.innerHTML = '';
    ton.innerHTML = '';
    return;
}

function calc_min_side(esp, ladosLista, tipo) {
    lados = [...ladosLista];
    if (tipo == 'internas') {
        for (var i=0; i<lados.length; i++) {
            lados[i] = lados[i] + esp * 2;
        }
        lados[0] = lados[0] - esp;
        lados[lados.length - 1] = lados[lados.length - 1] - esp;
    }
    for (var i=0; i<lados.length; i++) {
        if (lados[i] <= esp * 6.15) {
            outWarn.innerHTML = 'AVISO: LADO < 6,15 x Esp.';
            return;
        }
    }
    return;
}

// em construcao:
function colisao(esp, lados, tipo) {
    outWarnB.innerHTML = '';
    len = lados.length;
    if (len < 3) {
        return;
    }
    internas = [...lados];
    if (tipo == 'externas') {
        for (var i=0; i<len; i++) {
            internas[i] = lados[i] - esp * 2;
        }
        internas[0] = internas[0] + esp;
        internas[len - 1] = internas[len - 1] + esp;
    }   
    if (len == 3) {
        menorAba = Math.min(internas[0], internas[len -1]);
        if (menorAba > internas[1] - 20) {
            outWarnB.innerHTML = 'AVISO: Possível colisão com ferramenta';
        }
        return;
    }
    return;
}

//em contrucao:
function forceMeter(t, r, v) {
    return ((1 + 4 * t / v) * (t ** 2) * r) / v; // [ton/m]
}