const espessuraIn = document.getElementById('espessura');
const diamExtIn = document.getElementById('diam_ext');
const diamIntIn = document.getElementById('diam_int');
const comprimentoIn = document.getElementById('comprimento');
const anguloIn = document.getElementById('angulo');
const botaoCalc = document.getElementById('calcular');
const botaoReset = document.getElementById('reset'); 
const outWarn = document.getElementById('output_warn');
const desenvOut = document.getElementById('desenv_teorico');
const pesoOut = document.getElementById('peso');
var anchors = ['', '']; 

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
    angulo = parseFloat(convert_comma_input(anguloIn.value));
    diamIntIn.value = ((dext - 2 * esp) * angulo / 360).toFixed(2);
    desenv = (dext - esp) * Math.PI * angulo / 360;
    desenvOut.innerHTML = 'Desenvolvimento: ' + desenv.toFixed(2) + ' mm';
    if (!check_input(comprimentoIn.value)) {return;}
    compr = parseFloat(convert_comma_input(comprimentoIn.value));
    peso = esp * 7.9 * desenv * compr / 1e6;
    pesoOut.innerHTML = 'Peso ' + peso.toFixed(2) + ' kg';
    return;
}

