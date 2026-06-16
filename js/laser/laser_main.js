// INPUTS
const thicknessInput = document.getElementById('espessura');
const perimeterInput = document.getElementById('perimetro');
const pierceCountInput = document.getElementById('qtd_pierces');
const gasTypeSelect = document.getElementById('tipo_gas');
const pricePerTimeInput = document.getElementById('preco_tempo');
const deslocamentoInput = document.getElementById('desloc_livre');
const cuttingSpeedInput = document.getElementById('vel_corte');
const pierceTimeInput = document.getElementById('tempo_furo');
const custoGasInput = document.getElementById('custo_gas');
const calculateBtn = document.getElementById('calcular');
const resetBtn = document.getElementById('reset');

// OUTPUTS
const messageContainer = document.getElementById('output_warn');
const cuttingTimeOutput = document.getElementById('cuttingTimeOutput');
const priceOutput = document.getElementById('priceOutput');
const cuttingSpeedOutput = document.getElementById('cuttingSpeedOutput');
const pierceTimeOutput = document.getElementById('pierceTimeOutput');

// PARAMETERS
const cuttingSpeedDataO2 = {
    // speed: mm/min, pierce: sec
    1:    { speed: 3400, pierce: 0.6 }, 1.5:  { speed: 3400, pierce: 0.6 },
    2:    { speed: 3400, pierce: 0.6 }, 3:    { speed: 3300, pierce: 0.6 },
    4.75: { speed: 3200, pierce: 0.6 }, 6.3:  { speed: 2400, pierce: 0.6 },
    6.35: { speed: 2400, pierce: 0.8 }, 8:    { speed: 2300, pierce: 4 },
    9.5:  { speed: 2000, pierce: 1.5 }, 12.5: { speed: 1500, pierce: 2 },
    12.7: { speed: 1500, pierce: 3 }, 16:   { speed: 1000, pierce: 5 },
    19:   { speed: 580,  pierce: 12 }, 22:   { speed: 450,  pierce: 12 },
    22.2: { speed: 480,  pierce: 15 }, 22.4: { speed: 480,  pierce: 15 },
    25:   { speed: 410,  pierce: 18 }, 25.4: { speed: 410,  pierce: 18 }
};
const cuttingSpeedDataAir = {
    1:    { speed: 17000, pierce: 0.3 }, 1.5:  { speed: 17000, pierce: 0.3 },
    2:    { speed: 17000, pierce: 0.3 }, 3:    { speed: 17000, pierce: 0.4 },
    4.75: { speed: 7000, pierce: 0.5 }, 6.3:  { speed: 3600, pierce: 0.5 },
};
const cuttingSpeedDataN2 = {
    1:    { speed: 17000, pierce: 0.3 }, 1.5:  { speed: 17000, pierce: 0.3 },
    2:    { speed: 17000, pierce: 0.3 }, 3:    { speed: 13000, pierce: 0.4 },
    4.75: { speed: 7000, pierce: 0.5 }, 6.3:  { speed: 3600, pierce: 0.5 },
};

const defaultDisplacementSpeed = 20000; // mm/min for free movement (without cutting)

function resetOutput() {
    messageContainer.innerHTML = '';
    cuttingTimeOutput.innerHTML = '';
    priceOutput.innerHTML = '';
    cuttingSpeedOutput.innerHTML = '';
    pierceTimeOutput.innerHTML = '';
    return;
}

// Data Lookup Functions
function getSpeedFromDataSet(thickness, dataSet) {
    const exactData = dataSet[thickness];
    if (exactData) return exactData.speed;
    const thicknesses = Object.keys(dataSet).map(Number).sort((a, b) => a - b);
    if (thickness > thicknesses[thicknesses.length - 1]) return null;
    for (const t of thicknesses) {
        if (t > thickness) return dataSet[t].speed;
    }
    return null;
}

