function draw(esp, dext, angulo) {
    svgDiv.innerHTML = "";
    // SVG Element:
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgWidth = 300;
    const svgHeight = 430;
    svgElement.setAttribute("width", svgWidth);
    svgElement.setAttribute("height", svgHeight);

    // SVG Brackground:
    const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    backgroundRect.setAttribute("width", svgWidth);
    backgroundRect.setAttribute("height", svgHeight);
    backgroundRect.setAttribute("fill", "white");
    svgElement.appendChild(backgroundRect);

    // Top text
    const textTop = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textTop.setAttribute("x", 33);
    textTop.setAttribute("y", 22);
    textTop.setAttribute("font-size", "16");
    textTop.textContent = "Dimensões em milímetros"
    svgElement.appendChild(textTop);
    // Ext. Arc:
    const rExtPixels = 95; // Define a escala do desenho
    const cX = 150;
    const cY = 173;
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
    let rIntPixels = 95*((dext/2-esp)/(dext/2));
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
        [cX - 31, cY, cX + 31, cY, "grey", 1], // linha centro horizontal
        [cX, cY - 31, cX, cY + 31, "grey", 1], // linha centro vertical
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
    const arrowSize = 15;
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
            [cX - 46.3, cY - 107.4, cX-rIntPixels, cY - 107.4, "grey"], // cota espessura linha int
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
        var TextDiamExtCont = "Ø ext " + dext.toFixed(1);
        TextDiamExt.textContent = TextDiamExtCont;
        var TextDiamExtLen = 127 - 2.5*(TextDiamExtCont.length);
        TextDiamExt.setAttribute("x", TextDiamExtLen);
        svgElement.appendChild(TextDiamExt);
        // Text diâmetro int:
        const TextDiamInt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        TextDiamInt.setAttribute("y", cY+134.8);
        TextDiamInt.setAttribute("font-size", 16);
        var TextDiamIntCont = "Ø int " + (dext - 2 * esp).toFixed(1);
        TextDiamInt.textContent = TextDiamIntCont;
        var TextDiamIntLen = 127 - 2.5*(TextDiamIntCont.length);
        TextDiamInt.setAttribute("x", TextDiamIntLen);
        svgElement.appendChild(TextDiamInt);
        // Text espessura
        const textEspessura = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEspessura.setAttribute("x", 67.4);
        textEspessura.setAttribute("y", cY - 112);
        textEspessura.setAttribute("font-size", "16");
        textEspessura.textContent = "" + esp.toFixed(1);
        svgElement.appendChild(textEspessura);
    }
    if (angulo < 180) {
        
    }


    // Text Comprimento:
    const textComprimento = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textComprimento.setAttribute("x", svgWidth - 242);
    textComprimento.setAttribute("y", cY + 231.5);
    textComprimento.setAttribute("font-size", "16");
    let compr = parseFloat(convert_comma_input(comprimentoIn.value));
    if (!isNaN(compr)){
        textComprimento.textContent = "Comprimento: " + parseFloat(convert_comma_input(comprimentoIn.value)) + " mm";
    }
    svgElement.appendChild(textComprimento);

    // SVG append
    svgDiv.appendChild(svgElement);

    return;

    // Ext. Circle:
    // const circleExt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // circleExt.setAttribute("cx", cX);
    // circleExt.setAttribute("cy", cY);
    // circleExt.setAttribute("r", rExtPixels);
    // circleExt.setAttribute("fill", "none");
    // circleExt.setAttribute("stroke", "lightgrey");
    // circleExt.setAttribute("stroke-dasharray", "10, 5");
    // svgElement.appendChild(circleExt);

    // Inner Circle:
    // const circleInt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // circleInt.setAttribute("cx", cX);
    // circleInt.setAttribute("cy", 143);
    // circleInt.setAttribute("r", rIntPixels);
    // circleInt.setAttribute("fill", "none");
    // circleInt.setAttribute("stroke", "lightgrey");
    // circleInt.setAttribute("stroke-dasharray", "10, 5");
    // svgElement.appendChild(circleInt);
}
