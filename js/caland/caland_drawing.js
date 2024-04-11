draw(6.3, 400, 340);

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
    // Posição peça:
    let cX = 63.5;
    let cY = 78.6;
    // Dim. peça:
    const rExtScaled = 63.3 / 2; // Define a escala do desenho = 95 / raio_externo [px / mm]
    const rIntScaled = rExtScaled * ((dext/2 - esp)/(dext/2));
    const arrowSize = 0.15 * rExtScaled;
    // SVG Std Styles:
    let stdLineWidth = 0.3
    let stdTextSize = 4
    let stdDigitLen = 2.4 * stdTextSize

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
    createSvgElement("rect", {width: folhaWidth, height: folhaHeight, fill: "white"}, svgElement)

    // Std. Arrow marker:
    const arrowPathRight = `M 0 0 L 0 ${arrowSize/3} L ${arrowSize} ${arrowSize/6} Z`;
    const markerRight = createSvgElement("marker", 
        {id: "arrowheadright", markerWidth:arrowSize,markerHeight:arrowSize,refX:arrowSize,refY:arrowSize/6,
        markerUnits: "userSpaceOnUse", orient: "auto"}, defsElement);
    createSvgElement("path", {"d": arrowPathRight,"fill": "grey","stroke-width": stdLineWidth}, markerRight);

    // Top text
    const textTop = createSvgElement("text", {x: 22, y: 22, 'font-size': stdTextSize}, svgElement)
    textTop.textContent = "Dimensões em milímetros"

    // Ext. Arc:
    let bigger = (angulo<180) ? 0 : 1;

    let angAbertura = 2 * Math.PI - angulo * Math.PI / 180 + 1e-5;
    let angPonto = (Math.PI - angAbertura) / 2;
    let startY = cY - rExtScaled * Math.sin(angPonto);
    let startX = cX + rExtScaled * Math.cos(angPonto);
    let endX = cX - rExtScaled * Math.cos(angPonto);
    createSvgElement('path', {
        d: `M ${startX} ${startY} A ${rExtScaled} ${rExtScaled} 0 ${bigger} 1 ${endX} ${startY}`,
        stroke: "black", fill: "transparent", 'stroke-width': stdLineWidth
    }, svgElement);

    // Int. Arc:
    let startYIn = cY - rIntScaled * Math.sin(angPonto);
    let startXIn = cX + rIntScaled * Math.cos(angPonto);
    let endXIn = cX - rIntScaled * Math.cos(angPonto);
    createSvgElement('path', {
        d: `M ${startXIn} ${startYIn} A ${rIntScaled} ${rIntScaled} 0 ${bigger} 1 ${endXIn} ${startYIn}`,
        stroke: "black", fill: "transparent", 'stroke-width': stdLineWidth
    }, svgElement);

    if (angulo >= 180) {
        // Linhas:
        const linesCoord = [
            //x1, y1, x2, y2, color:
            [cX - 0.32 * rIntScaled, cY, cX + 0.32 * rIntScaled, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.32 * rIntScaled, cX, cY + 0.32 * rIntScaled, "grey"], // linha centro vertical
            [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
            [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
            [(cX - rExtScaled), cY + 8, (cX - rExtScaled), cY + 76.6, "grey"], // cota externa linha esquerda
            [(cX + rExtScaled), cY + 8, (cX + rExtScaled), cY + 76.6, "grey"], // cota externa linha direita
            [(cX - rIntScaled), cY + 8, (cX - rIntScaled), cY + 45.5, "grey"], // cota interna linha esquerda
            [(cX + rIntScaled), cY + 8, (cX + rIntScaled), cY + 45.5, "grey"], // cota interna linha direita
        ];
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": stdLineWidth
            }, svgElement);
        }

        createDimLine({x1: (cX + rExtScaled), y1: cY, x2: (cX + rIntScaled), y2: cY}, 48, svgElement, esp, align="h"); // cota espessura

        const arrowCoordLines = [
            //x1, y1, x2, y2, color:
            [cX, cY + 70.2, (cX + rExtScaled), cY + 70.2, "grey"], // Linha direita externa
            [cX, cY + 39.4, (cX + rIntScaled), cY + 39.4, "grey"], // Linha direita interna
            [cX, cY + 70.2, (cX - rExtScaled), cY + 70.2, "grey"], // Linha esquerda externa
            [cX, cY + 39.4, (cX - rIntScaled), cY + 39.4, "grey"], // Linha esquerda interna
        ];
        
        for (const line of arrowCoordLines) {
            createSvgElement("polyline", 
                {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: line[4], 
                'stroke-width': stdLineWidth, "marker-end": "url(#arrowheadright)"}, svgElement);
        }

        // Text diâmetro ext:
        let TextDiamExtCont = "Ø ext " + dext.toFixed(1);
        let TextDiamExt = createSvgElement("text", {y: `${cY+64.4}`, x: `${cX + 5 - 5 * (TextDiamExtCont.length)}`,
             'font-size': stdTextSize}, svgElement);
        TextDiamExt.textContent = TextDiamExtCont;
        // Text diâmetro int:
        let TextDiamIntCont = "Ø int " + (dext - 2 * esp).toFixed(1);
        let TextDiamInt = createSvgElement("text", {y: `${cY+34.8}`, x: `${cX + 5 - 5*(TextDiamIntCont.length)}`,
             'font-size': stdTextSize}, svgElement);
        TextDiamInt.textContent = TextDiamIntCont;
        // Text espessura
        let TextEspessuraCont = "" + esp.toFixed(1);
        const textEspessura = createSvgElement("text", {
            y: `${cY - 112}`, x: `${cX + 2*(TextEspessuraCont.length) - rIntScaled + 10}`, 
            'font-size': stdTextSize}, svgElement);
        textEspessura.textContent = TextEspessuraCont;

    } // final das cotas exclusivas de angulo >= 180
    
    if (angulo < 180) {
        // Linhas:
        const linesCoord = [
            //x1, y1, x2, y2, color:
            [cX - 0.1 * rIntScaled, cY, cX + 0.1 * rIntScaled, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.1 * rIntScaled, cX, cY + 0.1 * rIntScaled, "grey"], // linha centro vertical
            [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
            [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
            [endX, startY + 8, endX, startY + 176.6, "grey"], // cota externa linha esquerda
            [startX, startY + 8, startX, startY + 176.6, "grey"], // cota externa linha direita
            [endXIn, startYIn + 8, endXIn, startYIn + 145.5, "grey"], // cota interna linha esquerda
            [startXIn, startYIn + 8, startXIn, startYIn + 145.5, "grey"], // cota interna linha direita
        ];
        
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": stdLineWidth
            }, svgElement)
        }
    } //final das cotas exclusivas de angulo < 180

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

