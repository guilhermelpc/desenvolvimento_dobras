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
var outWarn = document.getElementById('output_warn');
var output = document.getElementById('output_div');
var desenvOut = document.getElementById('desenv_teorico');
var somaOut = document.getElementById('soma_internas');
var pesoOut = document.getElementById('peso');
var fkOut = document.getElementById('fk_recomendado');

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
    desenvOut.innerHTML = '';
    somaOut.innerHTML = '';
    pesoOut.innerHTML = ''
    fkOut.innerHTML = ''
    return;
}