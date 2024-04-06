anguloIn.value = '360';

function convert_comma_input(text_input) {
    input = text_input.replace(/,/g,'.');
    return input;
}

function check_input(text_input) {
    test_in = convert_comma_input(text_input);
    validPattern = /^[0-9.]+$/;
    var dots = test_in.match(/\./g);
    if (dots && dots.length > 1) {return false;}
    if (test_in == '.') {return false;}
    if (validPattern.test(test_in)) {return true;}
    return false;
}

function reset_input(){
    espessuraIn.value = '';
    diamExtIn.value = '';
    diamIntIn.value = '';
    comprimentoIn.value = '';
    anguloIn.value = '360';
    anchors = ['', '']; 
    return;
}

espessuraIn.addEventListener('input', (event) => {
    reset_output();
    if (anchors[1] != 'esp') {
        anchors.shift();
        anchors.push('esp');
    }
    if (!check_input(event.target.value) && event.target.value != '') {return;}
    if (!check_input(diamExtIn.value) && !check_input(diamIntIn.value)) {return;}
    if (anchors[0] == 'dex' && check_input(diamExtIn.value)) {
        if (event.target.value == '') {
            diamIntIn.value = '';
            return;
        }
        dex = parseFloat(convert_comma_input(diamExtIn.value));
        esp = parseFloat(convert_comma_input(event.target.value));
        diamIntIn.value = (dex - 2 * esp).toFixed(2);
    }
    if (anchors[0] == 'dex' && diamExtIn.value == '') {
        diamIntIn.value = '';
        return;
    }
    if (anchors[0] == 'din' && check_input(diamIntIn.value)) {
        if (event.target.value == '') {
            diamExtIn.value = '';
            return;
        }
        din = parseFloat(convert_comma_input(diamIntIn.value));
        esp = parseFloat(convert_comma_input(event.target.value));
        diamExtIn.value = (din + 2 * esp).toFixed(2);
    }
    if (anchors[0] == 'din' && diamIntIn.value == '') {
        diamExtIn.value = '';
        return;
    }
    return;
});

diamExtIn.addEventListener('input', (event) => {
    reset_output();
    if (anchors[1] != 'dex') {
        anchors.shift();
        anchors.push('dex');
    }
    if (!check_input(event.target.value) && event.target.value != '') {return;}
    if (!check_input(espessuraIn.value) && !check_input(diamIntIn.value)) {return;}
    if (anchors[0] == 'esp' && check_input(espessuraIn.value)) {
        if (event.target.value == '') {
            diamIntIn.value = '';
            return;
        }
        dex = parseFloat(convert_comma_input(event.target.value));
        esp = parseFloat(convert_comma_input(espessuraIn.value));
        diamIntIn.value = (dex - 2 * esp).toFixed(2);
    }
    if (anchors[0] == 'esp' && espessuraIn.value == '') {
        diamIntIn.value = '';
        return;
    }
    if (anchors[0] == 'din' && check_input(diamIntIn.value)) {
        if (event.target.value == '') {
            espessuraIn.value = '';
            return;
        }
        din = parseFloat(convert_comma_input(diamIntIn.value));
        dex = parseFloat(convert_comma_input(event.target.value));
        espessuraIn.value = ((dex - din) / 2).toFixed(2);
    }
    if (anchors[0] == 'din' && diamIntIn.value == '') {
        espessuraIn.value = '';
        return;
    }
    return;
});

diamIntIn.addEventListener('input', (event) => {
    reset_output();
    if (anchors[1] != 'din') {
        anchors.shift();
        anchors.push('din');
    }
    if (!check_input(event.target.value) && event.target.value != '') {return;}
    if (!check_input(espessuraIn.value) && !check_input(diamExtIn.value)) {return;}
    if (anchors[0] == 'esp' && check_input(espessuraIn.value)) {
        if (event.target.value == '') {
            diamExtIn.value = '';
            return;
        }
        din = parseFloat(convert_comma_input(event.target.value));
        esp = parseFloat(convert_comma_input(espessuraIn.value));
        diamExtIn.value = (din + 2 * esp).toFixed(2);
    }
    if (anchors[0] == 'esp' && espessuraIn.value == '') {
        diamExtIn.value = '';
        return;
    }
    if (anchors[0] == 'dex' && check_input(diamExtIn.value)) {
        if (event.target.value == '') {
            espessuraIn.value = '';
            return;
        }
        din = parseFloat(convert_comma_input(event.target.value));
        dex = parseFloat(convert_comma_input(diamExtIn.value));
        espessuraIn.value = ((dex - din) / 2).toFixed(2);
    }
    if (anchors[0] == 'dex' && diamExtIn.value == '') {
        espessuraIn.value = '';
        return;
    }
    return;
});

comprimentoIn.addEventListener('input', () => {
    pesoOut.innerHTML = '';
});

anguloIn.addEventListener('input', () => {
    reset_output();
});

botaoCalc.addEventListener('click', () => {
    reset_output();
    outWarn.innerHTML = 'Dados Inválidos';
    if (!check_input(espessuraIn.value)) {return;}
    if (!check_input(diamExtIn.value)) {return;}
    if (!check_input(diamIntIn.value)) {return;}
    if (!check_input(anguloIn.value)) {return;}
    if (!check_input(comprimentoIn.value) && comprimentoIn.value != '') {return;}
    let esp = parseFloat(convert_comma_input(espessuraIn.value));
    let dext = parseFloat(convert_comma_input(diamExtIn.value));
    let angulo = parseFloat(convert_comma_input(anguloIn.value));
    if (angulo > 360 || angulo <= 0) {return;}
    desenvolvimento(esp, dext, angulo);
    draw(esp, dext, angulo);
    return;
});

botaoReset.addEventListener('click', () => {
    reset_input();
    reset_output();
    return;
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        botaoCalc.click();
    }
});