function createDimLine(xyObj, distance, parentElement, text, align="aligned", color="grey", strokeWidth="0.3", offset=2){
    // Cotas horizontais:
    if (align === "horizontal" || align === "h") { 
        if (xyObj.y1 >= xyObj.y2) { refY = xyObj.y1 } else { refY = xyObj.y2 }

        // Lines:
        const linesCoords = [
            [xyObj.x1, xyObj.y1 - offset, xyObj.x1, refY - distance],
            [xyObj.x2, xyObj.y2 - offset, xyObj.x2, refY - distance],
        ];
        for (const line of linesCoords) {
            createSvgElement("line", {x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: color, "stroke-width": strokeWidth}, parentElement);
        }

        // Arrow Lines:
        // if (xyObj.x1 - xyObj.x2 < 10) {
        // }
        const arrowLinesCoords = [
            [xyObj.x1 + 15, refY - distance + offset, xyObj.x1, refY - distance + offset, "grey"], // cota espessura linha ext
            [xyObj.x2 - 10, refY - distance + offset, xyObj.x2, refY - distance + offset, "grey"], // cota espessura linha int
        ];
        for (const line of arrowLinesCoords) {
            createSvgElement("polyline", 
                {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: color, "stroke-width": strokeWidth,
                 "marker-end": "url(#arrowheadright)"}, parentElement);
        }

    // Cotas verticais:
    } else if (align === "vertical" || align === "v") {

    // Cotas alinhadas: 
    } else {
        const angPointsRad = Math.atan2(xyObj.y2 - xyObj.y1, xyObj.x2 - xyObj.x1);
        const angCotaRad = angPointsRad + Math.PI / 2;
    }
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


