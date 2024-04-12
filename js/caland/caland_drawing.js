class arcOutLine {
    constructor(dext, esp, angulo, cY, cX, parentElement, scale, color="black", strokeWidth="0.3") {
        this.dext = dext;
        this.rExtPaperScale = this.dext * scale / 2; // Define a escala do desenho = 95 / raio_externo [px / mm]
        this.esp = esp;
        this.angulo = angulo;
        this.cY = cY;
        this.cX = cX;
        this.parentElement = parentElement;
        this.color = color;
        this.strokeWidth = strokeWidth;
        // this.arcElement = ;

        this.createArc();
    }

    createArc() {
        let rIntPaperScale = this.rExtPaperScale * ((this.dext/2 - this.esp)/(this.dext/2));
        // Ext. Arc:
        let bigger = (this.angulo<180) ? 0 : 1;
        let angAbertura = 2 * Math.PI - this.angulo * Math.PI / 180 + 1e-5;
        let angPonto = (Math.PI - angAbertura) / 2;
        let startY = this.cY - this.rExtPaperScale * Math.sin(angPonto);
        let startX = this.cX + this.rExtPaperScale * Math.cos(angPonto);
        let endX = this.cX - this.rExtPaperScale * Math.cos(angPonto);
        createSvgElement('path', {
            d: `M ${startX} ${startY} A ${this.rExtPaperScale} ${this.rExtPaperScale} 0 ${bigger} 1 ${endX} ${startY}`,
            stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
        }, this.parentElement);
        // Int. Arc:
        let startYIn = this.cY - rIntPaperScale * Math.sin(angPonto);
        let startXIn = this.cX + rIntPaperScale * Math.cos(angPonto);
        let endXIn = this.cX - rIntPaperScale * Math.cos(angPonto);
        createSvgElement('path', {
            d: `M ${startXIn} ${startYIn} A ${rIntPaperScale} ${rIntPaperScale} 0 ${bigger} 1 ${endXIn} ${startYIn}`,
            stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
        }, this.parentElement);
        // Linhas fechamento arco:
        const linesCoord = [
            [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
            [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
        ];
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": this.strokeWidth
            }, this.parentElement);
        }
    }

    createCenterMark() {

    }

    createDimLines() {
        // Linhas:
        const linesCoord = [
            [cX - 0.32 * rIntPaperScale, cY, cX + 0.32 * rIntPaperScale, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.32 * rIntPaperScale, cX, cY + 0.32 * rIntPaperScale, "grey"], // linha centro vertical
        ];
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": stdLineWidth
            }, svgElement);
        }
    }
}

draw(6.3, 400, 270);

function draw(esp, dext, angulo) {
    drawingDiv.innerHTML = "";

    const folhaWidth = 210
    const folhaHeight = 297
    let aspectRatio = folhaHeight / folhaWidth;

    // Svg URL:
    const svgContent = createSvgContent(esp, dext, angulo, folhaWidth, folhaHeight);
    const dataUrl = svgToDataURL(svgContent);
    // Insert img in div
    const imgElement = document.createElement("img");
    imgElement.setAttribute("width", window.innerWidth / 2);
    imgElement.setAttribute("height", aspectRatio * window.innerWidth / 2);
    imgElement.src = dataUrl;
    document.getElementById("drawing").appendChild(imgElement);
}