function getPierceTimeFromDataSet(thickness, dataSet) {
    const exactData = dataSet[thickness];
    if (exactData) return exactData.pierce;
    const thicknesses = Object.keys(dataSet).map(Number).sort((a, b) => a - b);
    if (thickness > thicknesses[thicknesses.length - 1]) return null;
    for (const t of thicknesses) {
        if (t > thickness) return dataSet[t].pierce;
    }
    return null;
}

// --- Main Calculation Function ---
function calculateOutput(perimeter, speed, hourPrice, gasType, pierceCount, pierceTime, custoGas) {
    const totalTimeMinutes = perimeter / speed + (pierceCount * pierceTime) / 60 + (deslocamentoInput.value ? (parseFloat(deslocamentoInput.value) / defaultDisplacementSpeed) : 0);

    cuttingTimeOutput.innerHTML = `Tempo tot.: ${totalTimeMinutes.toFixed(2)} min`;
    if (totalTimeMinutes < 1) {
        cuttingTimeOutput.innerHTML = `Tempo tot.: ${totalTimeMinutes.toFixed(2)} min (${(totalTimeMinutes * 60).toFixed(2)} s)`;
    }

    cuttingSpeedOutput.innerHTML = `Vel. corte: ${speed.toFixed(2)} mm/min (${gasType})`;
    pierceTimeOutput.innerHTML = `Tempo por furo: ${(pierceTime).toFixed(2)} sec`;
    let gasCostMinute = 0;
    if (!isNaN(custoGas) && custoGas > 0) {
        const vazaoGas = 1/8; // m³/min, this is a placeholder. In a real application, this should be calculated based on cutting parameters and gas type.
        gasCostMinute = (vazaoGas * totalTimeMinutes) * custoGas; // Total gas cost = consumption rate * time * cost per unit
    }
    if (isNaN(hourPrice) || hourPrice < 0) {
        messageContainer.innerHTML = 'Preço por hora inválido. Cálculo de preço ignorado.';
        priceOutput.innerHTML = `Preço estimado: --`;
    } else {
        const estimatedPrice = (totalTimeMinutes + gasCostMinute) * hourPrice / 60;
        priceOutput.innerHTML = `Preço estimado: $${estimatedPrice.toFixed(2)}`;
    }
    return;
}

