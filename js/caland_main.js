const espessuraIn = document.getElementById('espessura');
const diamExtIn = document.getElementById('diam_ext');
const diamIntIn = document.getElementById('diam_int');
const comprimentoIn = document.getElementById('comprimento');
const botaoCalc = document.getElementById('calcular');
const botaoReset = document.getElementById('reset'); 
const outWarn = document.getElementById('output_warn');
const desenvOut = document.getElementById('desenv_teorico');
const pesoOut = document.getElementById('peso');
var anchors = ['', '']; //Memória dos dois últimos campos modificados (esp, dex, din):

function reset_output() {
    outWarn.innerHTML = '';
    desenvOut.innerHTML = '';
    pesoOut.innerHTML = '';
    var anchors = ['', ''];
    return;
}

function desenvolvimento() {
    outWarn.innerHTML = '';
    esp = parseFloat(convert_comma_input(espessuraIn.value));
    dext = parseFloat(convert_comma_input(diamExtIn.value));
    diamIntIn.value = (dext - 2 * esp).toFixed(2);
    desenv = (dext - esp) * Math.PI;
    desenvOut.innerHTML = 'Desenvolvimento: ' + desenv.toFixed(2) + ' mm';
    if (!check_input(comprimentoIn.value)) {return;}
    compr = parseFloat(convert_comma_input(comprimentoIn.value));
    peso = esp * 7.9 * desenv * compr / 1e6;
    pesoOut.innerHTML = 'Peso ' + peso.toFixed(2) + ' kg';
    return;
}
