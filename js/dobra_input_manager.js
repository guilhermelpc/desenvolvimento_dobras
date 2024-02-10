function convert_comma_input(text_input) {
    text_input = text_input.replace(/,/g,'.');
    return text_input;
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

function check_if_integer(text_input) {
    if (!check_input(text_input)) {
        return false;
    }
    var number = parseFloat(convert_comma_input(text_input));
    if (!isNaN(number) && Number.isInteger(number)){
        return true;
    }
    return false;
}

espessuraIn.addEventListener('input', (event) => {
    reset_output();
    return;
});

// Criando 'n' inputs quando a quantidade de lados é 'n', e avisando quando input é inválida:
qtdLadosIn.addEventListener('input', (event) => {
    reset_output();
    if (!check_if_integer(event.target.value)) {
        document.getElementById('lados_warning').innerHTML = '&nbsp;Valor inválido';
        if (event.target.value == '') {
            document.getElementById('lados_warning').innerHTML = '';
        }
        qtd_lados = 0;
        div_lados.innerHTML = '';
        return;
    }
    qtd_lados = parseInt(convert_comma_input(event.target.value))
    if (!(qtd_lados > 1 && qtd_lados < 7)) {
        document.getElementById('lados_warning').innerHTML = '&nbsp;Máximo: 6';
        if (qtd_lados <= 1) {document.getElementById('lados_warning').innerHTML = '&nbsp;Mínimo: 2';}
        qtd_lados = 0;
        div_lados.innerHTML = '';
        return;
    }
    div_lados.innerHTML = '';
    document.getElementById('lados_warning').innerHTML = '';
    for (var i = 1; i <= qtd_lados; i++) {
        var newDiv = document.createElement('div');

        div_lados.appendChild(newDiv);

        var newLabel = document.createElement('label');
        newLabel.innerHTML = 'Lado' + i + ' (mm):';
        newDiv.appendChild(newLabel);

        var newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = 'lado' + i;
        newDiv.appendChild(newInput);
    }
});

dropDown.addEventListener('change', (event) => {
    reset_output();
    return;
});

div_lados.addEventListener('input', function(event) {
    reset_output();
    return;
});

raioIn.addEventListener('input', (event) => {
    reset_output();
    return;
});

fatorKIn.addEventListener('input', (event) => {
    reset_output();
    return;
});

comprimentoIn.addEventListener('input', (event) => {
    pesoOut.innerHTML = '';
    return;
});

botaoCalc.addEventListener('click', (event) => {
    reset_output();
    outWarn.innerHTML = 'Dados Inválidos';
    if (!check_input(espessuraIn.value)) {outWarn.innerHTML = 'Dados Inválidos';return;}
    if (qtd_lados == 0) {return;}
    if (dropDown.value == 'blank') {return;}
    if (!check_input(raioIn.value)) {return;}
    for (var i = 1; i <= qtd_lados; i++) {
        if (!check_input(document.getElementById('lado' + i).value)) {
            return;
        }
    }
    if (!check_input(fatorKIn.value) && fatorKIn.value != '') {return;}
    if (!check_input(comprimentoIn.value) && comprimentoIn.value != '') {return;}

    var espessura = parseFloat(convert_comma_input(espessuraIn.value));
    var raio = parseFloat(convert_comma_input(raioIn.value));
    var ladosList = []
    for (var i = 1; i <= qtd_lados; i++) {
        ladosList.push(parseFloat(convert_comma_input(document.getElementById('lado' + i).value)));
    }

    fk_recomendado = fator_k_recomendado(raio, espessura).toFixed(3);
    desenv = desenvolvimento(espessura, ladosList, dropDown.value, raio, fk_recomendado)
    internas_sum = soma_internas(espessura, ladosList, dropDown.value);
    fkOut.innerHTML = '&bull;Fator-K utilizado: ' + fk_recomendado;

    if (check_input(fatorKIn.value)) {
        var fK = parseFloat(convert_comma_input(fatorKIn.value));
        desenv = desenvolvimento(espessura, ladosList, dropDown.value, raio, fK);
        fkOut.innerHTML = '&bull;Fator-K recomendado: ' + fk_recomendado;
    }

    if (check_input(comprimentoIn.value)) {
        var compr = parseFloat(convert_comma_input(comprimentoIn.value));
        peso = espessura * 7.9 * desenv * compr / 1e6;
        pesoOut.innerHTML = '&bull;Peso: ' + peso.toFixed(2) + ' kg'
    }
    outWarn.innerHTML = '';
    calc_min_side(espessura, ladosList, dropDown.value);
    colisao(espessura, ladosList, dropDown.value); // EM CONSTRUCAO
    desenvOut.innerHTML = '&bull;Desenv. teórico: ' + desenv.toFixed(1) + ' mm';
    somaOut.innerHTML = '&bull;Soma medidas internas: ' + internas_sum.toFixed(1) + ' mm';
});

botaoReset.addEventListener('click', (event) => {
    espessuraIn.value = '';
    qtdLadosIn.value = '';
    qtd_lados = 0;
    dropDown.value = 'default';
    div_lados.innerHTML = '';
    raioIn.value = '';
    fatorKIn.value = '';
    comprimentoIn.value = '';

    reset_output();
    return;
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        botaoCalc.click();
    }
});