calculateBtn.addEventListener('click', () => {
    resetOutput();

    const perimeter = parseFloat(perimeterInput.value);
    const pierceCount = parseInt(pierceCountInput.value, 10);
    const thickness = parseFloat(thicknessInput.value);
    const selectedGasType = gasTypeSelect.value;
    const userCuttingSpeed = parseFloat(cuttingSpeedInput.value);
    const userPierceTime = parseFloat(pierceTimeInput.value);
    const custoGas = parseFloat(custoGasInput.value);
    const pricePerTime = parseFloat(pricePerTimeInput.value);

    // --- Input Validation ---
    if (isNaN(thickness) || thickness <= 0) {
        messageContainer.innerHTML = 'Insira um número válido para a Espessura do Material.';
        return;
    }
    if (isNaN(perimeter) || perimeter <= 0) {
        messageContainer.innerHTML = 'Insira um número válido para o Perímetro Total de Corte.';
        return;
    }
    if (isNaN(pierceCount) || pierceCount < 0) {
        messageContainer.innerHTML = 'Insira um número válido para o Número de Perfurações.';
        return;
    }

    let finalCuttingSpeed;
    let finalPierceTime = 0;
    let utilizedGasType = selectedGasType;
    // let dataSetToUse = (selectedGasType === 'O2') ? cuttingSpeedDataO2 : cuttingSpeedDataAir;
    if (selectedGasType === 'O2') {
        dataSetToUse = cuttingSpeedDataO2;
    } else if (selectedGasType === 'Air') {
        dataSetToUse = cuttingSpeedDataAir;
    } else if (selectedGasType === 'N2') {
        dataSetToUse = cuttingSpeedDataN2;
    } else {
        messageContainer.innerHTML = 'Tipo de gás inválido.';
        return;
    }

    if (!isNaN(userCuttingSpeed) && userCuttingSpeed > 0) {
        finalCuttingSpeed = userCuttingSpeed;
        // messageContainer.innerHTML = 'Velocidade manual inserida.';
    } else {
        finalCuttingSpeed = getSpeedFromDataSet(thickness, dataSetToUse);
    }

    if (!isNaN(userPierceTime) && userPierceTime > 0) {
        finalPierceTime = userPierceTime;
        // messageContainer.innerHTML = 'Tempo de furo manual inserido.';
    } else {
        finalPierceTime = getPierceTimeFromDataSet(thickness, dataSetToUse);
    }

    if (!isNaN(custoGas) && custoGas > 0) {
        // Assuming a certain gas consumption rate (e.g., 0.1 m³/min for cutting, 0.05 m³/min for piercing)
        const gasConsumptionCutting = 0.1; // m³/min
    } else

    if (!finalCuttingSpeed && selectedGasType === 'Air') {
        dataSetToUse = cuttingSpeedDataO2;
        finalCuttingSpeed = getSpeedFromDataSet(thickness, dataSetToUse);
        finalPierceTime = getPierceTimeFromDataSet(thickness, dataSetToUse);
        if (finalCuttingSpeed) {
            utilizedGasType = 'O2';
            messageContainer.innerHTML = `- Sem dados para corte a ar em espessura ${thickness} mm. Considerando O2.<br>`;
        }
    }

    if (!finalPierceTime && selectedGasType === 'Air') {
        dataSetToUse = cuttingSpeedDataO2;
        finalPierceTime = getPierceTimeFromDataSet(thickness, dataSetToUse);
        if (finalPierceTime) {
            utilizedGasType = 'O2';
            messageContainer.innerHTML = ` - Sem dados para perfuração a ar em espessura ${thickness} mm. Considerando O2.<br>`;
        }
    }

    if (!finalPierceTime) {
        messageContainer.innerHTML = `Sem dados para ${thickness} mm com ${selectedGasType}.`;
        return;
    }

    if (!finalCuttingSpeed) {
        messageContainer.innerHTML = `Sem dados para ${thickness}mm com ${selectedGasType}.`;
        return;
    }
    
    const sortedThicknesses = Object.keys(dataSetToUse).map(Number).sort((a, b) => a - b);
    const closestThicknessMatch = sortedThicknesses.find(t => t >= thickness);

    // Show message only if the exact thickness was not found
    if (closestThicknessMatch !== undefined && thickness !== closestThicknessMatch) {
            messageContainer.innerHTML = messageContainer.innerHTML + `- Sem dados exatos para ${thickness} mm. Utilizando ${closestThicknessMatch} mm como estimativa.<br>`;
    }
    // }

    if (!finalCuttingSpeed || finalCuttingSpeed <= 0) {
        messageContainer.innerHTML = 'Não foi possível determinar vel. corte válida. Verifique dados inseridos.';
        return;
    }

    calculateOutput(perimeter, finalCuttingSpeed, pricePerTime, utilizedGasType, pierceCount, finalPierceTime, custoGas);
});

resetBtn.addEventListener('click', () => {
    perimeterInput.value = '';
    pierceCountInput.value = '';
    thicknessInput.value = '';
    gasTypeSelect.value = 'O2';
    deslocamentoInput.value = '';
    cuttingSpeedInput.value = '';
    pricePerTimeInput.value = '';
    pierceTimeInput.value = '';
    custoGasInput.value = '';
    resetOutput();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateBtn.click();
    }
});

const inputFields = [perimeterInput, pierceCountInput, thicknessInput, gasTypeSelect, cuttingSpeedInput, pricePerTimeInput, pierceTimeInput, custoGasInput, deslocamentoInput];
inputFields.forEach(input => {
    input.addEventListener('input', resetOutput);
});