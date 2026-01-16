// INPUTS
const thicknessInput = document.getElementById('espessura');
const perimeterInput = document.getElementById('perimetro');
const pierceCountInput = document.getElementById('qtd_pierces');
const gasTypeSelect = document.getElementById('tipo_gas');
const pricePerTimeInput = document.getElementById('preco_tempo');
const cuttingSpeedInput = document.getElementById('vel_corte');
const calculateBtn = document.getElementById('calcular');
const resetBtn = document.getElementById('reset');

// OUTPUTS
const messageContainer = document.getElementById('output_warn');
const cuttingTimeOutput = document.getElementById('cuttingTimeOutput');
const priceOutput = document.getElementById('priceOutput');
const cuttingSpeedOutput = document.getElementById('cuttingSpeedOutput');

// PARAMETERS
const cuttingSpeedDataO2 = {
    // speed: mm/min, pierce: sec
    1:    { speed: 3400, pierce: 0.6 }, 1.5:  { speed: 3400, pierce: 0.6 },
    2:    { speed: 3400, pierce: 0.6 }, 3:    { speed: 3300, pierce: 0.6 },
    4.75: { speed: 3200, pierce: 0.6 }, 6.3:  { speed: 2400, pierce: 0.6 },
    6.35: { speed: 2400, pierce: 0.6 }, 8:    { speed: 2300, pierce: 0.8 },
    9.5:  { speed: 2000, pierce: 1 }, 12.5: { speed: 1500, pierce: 2 },
    12.7: { speed: 1500, pierce: 3 }, 16:   { speed: 1000, pierce: 5 },
    19:   { speed: 580,  pierce: 12 }, 22:   { speed: 450,  pierce: 12 },
    22.2: { speed: 480,  pierce: 15 }, 22.4: { speed: 480,  pierce: 15 },
    25:   { speed: 410,  pierce: 18 }, 25.4: { speed: 410,  pierce: 18 }
};
const cuttingSpeedDataAir = {
    1:    { speed: 17000, pierce: 0.3 }, 1.5:  { speed: 17000, pierce: 0.3 },
    2:    { speed: 17000, pierce: 0.3 }, 3:    { speed: 17000, pierce: 0.3 },
    4.75: { speed: 11000, pierce: 0.5 },
};

function resetOutput() {
    messageContainer.innerHTML = '';
    cuttingTimeOutput.innerHTML = '';
    priceOutput.innerHTML = '';
    cuttingSpeedOutput.innerHTML = '';
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
function calculateOutput(perimeter, speed, timePrice, gasType, pierceCount, pierceTime) {
    const cuttingTimeMinutes = perimeter / speed;
    const totalPierceTimeMinutes = (pierceCount * pierceTime) / 60;
    const totalTimeMinutes = cuttingTimeMinutes + totalPierceTimeMinutes;

    cuttingTimeOutput.innerHTML = `Tempo tot.: ${totalTimeMinutes.toFixed(2)} min`;
    cuttingSpeedOutput.innerHTML = `Vel. corte: ${speed.toFixed(2)} mm/min (${gasType})`;
    
    if (isNaN(timePrice) || timePrice < 0) {
        messageContainer.innerHTML = 'Preço por hora inválido. Cálculo de preço ignorado.';
        priceOutput.innerHTML = `Preço estimado: --`;
    } else {
        const estimatedPrice = totalTimeMinutes * timePrice / 60;
        priceOutput.innerHTML = `Preço estimado: $${estimatedPrice.toFixed(2)}`;
    }
    return;
}
// Teste:
// calculateOutput(perimeter = 100, speed = 3400, timePrice = 500, gasType = 'O2', pierceCount = 5, pierceTime = 0.6);

calculateBtn.addEventListener('click', () => {
    resetOutput();

    const perimeter = parseFloat(perimeterInput.value);
    const pierceCount = parseInt(pierceCountInput.value, 10);
    const thickness = parseFloat(thicknessInput.value);
    const selectedGasType = gasTypeSelect.value;
    const userCuttingSpeed = parseFloat(cuttingSpeedInput.value);
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
    let dataSetToUse = (selectedGasType === 'O2') ? cuttingSpeedDataO2 : cuttingSpeedDataAir;

    if (!isNaN(userCuttingSpeed) && userCuttingSpeed > 0) {
        finalCuttingSpeed = userCuttingSpeed;
        // messageContainer.innerHTML = 'Velocidade manual inserida.';
    } else {
        finalCuttingSpeed = getSpeedFromDataSet(thickness, dataSetToUse);
    }

    finalPierceTime = getPierceTimeFromDataSet(thickness, dataSetToUse);

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
        messageContainer.innerHTML = `Sem dados de perfuração para ${thickness} mm com ${selectedGasType}.`;
        return;
    }

    if (!finalCuttingSpeed) {
        messageContainer.innerHTML = `Sem dados de corte para ${thickness}mm com ${selectedGasType}.`;
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

    calculateOutput(perimeter, finalCuttingSpeed, pricePerTime, utilizedGasType, pierceCount, finalPierceTime);
});

resetBtn.addEventListener('click', () => {
    perimeterInput.value = '';
    pierceCountInput.value = '';
    thicknessInput.value = '';
    gasTypeSelect.value = 'O2';
    cuttingSpeedInput.value = '';
    pricePerTimeInput.value = '';
    resetOutput();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateBtn.click();
    }
});

const inputFields = [perimeterInput, pierceCountInput, thicknessInput, gasTypeSelect, cuttingSpeedInput, pricePerTimeInput];
inputFields.forEach(input => {
    input.addEventListener('input', resetOutput);
});