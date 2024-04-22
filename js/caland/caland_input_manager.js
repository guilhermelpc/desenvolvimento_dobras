const espessuraIn = document.getElementById('espessura');
const diamExtIn = document.getElementById('diam_ext');
const diamIntIn = document.getElementById('diam_int');
const comprimentoIn = document.getElementById('comprimento');
const anguloIn = document.getElementById('angulo');
const aberturaExtIn = document.getElementById('abertura_ext');
const botaoInverter = document.getElementById('inverter');
const checkBoxIn = document.getElementById('cbc_paper');
const botaoCalc = document.getElementById('calcular');
const botaoReset = document.getElementById('reset');
var anchorsGlobal = ['', ''];
var invertedGlobal = false;

anguloIn.value = '360';
aberturaExtIn.value = '0';

function convertCommaInput(text_input) {
    input = text_input.replace(/,/g,'.');
    return input;
}

function checkInput(text_input) {
    test_in = convertCommaInput(text_input);
    validPattern = /^[0-9.]+$/;
    var dots = test_in.match(/\./g);
    if (dots && dots.length > 1) {return false;}
    if (test_in == '.') {return false;}
    if (validPattern.test(test_in)) {return true;}
    return false;
}

function areAllInputsOk() {
    if (!checkInput(espessuraIn.value)) {return false;}
    if (!checkInput(diamExtIn.value)) {return false;}
    if (!checkInput(diamIntIn.value)) {return false;}
    if (!checkInput(anguloIn.value)) {return false;}
    if (!checkInput(aberturaExtIn.value)) {return false;}
    if (!checkInput(comprimentoIn.value) && comprimentoIn.value != '') {return false;}
    let abertura = parseFloat(convertCommaInput(aberturaExtIn.value));
    if (abertura > parseFloat(convertCommaInput(diamExtIn.value)) || abertura < 0) {return false;}
    let angulo = parseFloat(convertCommaInput(anguloIn.value));
    if (angulo > 360 || angulo <= 0) {return false;}
    outWarn.innerHTML = '';
    return true;
}

function resetInput(){
    espessuraIn.value = '';
    diamExtIn.value = '';
    diamIntIn.value = '';
    comprimentoIn.value = '';
    anguloIn.value = '360';
    aberturaExtIn.value = '0';
    invertedGlobal = false;
    anchorsGlobal = ['', '']; 
    return;
}

function setAngulo(){
    if (checkInput(aberturaExtIn.value) && checkInput(diamExtIn.value)) {
        let abertura = parseFloat(convertCommaInput(aberturaExtIn.value));
        if (invertedGlobal) {
            let angulo = 360 - 360 * Math.acos(abertura / (parseFloat(convertCommaInput(diamExtIn.value)))) / Math.PI - 180;
            anguloIn.value = angulo.toFixed(2);
            return;
        } else {
            let angulo = 360 * Math.acos(abertura / (parseFloat(convertCommaInput(diamExtIn.value)))) / Math.PI + 180;
            anguloIn.value = angulo.toFixed(2);
            return;
        }
    }
    if (aberturaExtIn.value == '' && anguloIn.value != "360") {
        anguloIn.value = 360;
        return;
    }
}

function setAbertura(){
    if (checkInput(anguloIn.value) && checkInput(diamExtIn.value)) {
        let angulo = parseFloat(convertCommaInput(anguloIn.value));
        let abertura = Math.cos(Math.PI * ( -1 + (angulo/180)) / 2) * parseFloat(convertCommaInput(diamExtIn.value));
        aberturaExtIn.value = abertura.toFixed(2);
    }
    return;
}

espessuraIn.addEventListener('input', (event) => {
    resetOutput();
    if (anchorsGlobal[1] != 'esp') { // if anchorsGlobal = ['any','any_except_esp']
        anchorsGlobal.shift(); // anchorsGlobal = ['any_except_esp']
        anchorsGlobal.push('esp'); // anchorsGlobal = ['any_except_esp','esp']
    }
    if (!checkInput(event.target.value) && event.target.value != '') {return;}
    if (!checkInput(diamExtIn.value) && !checkInput(diamIntIn.value)) {return;}
    if (anchorsGlobal[0] == 'dex' && checkInput(diamExtIn.value)) { // if anchorsGlobal = ['dex', 'esp'] && dex_input_ok
        if (event.target.value == '') {
            diamIntIn.value = '';
            return;
        }
        dex = parseFloat(convertCommaInput(diamExtIn.value));
        esp = parseFloat(convertCommaInput(event.target.value));
        diamIntIn.value = (dex - 2 * esp).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'dex' && diamExtIn.value == '') { // if anchorsGlobal = ['dex','']
        diamIntIn.value = '';
        return;
    }
    if (anchorsGlobal[0] == 'din' && checkInput(diamIntIn.value)) {
        if (event.target.value == '') {
            diamExtIn.value = '';
            return;
        }
        din = parseFloat(convertCommaInput(diamIntIn.value));
        esp = parseFloat(convertCommaInput(event.target.value));
        diamExtIn.value = (din + 2 * esp).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'din' && diamIntIn.value == '') {
        diamExtIn.value = '';
        return;
    }
    return;
});