function createSvgContent(esp, dext, angulo, folhaWidth, folhaHeight) {
    const viewBox = `0 0 ${folhaWidth} ${folhaHeight}`

    let scaleMmMm = 63.3 / dext
    let rExtPaperScale = dext * scaleMmMm / 2; // Define a escala do desenho = 95 / raio_externo [px / mm]
    let rIntPaperScale = rExtPaperScale * ((dext/2 - esp)/(dext/2));
  
    // Posição vista 1:
    let cX = 63.5;
    let cY = 80;

    // SVG Std Styles:
    let stdLineWidth = 0.3;
    let stdTextHeight = 4.5;
    const arrowSize = 1.15 * stdTextHeight;
    // SVG Element:
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defsElement = svgElement.querySelector('defs') || createSvgElement('defs', {}, svgElement);
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", viewBox);
    svgElement.setAttribute("width", folhaWidth * 4);
    svgElement.setAttribute("height", folhaHeight * 4);
    // SVG Style Element:
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = `text {font-family:Courier, monospace;}`;
    svgElement.appendChild(styleElement);
    // SVG Brackground:
    createSvgElement("rect", {width: folhaWidth, height: folhaHeight, fill: "white"}, svgElement);
    // Std. Arrow marker:
    const arrowPathRight = `M 0 0 L 0 ${arrowSize/3} L ${arrowSize} ${arrowSize/6} Z`;
    const markerRight = createSvgElement("marker", 
        {id: "arrowheadright", markerWidth:arrowSize,markerHeight:arrowSize,refX:arrowSize,refY:arrowSize/6,
        markerUnits: "userSpaceOnUse", orient: "auto"}, defsElement);
    createSvgElement("path", {"d": arrowPathRight,"fill": "grey","stroke-width": stdLineWidth}, markerRight);

    // Top text
    const textTop = createSvgElement("text", {x: 22, y: 22, 'font-size': stdTextHeight}, svgElement)
    textTop.textContent = "Dimensões em milímetros"

    // PARÂMETROS drawArcOutline(dext, esp, angulo, cY, cX, parentElement, scale, color="black", strokeWidth="0.3");
    let arc1 = new arcOutLine(dext, esp, angulo, cY, cX, svgElement, scaleMmMm, "black", stdLineWidth);

    let angAbertura = 2 * Math.PI - angulo * Math.PI / 180 + 1e-5;
    let angPonto = (Math.PI - angAbertura) / 2;
    let startY = cY - rExtPaperScale * Math.sin(angPonto);
    let startX = cX + rExtPaperScale * Math.cos(angPonto);
    let endX = cX - rExtPaperScale * Math.cos(angPonto);
    let startYIn = cY - rIntPaperScale * Math.sin(angPonto);
    let startXIn = cX + rIntPaperScale * Math.cos(angPonto);
    let endXIn = cX - rIntPaperScale * Math.cos(angPonto);

    if (angulo >= 180) {
        arc1.createCenterMark();
        

        // Parameters: createDimLine(xyObj, distance, parentElement, textHeight, scale, text = "", align="aligned", color="grey", strokeWidth="0.3"):
        createDimLine({x1: (cX + rIntPaperScale), y1: cY, x2: (cX + rExtPaperScale), y2: cY}, 48, svgElement, stdTextHeight, scaleMmMm, text='', align="h"); // cota espessura
        createDimLine({x1: (cX + rExtPaperScale), y1: cY, x2: (cX - rExtPaperScale), y2:cY}, -60, svgElement, stdTextHeight, scaleMmMm, text='Ø ext ', align="h"); // cota dExt
        createDimLine({x1: (cX + rIntPaperScale), y1: cY, x2: (cX - rIntPaperScale), y2:cY}, -48, svgElement, stdTextHeight, scaleMmMm, text='Ø int ', align="h"); // cota dInt
        if (angulo != 360) {
            createDimLine({x1: startX, y1: startY, x2: endX, y2: startY}, 17, svgElement, stdTextHeight, scaleMmMm, text='', align="h"); // cota dExt
            createDimLine({x1: startXIn, y1: startYIn, x2: endXIn, y2: startYIn}, 10, svgElement, stdTextHeight, scaleMmMm, text='', align="h"); // cota dInt
        }
    }
    
    if (angulo < 180) {
        // Linhas:
        const linesCoord = [
            [cX - 0.1 * rIntPaperScale, cY, cX + 0.1 * rIntPaperScale, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.1 * rIntPaperScale, cX, cY + 0.1 * rIntPaperScale, "grey"], // linha centro vertical
        ];
        
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": stdLineWidth
            }, svgElement)
        }
        createDimLine({x1: startX, y1: startY, x2: endX, y2: startY}, -60, svgElement, stdTextHeight, scaleMmMm, text='', align="h"); // cota dExt
        createDimLine({x1: startXIn, y1: startYIn, x2: endXIn, y2: startYIn}, -48, svgElement, stdTextHeight, scaleMmMm, text='', align="h"); // cota dInt
    }

    // Text Comprimento:
    let compr = parseFloat(convertCommaInput(comprimentoIn.value));
    if (!isNaN(compr)){
        let TestComprCont = "Comprimento: " + parseFloat(convertCommaInput(comprimentoIn.value)) + " mm";
        const textComprimento = createSvgElement("text", 
            {y: `${cY + 201.5}`, x: `${cX - 4 * TestComprCont.length - 15}`, 'font-size': 16}, svgElement);
        textComprimento.textContent = TestComprCont;
    }

    return svgElement.outerHTML;
}



// function drawArcOutline(dext, esp, angulo, cY, cX, parentElement, scale, color="black", strokeWidth="0.3") {
//     let rExtPaperScale = dext * scale / 2; // Define a escala do desenho = 95 / raio_externo [px / mm]
//     let rIntPaperScale = rExtPaperScale * ((dext/2 - esp)/(dext/2));
//     // Ext. Arc:
//     let bigger = (angulo<180) ? 0 : 1;
//     let angAbertura = 2 * Math.PI - angulo * Math.PI / 180 + 1e-5;
//     let angPonto = (Math.PI - angAbertura) / 2;
//     let startY = cY - rExtPaperScale * Math.sin(angPonto);
//     let startX = cX + rExtPaperScale * Math.cos(angPonto);
//     let endX = cX - rExtPaperScale * Math.cos(angPonto);
//     createSvgElement('path', {
//         d: `M ${startX} ${startY} A ${rExtPaperScale} ${rExtPaperScale} 0 ${bigger} 1 ${endX} ${startY}`,
//         stroke: "black", fill: "transparent", 'stroke-width': strokeWidth
//     }, parentElement);
//     // Int. Arc:
//     let startYIn = cY - rIntPaperScale * Math.sin(angPonto);
//     let startXIn = cX + rIntPaperScale * Math.cos(angPonto);
//     let endXIn = cX - rIntPaperScale * Math.cos(angPonto);
//     createSvgElement('path', {
//         d: `M ${startXIn} ${startYIn} A ${rIntPaperScale} ${rIntPaperScale} 0 ${bigger} 1 ${endXIn} ${startYIn}`,
//         stroke: "black", fill: "transparent", 'stroke-width': strokeWidth
//     }, parentElement);
//     // Linhas fechamento arco:
//     const linesCoord = [
//         [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
//         [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
//     ];
//     for (const line of linesCoord) {
//         createSvgElement("line", {
//             x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": strokeWidth
//         }, parentElement);
//     }

