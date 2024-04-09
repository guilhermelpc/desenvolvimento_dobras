draw(6.3, 400, 340);

function draw(esp, dext, angulo) {
    drawingDiv.innerHTML = "";

    let svgWidth = 330;
    if (window.innerWidth > 450) {
        svgWidth = 0.5 * window.innerWidth;
    }
    let svgHeight = 1.31 * svgWidth;

    // Svg URL:
    const svgContent = createSvgContent(esp, dext, angulo, svgWidth, svgHeight);
    const dataUrl = svgToDataURL(svgContent);
    // Insert img in div
    const imgElement = document.createElement("img");
    imgElement.setAttribute("width", svgWidth);
    imgElement.setAttribute("height", svgHeight);
    imgElement.src = dataUrl;
    document.getElementById("drawing").appendChild(imgElement);
}

function createSvgContent(esp, dext, angulo, svgWidth, svgHeight) {
    let cX = svgWidth/2;
    if (window.innerWidth > 450) {
        cX = 165;
    }
    const cY = 173;
    const rExtPixels = 95; // Define a escala do desenho = 95 / raio_externo [px / mm]
    const rIntPixels = 95 * ((dext/2 - esp)/(dext/2));
    const arrowSize = 0.15 * rExtPixels;

    // SVG Element:
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defsElement = svgElement.querySelector('defs') || createSvgElement('defs', {}, svgElement);
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", svgWidth);
    svgElement.setAttribute("height", svgHeight);
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = `text {font-family:Courier, monospace;}`;
    svgElement.appendChild(styleElement);

    // SVG Brackground:
    createSvgElement("rect", {width: svgWidth, height: svgHeight, fill: "white"}, svgElement)

    // Arrow marker:
    const arrowPathRight = `M 0 0 L 0 ${arrowSize/3} L ${arrowSize} ${arrowSize/6} Z`;
    const markerRight = createSvgElement("marker", 
        {id: "arrowheadright", markerWidth:arrowSize,markerHeight:arrowSize,refX:arrowSize,refY:arrowSize/6,
        markerUnits: "userSpaceOnUse", orient: "auto"}, defsElement);
    createSvgElement("path", {"d": arrowPathRight,"fill": "grey","stroke-width": 1}, markerRight);

    // Top text
    const textTop = createSvgElement("text", {x: 22, y: 22, 'font-size': "16"}, svgElement)
    textTop.textContent = "Dimensões em milímetros"

    // Ext. Arc:
    let bigger = 1;
    if (angulo < 180) {bigger = 0;}
    let angAbertura = 2 * Math.PI - angulo * Math.PI / 180 + 1e-5;
    let angPonto = (Math.PI - angAbertura) / 2;
    let startY = cY - rExtPixels * Math.sin(angPonto);
    let startX = cX + rExtPixels * Math.cos(angPonto);
    let endX = cX - rExtPixels * Math.cos(angPonto);
    createSvgElement('path', {
        d: `M ${startX} ${startY} A ${rExtPixels} ${rExtPixels} 0 ${bigger} 1 ${endX} ${startY}`,
        stroke: "black", fill: "transparent", 'stroke-width': "1"
    }, svgElement);

    // Int. Arc:
    let startYIn = cY - rIntPixels * Math.sin(angPonto);
    let startXIn = cX + rIntPixels * Math.cos(angPonto);
    let endXIn = cX - rIntPixels * Math.cos(angPonto);
    createSvgElement('path', {
        d: `M ${startXIn} ${startYIn} A ${rIntPixels} ${rIntPixels} 0 ${bigger} 1 ${endXIn} ${startYIn}`,
        stroke: "black", fill: "transparent", 'stroke-width': "1"
    }, svgElement);

    if (angulo >= 180) {
        // Linhas:
        const linesCoord = [
            //x1, y1, x2, y2, color:
            [cX - 0.32 * rIntPixels, cY, cX + 0.32 * rIntPixels, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.32 * rIntPixels, cX, cY + 0.32 * rIntPixels, "grey"], // linha centro vertical
            [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
            [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
            [(cX - rExtPixels), cY + 8, (cX - rExtPixels), cY + 176.6, "grey"], // cota externa linha esquerda
            [(cX + rExtPixels), cY + 8, (cX + rExtPixels), cY + 176.6, "grey"], // cota externa linha direita
            [(cX - rIntPixels), cY + 8, (cX - rIntPixels), cY + 145.5, "grey"], // cota interna linha esquerda
            [(cX + rIntPixels), cY + 8, (cX + rIntPixels), cY + 145.5, "grey"], // cota interna linha direita
            [(cX - rExtPixels), cY - 8, (cX - rExtPixels), cY -113.7, "grey"], // cota espessura linha ext
            [(cX - rIntPixels), cY - 8, (cX - rIntPixels), cY -113.7, "grey"], // cota espessura linha int
        ];
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": 1
            }, svgElement)
        }

        const arrowCoordLines = [
            //x1, y1, x2, y2, color:
            [cX, cY + 170.2, (cX + rExtPixels), cY + 170.2, "grey"], // Linha direita externa
            [cX, cY + 139.4, (cX + rIntPixels), cY + 139.4, "grey"], // Linha direita interna
            [cX, cY + 170.2, (cX - rExtPixels), cY + 170.2, "grey"], // Linha esquerda externa
            [cX, cY + 139.4, (cX - rIntPixels), cY + 139.4, "grey"], // Linha esquerda interna
            [cX - 120, cY - 107.4, cX-rExtPixels, cY - 107.4, "grey"], // cota espessura linha ext
            [cX + 40 + 5*("" + esp.toFixed(1)).length-rIntPixels, cY - 107.4, cX-rIntPixels, cY - 107.4, "grey"], // cota espessura linha int
        ];
        for (const line of arrowCoordLines) {
            createSvgElement("polyline", 
                {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: line[4], 'stroke-width': 1, "marker-end": "url(#arrowheadright)"}, svgElement);
        };

        // Text diâmetro ext:
        let TextDiamExtCont = "Ø ext " + dext.toFixed(1);
        let TextDiamExt = createSvgElement("text", {y: `${cY+164.4}`, x: `${cX + 5 - 5 * (TextDiamExtCont.length)}`, 'font-size': 16}, svgElement);
        TextDiamExt.textContent = TextDiamExtCont;
        // Text diâmetro int:
        let TextDiamIntCont = "Ø int " + (dext - 2 * esp).toFixed(1);
        let TextDiamInt = createSvgElement("text", {y: `${cY+134.8}`, x: `${cX + 5 - 5*(TextDiamIntCont.length)}`, 'font-size': 16}, svgElement);
        TextDiamInt.textContent = TextDiamIntCont;
        // Text espessura
        let TextEspessuraCont = "" + esp.toFixed(1);
        const textEspessura = createSvgElement("text", {
            y: `${cY - 112}`, x: `${cX + 2*(TextEspessuraCont.length) - rIntPixels + 10}`, 'font-size': 16}, svgElement);
        textEspessura.textContent = TextEspessuraCont;

    } // final das cotas exclusivas de angulo >= 180
    
    if (angulo < 180) {
        // Linhas:
        const linesCoord = [
            //x1, y1, x2, y2, color:
            [cX - 0.1 * rIntPixels, cY, cX + 0.1 * rIntPixels, cY, "grey"], // linha centro horizontal
            [cX, cY - 0.1 * rIntPixels, cX, cY + 0.1 * rIntPixels, "grey"], // linha centro vertical
            [startX, startY, startXIn, startYIn, "black"], // linha arcos 1
            [endX, startY, endXIn, startYIn, "black"], // linha arcos 2
            [endX, startY + 8, endX, startY + 176.6, "grey"], // cota externa linha esquerda
            [startX, startY + 8, startX, startY + 176.6, "grey"], // cota externa linha direita
            [endXIn, startYIn + 8, endXIn, startYIn + 145.5, "grey"], // cota interna linha esquerda
            [startXIn, startYIn + 8, startXIn, startYIn + 145.5, "grey"], // cota interna linha direita
        ];
        
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": 1
            }, svgElement)
        }
    } //final das cotas exclusivas de angulo > 180

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