diamExtIn.addEventListener('input', (event) => {
    resetOutput();
    if (anchorsGlobal[1] != 'dex') {
        anchorsGlobal.shift();
        anchorsGlobal.push('dex');
    }
    if (!checkInput(event.target.value) && event.target.value != '') {return;}
    if (!checkInput(espessuraIn.value) && !checkInput(diamIntIn.value)) {return;}
    if (anchorsGlobal[0] == 'esp' && checkInput(espessuraIn.value)) {
        if (event.target.value == '') {
            diamIntIn.value = '';
            return;
        }
        dex = parseFloat(convertCommaInput(event.target.value));
        esp = parseFloat(convertCommaInput(espessuraIn.value));
        diamIntIn.value = (dex - 2 * esp).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'esp' && espessuraIn.value == '') {
        diamIntIn.value = '';
        return;
    }
    if (anchorsGlobal[0] == 'din' && checkInput(diamIntIn.value)) {
        if (event.target.value == '') {
            espessuraIn.value = '';
            return;
        }
        din = parseFloat(convertCommaInput(diamIntIn.value));
        dex = parseFloat(convertCommaInput(event.target.value));
        espessuraIn.value = ((dex - din) / 2).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'din' && diamIntIn.value == '') {
        espessuraIn.value = '';
        return;
    }
    return;
});

diamIntIn.addEventListener('input', (event) => {
    resetOutput();
    if (anchorsGlobal[1] != 'din') {
        anchorsGlobal.shift();
        anchorsGlobal.push('din');
    }
    if (!checkInput(event.target.value) && event.target.value != '') {return;}
    if (!checkInput(espessuraIn.value) && !checkInput(diamExtIn.value)) {return;}
    if (anchorsGlobal[0] == 'esp' && checkInput(espessuraIn.value)) {
        if (event.target.value == '') {
            diamExtIn.value = '';
            return;
        }
        din = parseFloat(convertCommaInput(event.target.value));
        esp = parseFloat(convertCommaInput(espessuraIn.value));
        diamExtIn.value = (din + 2 * esp).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'esp' && espessuraIn.value == '') {
        diamExtIn.value = '';
        return;
    }
    if (anchorsGlobal[0] == 'dex' && checkInput(diamExtIn.value)) {
        if (event.target.value == '') {
            espessuraIn.value = '';
            return;
        }
        din = parseFloat(convertCommaInput(event.target.value));
        dex = parseFloat(convertCommaInput(diamExtIn.value));
        espessuraIn.value = ((dex - din) / 2).toFixed(2);
        setAngulo();
    }
    if (anchorsGlobal[0] == 'dex' && diamExtIn.value == '') {
        espessuraIn.value = '';
        return;
    }
    return;
});

comprimentoIn.addEventListener('input', () => {
    if (renderedGlobal === true) {
        botaoCalc.click();
    }
});

anguloIn.addEventListener('input', () => {
    setAbertura();
    if (renderedGlobal === true) {
        botaoCalc.click();
    }
    if (renderedGlobal === false && areAllInputsOk()) {
        outWarn.innerHTML = '';
    }
});

aberturaExtIn.addEventListener('input', () => {
    setAngulo();
    if (renderedGlobal === true) {
        botaoCalc.click();
    }
    if (renderedGlobal === false && areAllInputsOk()) {
        outWarn.innerHTML = '';
    }
});

botaoInverter.addEventListener('click', () => {
    invertedGlobal = !invertedGlobal;
    setAngulo();
    if (renderedGlobal === true) {
        botaoCalc.click();
    }
});

checkBoxIn.addEventListener('change', function() {
    if (renderedGlobal) {
        botaoCalc.click();
    }
});

botaoCalc.addEventListener('click', () => {
    resetOutput();
    outWarn.innerHTML = 'Dados Inválidos';
    if (!areAllInputsOk()) {return;}
    let esp = parseFloat(convertCommaInput(espessuraIn.value));
    let dext = parseFloat(convertCommaInput(diamExtIn.value));
    let angulo = parseFloat(convertCommaInput(anguloIn.value));
    let compr = null;

    if (checkInput(comprimentoIn.value) && comprimentoIn.value != '') {
        compr = parseFloat(convertCommaInput(comprimentoIn.value));
        if (compr == 0) {compr = null}
    }

    printDesenv(esp, dext, angulo);
    svgCont = new svgContent(esp, dext, angulo, compr);
    svgCont.render();
    renderedGlobal = true;
    return;
});

botaoReset.addEventListener('click', () => {
    resetInput();
    resetOutput();
    return;
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        botaoCalc.click();
    }
});

drawingDiv.addEventListener("click", (event) => {
    const svgRect = drawingDiv.getBoundingClientRect();
    const x = event.offsetX / svgRect.width * 210;
    const y = event.offsetY / svgRect.height * 297;
    console.log(x, y);
    
    
});