//     return;
// }

function createDimLine(xyObj, distance, parentElement, textHeight, scale, text = "", align="aligned", color="grey", strokeWidth="0.3"){
    let digitLen = textHeight / 1.8;
    let offset = (distance < 0) ? -2 : 2;

    // Cotas horizontais:
    if (align === "horizontal" || align === "h") { 
        // Mudando a ordem das linhas para a primeira ficar na esquerda:
        if (xyObj.x1 > xyObj.x2) { [xyObj.x1, xyObj.x2] = [xyObj.x2, xyObj.x1]; }

        const cotaPaperScale = xyObj.x2 - xyObj.x1;
        let DimensionTxt = text + (cotaPaperScale / scale).toFixed(2);
        let textLen = ("" + text + DimensionTxt).length * digitLen;
        let refY = (xyObj.y1 >= xyObj.y2) ? xyObj.y1 : xyObj.y2;

        // Lines:
        const linesCoords = [ 
            [xyObj.x1, xyObj.y1 - offset, xyObj.x1, refY - distance],
            [xyObj.x2, xyObj.y2 - offset, xyObj.x2, refY - distance], 
            // [`${xyObj.x1 + 6}`, refY - distance, `${xyObj.x1 + 6 + textLen}`, refY - distance], // Teste largura do texto
        ];
        for (const line of linesCoords) {
            createSvgElement("line", {x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: color, "stroke-width": strokeWidth}, parentElement);
        }

        // Arrow Lines:
        if (cotaPaperScale < textLen + 3) { //
            let leftArrow = [xyObj.x1 - 10, refY - distance + offset, xyObj.x1, refY - distance + offset, "grey"];
            let rightArrow = [xyObj.x2 + 15, refY - distance + offset, xyObj.x2, refY - distance + offset, "grey"];
            const arrowLinesCoords = [ leftArrow,rightArrow, ];  
            for (const line of arrowLinesCoords) {
                createSvgElement("polyline", 
                    {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: color, "stroke-width": strokeWidth,
                     "marker-end": "url(#arrowheadright)"}, parentElement);
            }
            // Text 
            const textElem = createSvgElement("text", {x: `${xyObj.x2 + 5}`, y: refY - distance + offset - 2, 'font-size': textHeight}, parentElement);
            textElem.textContent = DimensionTxt;

        } else {
            let leftArrow = [xyObj.x2 - cotaPaperScale/2, refY - distance + offset, xyObj.x1, refY - distance + offset, "grey"];
            let rightArrow = [xyObj.x2 - cotaPaperScale/2, refY - distance + offset, xyObj.x2, refY - distance + offset, "grey"];
            const arrowLinesCoords = [ leftArrow,rightArrow, ];  
            for (const line of arrowLinesCoords) {
                createSvgElement("polyline", 
                    {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: color, "stroke-width": strokeWidth,
                     "marker-end": "url(#arrowheadright)"}, parentElement);
            }
            // Text 
            const textElem = createSvgElement("text", {x: `${xyObj.x2 - cotaPaperScale/2 - DimensionTxt.length*2.5/2}`, y: refY - distance + offset - 2, 'font-size': textHeight}, parentElement);
            textElem.textContent = DimensionTxt;
        }
    // Cotas verticais:
    } else if (align === "vertical" || align === "v") {

    // Cotas alinhadas: 
    } else {
        const angPointsRad = Math.atan2(xyObj.y2 - xyObj.y1, xyObj.x2 - xyObj.x1);
        const angCotaRad = angPointsRad + Math.PI / 2;
    }
    return;
}

function createSvgElement(elementName, attributes, parentElement, innerHTML = null) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elementName);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttributeNS(null, key, value);
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    }

    parentElement.appendChild(element);
    return element;
}

function svgToDataURL(svgContent) {
    const encoded = encodeURIComponent(svgContent)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/&/g, '%26')
        .replace(/#/g, '%23');

    const header = 'data:image/svg+xml;charset=utf-8,';
    return header + encoded;
}
