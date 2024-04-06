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
const svgDiv = document.getElementById("drawing");
var anchors = ['', '']; 

function reset_output() {
    outWarn.innerHTML = '';
    desenvOut.innerHTML = '';
    pesoOut.innerHTML = '';
    svgDiv.innerHTML = "";
    return;
}

function desenvolvimento(esp, dext, angulo) {
    outWarn.innerHTML = '';
    const avisoSobreMetal = '<br>Obs.: Verifique necessidade<br>de sobremetal'

    diamIntIn.value = ((dext - 2 * esp)).toFixed(2);
    let desenv = (dext - esp) * Math.PI * angulo / 360;
    desenvOut.innerHTML = 'Desenvolvimento: ' + desenv.toFixed(1) + ' mm<br>';
    desenvOut.innerHTML += avisoSobreMetal
    if (!check_input(comprimentoIn.value)) {return;}
    let compr = parseFloat(convert_comma_input(comprimentoIn.value));
    let peso = esp * 7.9 * desenv * compr / 1e6;
    desenvOut.innerHTML = 'Desenvolvimento: <br>' + esp.toFixed(1) + ' x ' + desenv.toFixed(1) + ' x ' + compr.toFixed(1) + ' mm';
    desenvOut.innerHTML += avisoSobreMetal
    pesoOut.innerHTML = 'Peso ' + peso.toFixed(2) + ' kg';
    return;
}
