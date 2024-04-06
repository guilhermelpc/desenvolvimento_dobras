function draw(esp, dext, angulo) { //
    let svgWidth = 330;
    if (window.innerWidth > 450) {
        svgWidth = 0.5 * window.innerWidth;
    }
    let svgHeight = 1.31 * svgWidth;

    const drawingDiv = document.getElementById("drawing");
    drawingDiv.innerHTML = "";
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
    const cX = 165;
    const cY = 173;
    const rExtPixels = 95; // Define a escala do desenho
    const rIntPixels = 95 * ((dext/2 - esp)/(dext/2));
    const arrowSize = 0.15 * rExtPixels;
    // SVG Element:
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", svgWidth);
    svgElement.setAttribute("height", svgHeight);
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = `text {font-family:Courier, monospace;}`;
    svgElement.appendChild(styleElement);

    // SVG Brackground:
    const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    backgroundRect.setAttribute("width", svgWidth);
    backgroundRect.setAttribute("height", svgHeight);
    backgroundRect.setAttribute("fill", "white");
    svgElement.appendChild(backgroundRect);

    // Top text
    const textTop = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textTop.setAttribute("x", 22);
    textTop.setAttribute("y", 22);
    textTop.setAttribute("font-size", "16");
    textTop.textContent = "Dimensões em milímetros"
    svgElement.appendChild(textTop);
    // Ext. Arc:
    let bigger = 1;
    if (angulo < 180) {bigger = 0;}
    let angAbertura = 2 * Math.PI - angulo * Math.PI / 180 + 1e-5;
    let angPonto = (Math.PI - angAbertura) / 2;
    let startY = cY - rExtPixels * Math.sin(angPonto);
    let startX = cX + rExtPixels * Math.cos(angPonto);
    let endX = cX - rExtPixels * Math.cos(angPonto);
    const arcExt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arcExt.setAttribute("d", `M ${startX} ${startY} A ${rExtPixels} ${rExtPixels} 0 ${bigger} 1 ${endX} ${startY}`);
    arcExt.setAttribute("stroke", "black");
    arcExt.setAttribute("fill", "transparent");
    arcExt.setAttribute("stroke-width", 1);
    svgElement.appendChild(arcExt);
    // Int. Arc:
    let startYIn = cY - rIntPixels * Math.sin(angPonto);
    let startXIn = cX + rIntPixels * Math.cos(angPonto);
    let endXIn = cX - rIntPixels * Math.cos(angPonto);
    const arcInt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arcInt.setAttribute("d", `M ${startXIn} ${startYIn} A ${rIntPixels} ${rIntPixels} 0 ${bigger} 1 ${endXIn} ${startYIn}`);
    arcInt.setAttribute("stroke", "black");
    arcInt.setAttribute("fill", "transparent");
    arcInt.setAttribute("stroke-width", 1);
    svgElement.appendChild(arcInt);

    // Linhas:
    const linesCoord = [
        //x1, y1, x2, y2, color, condition:
        [cX - 0.32 * rIntPixels, cY, cX + 0.32 * rIntPixels, cY, "grey", 1], // linha centro horizontal
        [cX, cY - 0.32 * rIntPixels, cX, cY + 0.32 * rIntPixels, "grey", 1], // linha centro vertical
        [startX, startY, startXIn, startYIn, "black", 1], // linha arcos 1
        [endX, startY, endXIn, startYIn, "black", 1], // linha arcos 2
        [(cX - rExtPixels), cY + 8, (cX - rExtPixels), cY + 176.6, "grey", bigger], // cota externa linha esquerda
        [(cX + rExtPixels), cY + 8, (cX + rExtPixels), cY + 176.6, "grey", bigger], // cota externa linha direita
        [(cX - rIntPixels), cY + 8, (cX - rIntPixels), cY + 145.5, "grey", bigger], // cota interna linha esquerda
        [(cX + rIntPixels), cY + 8, (cX + rIntPixels), cY + 145.5, "grey", bigger], // cota interna linha direita
        [(cX - rExtPixels), cY - 8, (cX - rExtPixels), cY -113.7, "grey", bigger], // cota espessura linha ext
        [(cX - rIntPixels), cY - 8, (cX - rIntPixels), cY -113.7, "grey", bigger], // cota espessura linha int
    ];
    for (const line of linesCoord) {
        if (line[5] == 1) {
            const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineElement.setAttribute("x1", line[0]);
            lineElement.setAttribute("y1", line[1]);
            lineElement.setAttribute("x2", line[2]);
            lineElement.setAttribute("y2", line[3]);
            lineElement.setAttribute("stroke", line[4]); // Set default stroke color
            lineElement.setAttribute("stroke-width", 1);
            svgElement.appendChild(lineElement);
        }
    }
    // Linhas com flechas:
    if (angulo >= 180) {
        // Right Arrow:
        const arrowPathRight = `M 0 0 L 0 ${arrowSize/3} L ${arrowSize} ${arrowSize/6} Z`;
        const markerRight = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        markerRight.setAttribute("id", "arrowheadright");
        markerRight.setAttribute("markerWidth", arrowSize);
        markerRight.setAttribute("markerHeight", arrowSize);
        markerRight.setAttribute("refX", arrowSize);
        markerRight.setAttribute("refY", arrowSize/6);
        markerRight.setAttribute("markerUnits", "userSpaceOnUse");
        const markerPathRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
        markerPathRight.setAttribute("d", arrowPathRight);
        markerPathRight.setAttribute("fill", "grey");
        markerPathRight.setAttribute("stroke-width", 1);
        markerRight.appendChild(markerPathRight);
        // Left Arrow:
        const arrowPathLeft = `M 0 ${arrowSize/6} L ${arrowSize} ${arrowSize/3} L ${arrowSize} 0 Z`;
        const markerLeft = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        markerLeft.setAttribute("id", "arrowheadleft");
        markerLeft.setAttribute("markerWidth", arrowSize);
        markerLeft.setAttribute("markerHeight", arrowSize);
        markerLeft.setAttribute("refX", 0);
        markerLeft.setAttribute("refY", arrowSize/6);
        markerLeft.setAttribute("markerUnits", "userSpaceOnUse");
        const markerPathLeft = document.createElementNS("http://www.w3.org/2000/svg", "path");
        markerPathLeft.setAttribute("d", arrowPathLeft);
        markerPathLeft.setAttribute("fill", "grey");
        markerPathLeft.setAttribute("stroke-width", 1);
        markerLeft.appendChild(markerPathLeft);

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
            const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            lineElement.setAttribute("points", `${line[0]},${line[1]},${line[2]},${line[3]} `);
            lineElement.setAttribute("stroke", line[4]); // Set default stroke color
            lineElement.setAttribute("stroke-width", 1);
            if (line[0] < line[2]){
                lineElement.setAttribute("marker-end", "url(#arrowheadright)");
                svgElement.appendChild(markerRight);
            } else {
                lineElement.setAttribute("marker-end", "url(#arrowheadleft)");
                svgElement.appendChild(markerLeft);
            }
            svgElement.appendChild(lineElement);
        };
        // Text diâmetro ext:
        const TextDiamExt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        TextDiamExt.setAttribute("y", cY+164.4);
        TextDiamExt.setAttribute("font-size", 16);
        let TextDiamExtCont = "Ø ext " + dext.toFixed(1);
        TextDiamExt.textContent = TextDiamExtCont;
        TextDiamExt.setAttribute("x", cX + 5 - 5 * (TextDiamExtCont.length));
        svgElement.appendChild(TextDiamExt);
        // Text diâmetro int:
        const TextDiamInt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        TextDiamInt.setAttribute("y", cY+134.8);
        TextDiamInt.setAttribute("font-size", 16);
        let TextDiamIntCont = "Ø int " + (dext - 2 * esp).toFixed(1);
        TextDiamInt.textContent = TextDiamIntCont;
        TextDiamInt.setAttribute("x", cX + 5 - 5*(TextDiamIntCont.length));
        svgElement.appendChild(TextDiamInt);
        // Text espessura
        const textEspessura = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEspessura.setAttribute("y", cY - 112);
        textEspessura.setAttribute("font-size", "16");
        let TextEspessuraCont = "" + esp.toFixed(1);
        textEspessura.textContent = TextEspessuraCont;
        textEspessura.setAttribute("x", cX + 2*(TextEspessuraCont.length) - rIntPixels + 10);
        svgElement.appendChild(textEspessura);
    }
    if (angulo < 180) {
        
    }
    // Text Comprimento:
    let compr = parseFloat(convert_comma_input(comprimentoIn.value));
    if (!isNaN(compr)){
        const textComprimento = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        textComprimento.setAttribute("y", cY + 201.5);
        textComprimento.setAttribute("font-size", "16");
        let TestComprCont = "Comprimento: " + parseFloat(convert_comma_input(comprimentoIn.value)) + " mm";
        textComprimento.textContent = TestComprCont;
        textComprimento.setAttribute("x", cX - 4 * TestComprCont.length - 15);
        svgElement.appendChild(textComprimento);
    }
    return svgElement.outerHTML;
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

// function getArrow(size, rotation) {

// }