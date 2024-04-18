class arcOutLine {
    constructor(dext, esp, angulo, cY, cX, parentElement, scale, comprimento = null, color="black", strokeWidth="0.3", textHeight = 4.5) 
    {
        this.arcGroupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.dext = dext;
        this.rExtPaperScale = dext * scale / 2; // Define a escala do desenho = 95 / raio_externo [px / mm]
        this.rIntPaperScale = this.rExtPaperScale * ((dext/2 - esp)/(dext/2));
        this.esp = esp;
        this.angulo = angulo;
        this.cY = cY;
        this.cX = cX;
        this.parentElement = parentElement;
        this.scale = scale;
        this.comprimento = comprimento;
        this.comprPaperScale = comprimento * scale;
        this.color = color;
        this.textHeight = textHeight;
        this.strokeWidth = strokeWidth;
        this.limComprPprScl = 50;

        this.bigger = (this.angulo<180) ? 0 : 1;
        const angAbertura = 2 * Math.PI - this.angulo * Math.PI / 180 + 1e-5;
        const angPonto = (Math.PI - angAbertura) / 2;
        this.startY = this.cY - this.rExtPaperScale * Math.sin(angPonto);
        this.startX = this.cX + this.rExtPaperScale * Math.cos(angPonto);
        this.endX = this.cX - this.rExtPaperScale * Math.cos(angPonto);
        this.startYIn = this.cY - this.rIntPaperScale * Math.sin(angPonto);
        this.startXIn = this.cX + this.rIntPaperScale * Math.cos(angPonto);
        this.endXIn = this.cX - this.rIntPaperScale * Math.cos(angPonto);

        this.distBetweenViews = 39;
        this.centerMarkActive = false;
        this.sideViewActive = false;

        this.sideStartX = this.cX + this.rExtPaperScale + this.distBetweenViews;

        this.attributes = {sideView: false, dimLines: false, centerLines: false, hiddenLines: false};

        parentElement.appendChild(this.arcGroupElement);
    }

    createArc() 
    {
        // Ext. Arc:
        createSvgElement('path', {
            d: `M ${this.startX} ${this.startY} A ${this.rExtPaperScale} ${this.rExtPaperScale} 0 ${this.bigger} 1 ${this.endX} ${this.startY}`,
            stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
        }, this.arcGroupElement);
        // Int. Arc:
        createSvgElement('path', {
            d: `M ${this.startXIn} ${this.startYIn} A ${this.rIntPaperScale} ${this.rIntPaperScale} 0 ${this.bigger} 1 ${this.endXIn} ${this.startYIn}`,
            stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
        }, this.arcGroupElement);
        // Linhas fechamento arco:
        const linesCoord = [
            [this.startX, this.startY, this.startXIn, this.startYIn, "black"], // linha arcos 1
            [this.endX, this.startY, this.endXIn, this.startYIn, "black"], // linha arcos 2
        ];
        for (const line of linesCoord) {
            createSvgElement("line", {
                x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": this.strokeWidth
            }, this.arcGroupElement);
        }
    }

    createCenterMarkFront() 
    {
        // Linhas:
        if (this.angulo >= 180) {
            const linesCoord = [
                [this.cX - 0.32 * this.rIntPaperScale, this.cY, this.cX + 0.32 * this.rIntPaperScale, this.cY, "grey"], // linha centro horizontal
                [this.cX, this.cY - 0.32 * this.rIntPaperScale, this.cX, this.cY + 0.32 * this.rIntPaperScale, "grey"], // linha centro vertical
            ];
            for (const line of linesCoord) {
                createSvgElement("line", {
                    x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": this.strokeWidth, 
                }, this.arcGroupElement);
            }
        } else {
            const linesCoord = [
                [this.cX - 0.1 * this.rIntPaperScale, this.cY, this.cX + 0.1 * this.rIntPaperScale, this.cY, "grey"], // linha centro horizontal
                [this.cX, this.cY - 0.1 * this.rIntPaperScale, this.cX, this.cY + 0.1 * this.rIntPaperScale, "grey"], // linha centro vertical
            ];
            for (const line of linesCoord) {
                createSvgElement("line", {
                    x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: line[4], "stroke-width": this.strokeWidth
                }, this.arcGroupElement);
            }
        }
        this.centerMarkActive = true;
        if (this.sideViewActive) {
            console.log('create center side')
            this.createCenterMarkSide()
        }
        return;
    }

    createCenterMarkSide()
    {
        createSvgElement("line", {
            x1: (this.cX + this.rExtPaperScale + this.distBetweenViews - 10), y1: this.cY, 
            x2: (this.cX + this.rExtPaperScale + this.distBetweenViews + Math.min(this.comprPaperScale, this.limComprPprScl) + 10), y2: this.cY,
            "stroke-width": this.strokeWidth, 'stroke-dasharray': "6 2.5 2.7 2.5", stroke: "grey"
        }, this.arcGroupElement);
    }

    createDimLines() 
    {
        if (this.angulo >= 180) {
            // Parameters: createDimLine(xyObj, distance, parentElement, textHeight, scale, text = "", align="aligned", color="grey", strokeWidth="0.3"):
            createDimLine({
                x1: (this.cX + this.rIntPaperScale), y1: this.cY, x2: (this.cX + this.rExtPaperScale), y2: this.cY
            }, 48, this.arcGroupElement, this.textHeight, this.scale, '', "h"); // cota espessura
            createDimLine({
                x1: (this.cX + this.rExtPaperScale), y1: this.cY, x2: (this.cX - this.rExtPaperScale), y2: this.cY
            }, -60, this.arcGroupElement, this.textHeight, this.scale, 'Ø ext ',"h"); // cota dExt
            createDimLine({
                x1: (this.cX + this.rIntPaperScale), y1: this.cY, x2: (this.cX - this.rIntPaperScale), y2: this.cY
            }, -48, this.arcGroupElement, this.textHeight, this.scale, 'Ø int ', "h"); // cota dInt

            if (this.angulo != 360) {
                createDimLine({
                    x1: this.startX, y1: this.startY, x2: this.endX, y2: this.startY
                }, 17, this.arcGroupElement, this.textHeight, this.scale, '', "h"); // cota abertura Ext
                createDimLine({
                    x1: this.startXIn, y1: this.startYIn, x2: this.endXIn, y2: this.startYIn
                }, 10, this.arcGroupElement, this.textHeight, this.scale, '', "h"); // cota abertura Int
            }
        } else {
            createDimLine({x1: this.startX, y1: this.startY, x2: this.endX, y2: this.startY}, -60, this.arcGroupElement, this.textHeight, this.scale, '', "h"); // cota abertura Ext
            createDimLine({x1: this.startXIn, y1: this.startYIn, x2: this.endXIn, y2: this.startYIn}, -48, this.arcGroupElement, this.textHeight, this.scale, '', "h"); // cota abertura Int
        }

        if (this.comprimento && this.comprimento != 0) {
            let comprPaperScale = Math.min(this.comprPaperScale, this.limComprPprScl);
            createDimLine({
                x1:(this.sideStartX), y1: (this.cY + this.rExtPaperScale), x2: (this.sideStartX + comprPaperScale), y2: (this.cY + this.rExtPaperScale)
            }, -28, this.arcGroupElement, this.textHeight, this.scale, '',"h","grey","0.3", this.comprimento.toFixed(1)); // cota dExt

        }
    }

    createSideView()
    {
        const alturaPaperScale = this.rExtPaperScale + (this.cY - Math.min(this.startYIn, this.startY));
        
        let sideStartX = this.sideStartX;
        let sideBottomY = this.cY + this.rExtPaperScale;
  
        if (this.comprPaperScale > this.limComprPprScl) {
            // Create rect with line break in the middle
            let breakDistLeft = this.limComprPprScl / 2;
            let breakDistRight = this.limComprPprScl / 2 - 3.8;
            let sideEndX = sideStartX + this.limComprPprScl;

            const linesCoord = [
                [(sideStartX + breakDistLeft), (sideBottomY - alturaPaperScale), (sideStartX), (sideBottomY - alturaPaperScale)], // top left
                [(sideStartX), (sideBottomY - alturaPaperScale), (sideStartX), (sideBottomY)], // left
                [(sideStartX + breakDistLeft), (sideBottomY), (sideStartX), (sideBottomY)], // bottom left
                [(sideEndX - breakDistRight), (sideBottomY), (sideEndX), (sideBottomY)], // bottom right
                [(sideEndX), (sideBottomY - alturaPaperScale), (sideEndX), (sideBottomY)], // right
                [(sideEndX - breakDistRight), (sideBottomY - alturaPaperScale), (sideEndX), (sideBottomY - alturaPaperScale)], // top right
            ];
            for (const line of linesCoord) {
                createSvgElement("line", {
                    x1: line[0], y1: line[1], x2: line[2], y2: line[3], 
                    "stroke-width": this.strokeWidth, stroke: "black"
                }, this.arcGroupElement);
            }
            // Break symbol:
            let r = alturaPaperScale;
            // r = alturaPaperScale / 8 >= r ? alturaPaperScale / 9 : r
            const breakSize =  this.limComprPprScl - breakDistLeft - breakDistRight;
            const arcCoords = [
                `M ${sideStartX + breakDistLeft} ${sideBottomY} A ${r} ${r} 0 ${0} 1 ${sideStartX + breakDistLeft} ${sideBottomY-alturaPaperScale/2}`,
                `M ${sideStartX + breakDistLeft} ${sideBottomY-alturaPaperScale/2} A ${r} ${r} 0 ${0} 0 ${sideStartX + breakDistLeft} ${sideBottomY-alturaPaperScale}`,
                `M ${sideStartX + breakDistLeft + breakSize} ${sideBottomY} A ${r} ${r} 0 ${0} 1 ${sideStartX + breakDistLeft + breakSize} ${sideBottomY-alturaPaperScale/2}`,
                `M ${sideStartX + breakDistLeft + breakSize} ${sideBottomY-alturaPaperScale/2} A ${r} ${r} 0 ${0} 0 ${sideStartX + breakDistLeft + breakSize} ${sideBottomY-alturaPaperScale}`,
            ];
            for (const coords of arcCoords) {
                createSvgElement('path', {
                    d: coords,
                        stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
                    }, this.arcGroupElement);
            }

            // invisible lines:
            let dash = this.angulo < 180 ? "0" : "3"
            let cBreakXBottom = sideStartX+breakDistLeft+r*Math.cos(Math.asin((alturaPaperScale/4)/r))
            let cBreakXTop = sideStartX+breakDistLeft-r*Math.cos(Math.asin((alturaPaperScale/4)/r))
            let espPaperScale = this.rExtPaperScale-this.rIntPaperScale;


            const hiddenLinesCoord = [
                [sideStartX, this.cY+this.rIntPaperScale, cBreakXBottom-r*Math.sin(Math.acos((-alturaPaperScale/4+espPaperScale)/r)), this.cY+this.rIntPaperScale, "3"], // linha inferior esq
                [sideStartX, Math.max(this.startYIn, this.startY), cBreakXTop+r*Math.sin(Math.acos((-alturaPaperScale/4+espPaperScale)/r)), Math.max(this.startYIn, this.startY), dash], // linha superior esq 
                [breakSize+cBreakXBottom-r*Math.sin(Math.acos((-alturaPaperScale/4+espPaperScale)/r)), this.cY+this.rIntPaperScale, sideStartX+this.limComprPprScl, this.cY+this.rIntPaperScale, "3"], // linha inferior dir
                [breakSize+cBreakXTop+r*Math.sin(Math.acos((-alturaPaperScale/4+espPaperScale)/r)), Math.max(this.startYIn, this.startY), sideStartX+this.limComprPprScl, Math.max(this.startYIn, this.startY), dash], // linha superior dir
            ];
            for (const line of hiddenLinesCoord) {
                createSvgElement("line", {
                    x1: line[0], y1: line[1], x2: line[2], y2: line[3], 
                    "stroke-width": this.strokeWidth,  stroke: "black", 'stroke-dasharray': line[4],
                }, this.arcGroupElement);
            }

            // if (this.angulo == 360) {

            // }   
        } else {
            // Create full length rect
            createSvgElement('rect', {
                width: this.comprPaperScale, height: alturaPaperScale, x: sideStartX, y: this.cY + this.rExtPaperScale - alturaPaperScale, 
                stroke: "black", fill: "transparent", 'stroke-width': this.strokeWidth
            }, this.arcGroupElement);

            // invisible lines:
            let dash = this.angulo < 180 ? "0" : "3"
            const linesCoord = [
                [sideStartX, this.cY+this.rIntPaperScale, sideStartX+this.comprPaperScale, this.cY+this.rIntPaperScale, "3"], // linha inferior
                [sideStartX, Math.max(this.startYIn, this.startY), sideStartX+this.comprPaperScale, Math.max(this.startYIn, this.startY), dash], // linha superior  
            ];
            for (const line of linesCoord) {
                createSvgElement("line", {
                    x1: line[0], y1: line[1], x2: line[2], y2: line[3], 
                    "stroke-width": this.strokeWidth, 'stroke-dasharray': line[4], stroke: "black"
                }, this.arcGroupElement);
            }
        }
        this.sideViewActive = true;
        if (this.centerMarkActive) {
            this.createCenterMarkSide();
        }
    }

    render(obj)
    {
        for (const [key, value] of Object.entries(obj)) {
        element.setAttributeNS(null, key, value);
    }

    }
}

// Dev environment testing:
if (window.location.port.includes('5500')) {
    draw(6.3, 400, 270, 4000);
}

function draw(esp, dext, angulo, comprimento) {
    drawingDiv.innerHTML = "";

    const folhaWidth = 210
    const folhaHeight = 297
    let aspectRatio = folhaHeight / folhaWidth;

    // Svg URL:
    const svgContent = createSvgContent(esp, dext, angulo, comprimento, folhaWidth, folhaHeight);
    const dataUrl = svgToDataURL(svgContent);
    // Insert img in div
    const imgElement = document.createElement("img");
    imgElement.setAttribute("width", window.innerWidth / 2);
    imgElement.setAttribute("height", aspectRatio * window.innerWidth / 2);
    imgElement.src = dataUrl;
    document.getElementById("drawing").appendChild(imgElement);
}

function createSvgContent(esp, dext, angulo, comprimento, folhaWidth, folhaHeight) {
    const viewBox = `0 0 ${folhaWidth} ${folhaHeight}`
    let scaleMmMm = 63.3 / dext
  
    // Posição vista 1:
    let cX = 60;
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
    // svgElement.setAttribute("width", folhaWidth * 4);
    // svgElement.setAttribute("height", folhaHeight * 4);
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

    // Desenho do arco:
    let arc1 = new arcOutLine(dext, esp, angulo, cY, cX, svgElement, scaleMmMm, comprimento);
    arc1.createArc();
    arc1.createCenterMarkFront();
    if (comprimento != null) {
        arc1.createSideView(comprimento);
    }
    arc1.createDimLines();

     //teste
        const logoElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        logoElement.innerHTML = returnCBCLogo();
        // logoElement.setAttribute("x", 700)
        // logoElement.setAttribute("y", 700)
        // logoElement.setAttribute("viewBox", `-200 -200 ${100} ${100}`);
        svgElement.appendChild(logoElement)
    // /teste

    return svgElement.outerHTML;
}

function createDimLine(xyObj, distance, parentElement, textHeight, scale, text = "", align="aligned", color="grey", strokeWidth="0.3", override=""){
    let digitLen = textHeight / 1.8;
    let offset = (distance < 0) ? -2 : 2;

    // Cotas horizontais:
    if (align === "horizontal" || align === "h") { 
        // Mudando a ordem das linhas para a primeira ficar na esquerda:
        if (xyObj.x1 > xyObj.x2) { [xyObj.x1, xyObj.x2] = [xyObj.x2, xyObj.x1]; }

        const cotaPaperScale = xyObj.x2 - xyObj.x1;
        let dimensionTxt = text + (cotaPaperScale / scale).toFixed(1);
        if (override != "") {
            dimensionTxt = text + override;
        }
        let textLen = ("" + text + dimensionTxt).length * digitLen;
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
            textElem.textContent = dimensionTxt;

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
            const textElem = createSvgElement("text", {x: `${xyObj.x2 - cotaPaperScale/2 - dimensionTxt.length*2.5/2}`, y: refY - distance + offset - 2, 'font-size': textHeight}, parentElement);
            textElem.textContent = dimensionTxt;
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

function returnCBCLogo() {
    return `
    <svg width="793.700787402" height="1322.51968504" scale="20" viewBox="-3000,1080,15000,15000">
    
    <defs>
    <marker id="DistanceX" orient="auto" refX="0.0" refY="0.0" style="overflow:visible">
    <path d="M 3,-3 L -3,3 M 0,-5 L 0,5" style="stroke:#000000;stroke-width: 5px; stroke-width:1"/>
    </marker>
    <pattern height="8" id="Hatch" patternUnits="userSpaceOnUse" width="8" x="0" y="0">
    <path d="M8 4 l-4,4" linecap="square" stroke="#000000" stroke-width="0.25"/>
    <path d="M6 2 l-4,4" linecap="square" stroke="#000000" stroke-width="0.25"/>
    <path d="M4 0 l-4,4" linecap="square" stroke="#000000" stroke-width="0.25"/>
    </pattern>
    <symbol id="*Model_Space"/>
    <symbol id="*Paper_Space"/>
    </defs>
    <g xmlns:ns0="http://www.inkscape.org/namespaces/inkscape" ns0:groupmode="layer" ns0:label="0">
    <path d="M 778.485694,745.705972 A 83.682922,83.682922 -0.000000 0 0 694.802772,662.023050" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 778.485694,745.705972 778.485694,1023.621670" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 694.802772,1107.304592 A 83.682922,83.682922 -0.000000 0 0 778.485694,1023.621670" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 694.802772,1107.304592 98.898015,1107.304592" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 98.898015,662.023050 694.802772,662.023050" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 793.700787,745.705972 A 98.898015,98.898015 -0.000000 0 0 694.802772,646.807957" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 793.700787,745.705972 793.700787,1023.621670" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 694.802772,1122.519685 A 98.898015,98.898015 -0.000000 0 0 793.700787,1023.621670" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 694.802772,1122.519685 98.898015,1122.519685" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 98.898015,646.807957 694.802772,646.807957" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 306.750248,976.670966 L 319.869127,959.302572 L 328.640050,934.758161 L 329.809513,898.525942 L 333.343218,891.243329 L 338.804037,883.360024 L 347.298654,872.444625 L 355.186523,870.019004 L 355.793271,858.497223 L 363.681171,853.039539 L 367.321686,839.092136 L 367.321686,815.802058 L 367.306745,814.268194" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 367.059043,788.872256 L 335.767682,786.732406 L 331.156992,780.352047 L 322.290275,779.997566 L 318.034248,772.199374 L 308.812867,771.490442 L 295.690123,774.680621 L 293.562109,764.401152 L 276.892666,764.046671 L 263.415258,755.539547 L 253.129825,755.539547 L 246.647951,739.621760 L 243.195251,730.649906 L 242.504699,714.086543 L 235.599329,711.325977 L 228.003407,734.790755 L 216.954754,729.959780 L 198.310209,729.959780 L 181.737260,747.213300 L 174.141307,735.480912 L 179.665633,722.368209 L 169.307533,703.734406 L 162.402163,707.185098 L 163.783237,716.847109 L 149.972466,725.128775 L 134.090039,712.706230 L 124.422490,720.297800 L 126.494117,729.959780 L 136.852187,740.311886 L 125.113042,752.044275 L 114.064420,738.931603 L 100.944141,743.072452 L 96.110366,753.424588 L 94.038771,761.706285 L 85.061774,761.016129 L 83.680670,772.058391 L 89.204996,778.959775 L 89.204996,798.283765 L 71.461489,810.947866 L 70.450994,824.076878 L 56.303879,833.166223 L 55.196250,847.987702 L 60.335209,848.501302 L 62.390798,862.882122 L 78.321579,863.909292 L 82.946663,870.072501 L 89.113401,870.586101 L 88.599527,876.749310 L 101.446908,876.235709 L 114.294320,869.045330 L 118.919374,864.422924 L 127.655637,865.963695 L 126.113922,876.235709 L 132.280690,887.021323 L 146.669787,887.534894 L 157.975483,893.184501 L 163.114442,901.915713 L 161.572788,914.755700 L 167.739526,919.891707 L 181.614748,920.918908 L 182.128653,937.354100 L 185.772941,946.802703 L 178.064488,950.911508 L 180.120078,965.292297 L 185.259037,967.860301 L 185.772941,979.673117 L 196.564733,980.700318 L 200.162007,992.513103 L 209.412145,996.108308 L 209.412145,1008.948295 L 215.578914,1014.597903 L 211.981640,1023.329114 L 204.787091,1022.815514 L 194.490642,1045.561226 L 189.865589,1051.724404 L 182.157135,1054.806008 L 184.797015,1060.986531" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 199.747366,991.151474 L 196.980592,997.866869 L 189.786044,997.353268 L 179.489625,1020.098980 L 174.864541,1026.262158 L 167.156119,1029.343793 L 182.157135,1054.806008" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 233.337849,718.311987 L 231.646904,714.159515 L 228.194234,705.187661 L 227.503682,688.624297 L 220.598282,685.863732 L 213.002359,709.328540 L 201.953706,704.497535 L 183.309161,704.497535 L 174.708830,713.451100" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 194.411128,980.495340 L 194.411128,983.486080 L 198.574617,987.300412" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 170.285833,920.080222 L 170.771894,921.340457 L 163.063471,925.449293 L 165.119031,939.830082 L 170.257989,942.398086 L 170.771894,954.210871 L 178.643179,954.960093" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 163.623326,716.942994 L 159.140290,710.018666 L 164.664586,696.905964 L 154.306516,678.272161 L 147.401115,681.722883 L 148.782220,691.384863 L 134.971419,699.666530 L 119.089022,687.244015 L 109.421473,694.835555 L 111.493100,704.497535 L 121.851170,714.849641 L 110.111995,726.582060 L 99.063403,713.469358 L 85.943124,717.610206 L 81.109350,727.962343 L 79.037723,736.244040 L 70.060727,735.553883 L 68.679653,746.596146 L 74.203949,753.497560 L 74.203949,772.821520 L 56.460442,785.485620 L 55.449977,798.614663 L 41.302862,807.703977 L 40.195233,822.525486 L 45.334192,823.039057 L 47.389782,837.419876 L 55.944772,837.971484" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 184.797015,1060.986531 L 192.983222,1058.648975 L 207.601397,1062.739705 L 214.618141,1069.752403 L 218.126529,1075.596307 L 213.448709,1083.193386 L 215.202857,1087.868497 L 225.727959,1080.855800 L 236.253091,1063.908498 L 243.854521,1053.389452 L 244.439237,1039.948469 L 254.964369,1032.351391 L 256.133801,1013.066503 L 259.642189,1001.963076 L 269.582544,995.534790 L 283.977726,993.744948" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,754.879973 559.504716,754.879973" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 509.296612,754.879973 530.288664,754.879973" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 455.506267,853.759578 455.506267,876.724113" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 442.066897,853.759578 442.066897,876.724113" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 654.985908,853.759578 654.985908,876.724113" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 641.546538,853.759578 641.546538,876.724113" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 612.677207,1010.738868 601.333655,1015.152827" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 596.971244,984.200155 596.971244,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,995.503752 596.971244,995.503752" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,984.200155 596.971244,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,995.503749 A 5.651795,5.651795 -0.000000 0 0 601.135341,984.200158" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,1007.675796 596.971244,1007.675796" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,1007.675811 A 17.823858,17.823858 -0.000000 0 0 601.135341,972.028095" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.135341,972.028080 596.971244,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 559.398484,1006.154287 571.358126,1006.154287" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 559.397754,997.025231 571.358126,997.025231" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 559.397754,997.025234 C 559.270950,996.462395 559.120129,995.907936 558.945316,995.365038 C 557.695665,991.484149 555.272351,988.260344 552.430501,986.287510 C 549.588652,984.314677 546.381086,983.524559 543.252867,983.874620 C 540.124649,984.224680 536.998175,985.749163 534.478758,988.417268 C 532.377057,990.643005 530.757101,993.679867 529.979286,997.025234" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 571.358138,997.025235 A 29.561685,26.993543 90.000000 0 0 518.018500,997.025235" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 518.018482,1006.154287 529.990661,1006.154287" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 518.018482,997.025231 529.979280,997.025231" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 529.990661,1006.154281 C 530.382800,1007.876118 530.988581,1009.522259 533.645705,1014.472352 C 533.645705,1014.472352 536.469548,1017.012452 541.181350,1019.029041 C 541.181350,1019.029041 542.936341,1019.385040 544.688307,1019.385040 C 547.397989,1019.385040 550.130244,1018.530091 552.573866,1016.791238 C 555.401658,1014.779013 557.796525,1011.517849 559.007537,1007.617724 C 559.156544,1007.137841 559.286859,1006.649305 559.398499,1006.154281" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 518.018500,1006.154282 A 29.561685,26.993543 90.000000 0 0 571.358138,1006.154282" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 424.487865,984.403276 430.573902,993.426739" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 407.390421,1009.752808 413.476459,1018.776271" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 418.982162,992.566326 425.068199,1001.589759" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 412.896125,1001.589759 418.982162,1010.613222" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 381.901367,1006.154287 393.861008,1006.154287" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 381.900606,997.025231 393.861008,997.025231" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 381.900623,997.025234 C 381.773819,996.462395 381.622998,995.907936 381.448184,995.365038 C 380.198533,991.484149 377.775220,988.260344 374.933370,986.287510 C 372.091520,984.314677 368.883955,983.524559 365.755736,983.874620 C 362.627517,984.224680 359.501044,985.749163 356.981627,988.417268 C 354.879926,990.643005 353.259970,993.679867 352.482155,997.025234" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 393.860990,997.025235 A 29.561685,26.993543 90.000000 0 0 340.521352,997.025235" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 340.521364,1006.154287 352.493513,1006.154287" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 340.521364,997.025231 352.482162,997.025231" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 496.336031,1018.558787 496.336031,1030.725749" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 496.336026,1030.725738 A 29.561685,26.993543 90.000000 0 0 511.705022,1021.523281" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 496.336018,1018.558786 C 497.480466,1018.134685 498.595971,1017.546292 499.657053,1016.791238 C 501.002458,1015.833863 502.249864,1014.593771 503.318394,1013.136657" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 487.206975,1018.558270 487.206975,1030.725749" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 487.206971,984.623849 C 485.175768,985.377990 483.235006,986.645469 481.561946,988.417268 C 479.042529,991.085373 477.215382,994.919069 476.701327,999.052536 C 476.187272,1003.186003 477.007441,1007.539467 478.868166,1011.005910 C 480.728892,1014.472352 483.552736,1017.012452 486.575603,1018.306199 C 486.785087,1018.395855 486.995587,1018.479868 487.206971,1018.558258" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 487.206980,972.453779 A 29.561685,26.993543 90.000000 0 0 487.206980,1030.725738" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 503.318511,990.042750 511.705010,981.656252" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 503.318389,1013.136675 511.705010,1021.523296" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 503.318510,990.042742 C 502.211980,988.534759 500.913617,987.259350 499.513689,986.287510 C 498.494650,985.580085 497.428586,985.024736 496.336018,984.619502" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 511.705022,981.656237 A 29.561685,26.993543 90.000000 0 0 496.336026,972.453779" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 496.336031,972.453798 496.336031,984.619513" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 487.206975,972.453798 487.206975,984.623865" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 352.493530,1006.154281 C 352.885669,1007.876118 353.491450,1009.522259 356.148573,1014.472352 C 356.148573,1014.472352 358.972417,1017.012452 363.684219,1019.029041 C 363.684219,1019.029041 365.439209,1019.385040 367.191176,1019.385040 C 369.900858,1019.385040 372.633112,1018.530091 375.076734,1016.791238 C 377.904527,1014.779013 380.299394,1011.517849 381.510406,1007.617724 C 381.659412,1007.137841 381.789728,1006.649305 381.901368,1006.154281" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 413.476459,1018.776271 405.129763,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 418.982162,1010.613222 432.834531,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 425.068199,1001.589759 445.006605,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 407.390421,1009.752808 392.957719,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 646.164836,988.764683 633.992761,988.764683" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 592.406716,1031.151468 580.234672,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 612.677207,1010.738868 620.620033,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 601.333655,1015.152827 607.558941,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 405.129763,972.028080 392.957719,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 405.129763,1031.151468 392.957719,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 445.006605,972.028080 430.573902,993.426739" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 432.834531,972.028080 424.487865,984.403276" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 444.743414,972.028080 432.834531,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 445.006605,1031.151468 432.834531,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 596.971244,1007.675796 596.971244,995.503752" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 405.129763,972.028080 418.982162,992.566326" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 392.957719,972.028080 412.896125,1001.589759" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 340.521352,1006.154282 A 29.561685,26.993543 90.000000 0 0 393.860990,1006.154282" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 592.406716,1031.151468 592.406716,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 580.234672,1031.151468 580.234672,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 592.406716,972.028080 580.234672,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 620.620033,1031.151468 607.558941,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 456.915459,1031.151468 456.915459,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 444.743414,1031.151468 444.743414,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 456.915459,972.028080 444.743414,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 456.915459,1031.151468 444.743414,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 624.034422,972.028080 624.034422,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,995.503752 699.929681,1007.675796" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,1018.979393 699.929681,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 679.470371,1007.675796 679.470371,995.503752" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 674.905843,1031.151468 662.733799,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 679.470371,984.200155 679.470371,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 674.905843,972.028080 662.733799,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 656.123175,984.200155 624.034422,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 656.123175,972.028080 624.034422,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 646.164836,1031.151468 633.992761,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 656.123175,972.028080 656.123175,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 646.164836,1031.151468 646.164836,988.764683" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 633.992761,1031.151468 633.992761,988.764683" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 662.733799,1031.151468 662.733799,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 674.905843,1031.151468 674.905843,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 679.470371,1031.151468 679.470371,1018.979393" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,984.200155 679.470371,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,1007.675796 679.470371,1007.675796" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,995.503752 679.470371,995.503752" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,1018.979393 679.470371,1018.979393" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,972.028080 679.470371,972.028080" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,1031.151468 679.470371,1031.151468" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 699.929681,972.028080 699.929681,984.200155" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 387.206535,788.994068 387.206535,814.492648" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 387.206519,788.994070 A 637.657854,637.657854 -0.000000 0 0 291.653663,794.087720" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 387.206546,814.492639 A 633.841687,633.841687 -0.000000 0 0 291.714406,819.128706" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 291.714400,819.128711 A 26.474534,26.474534 -0.000000 0 0 281.655064,866.582642" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 291.653680,794.087715 A 49.436864,49.436864 -0.000000 0 0 272.735037,864.539567" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 330.439509,981.957602 330.439509,1010.256245" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 256.908485,920.362540 A 81.779954,81.779954 -0.000000 0 0 330.439504,981.957602" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 281.655063,866.582637 A 46.522759,46.522759 -0.000000 0 0 256.908478,920.362532" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 272.735016,864.539584 A 61.910291,61.910291 -0.000000 0 0 242.851060,925.765605" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 242.851078,925.765579 A 96.146636,96.146636 -0.000000 0 0 330.439498,1010.256229" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 556.540495,797.032767 A 8.810727,8.810727 -0.000000 0 0 555.572396,779.607230" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,779.607238 541.486272,754.879973" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 530.288664,869.639236 509.296612,869.639236" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,845.824328 541.486272,869.639236" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,845.824328 561.829674,845.824328" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829690,834.088767 A 28.679150,28.679150 -0.000000 0 0 582.173102,822.590229" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829687,869.639232 A 40.294610,40.294610 -0.000000 0 0 582.173099,822.590250" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829674,869.639236 541.486272,869.639236" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829674,834.088775 561.829674,845.824328" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,797.032780 556.540512,797.032780" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,779.607238 555.572406,779.607238" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 541.486272,822.590242 541.486272,797.032780" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829674,822.590242 541.486272,822.590242" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 561.829702,822.590254 A 35.967363,35.967363 -0.000000 0 0 559.504728,754.879996" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 641.546538,754.879973 641.546538,777.844509" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 654.985908,754.879973 654.985908,777.844509" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 641.546533,754.879993 A 58.571679,58.571679 -0.000000 0 0 594.810779,815.802054" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 641.546543,777.844509 A 33.684878,33.684878 -0.000000 0 0 615.871475,815.802043" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 673.464242,792.746166 A 29.354912,29.354912 -0.000000 0 0 654.985897,777.844517" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 673.464243,792.746171 689.638192,777.172945" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 689.638204,777.172956 A 43.824523,43.824523 -0.000000 0 0 654.985912,754.879999" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 654.985912,876.724118 A 43.824523,43.824523 -0.000000 0 0 689.638204,854.431161" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 673.464243,838.857915 689.638192,854.431141" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 654.985897,853.759570 A 29.354912,29.354912 -0.000000 0 0 673.464242,838.857920" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 615.871475,815.802044 A 33.684878,33.684878 -0.000000 0 0 641.546543,853.759577" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 594.810779,815.802032 A 58.571679,58.571679 -0.000000 0 0 641.546533,876.724093" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 530.288664,754.879973 530.288664,869.639236" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 509.296612,754.879973 509.296612,869.639236" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 395.331139,815.802032 A 58.571679,58.571679 -0.000000 0 0 442.066892,876.724093" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 416.391834,815.802044 A 33.684878,33.684878 -0.000000 0 0 442.066903,853.759577" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 455.506287,853.759570 A 29.354912,29.354912 -0.000000 0 0 473.984632,838.857920" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 473.984633,838.857915 490.158581,854.431141" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 455.506271,876.724118 A 43.824523,43.824523 -0.000000 0 0 490.158563,854.431161" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 490.158563,777.172956 A 43.824523,43.824523 -0.000000 0 0 455.506271,754.879999" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 473.984633,792.746171 490.158581,777.172945" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 473.984632,792.746166 A 29.354912,29.354912 -0.000000 0 0 455.506287,777.844517" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 442.066903,777.844509 A 33.684878,33.684878 -0.000000 0 0 416.391834,815.802043" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 442.066892,754.879993 A 58.571679,58.571679 -0.000000 0 0 395.331139,815.802054" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 455.506267,754.879973 455.506267,777.844509" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 442.066897,754.879973 442.066897,777.844509" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 15.215093,1023.621670 15.215093,745.705972" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 0.000000,1023.621670 0.000000,745.705972" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 15.215093,1023.621670 A 83.682922,83.682922 -0.000000 0 0 98.898015,1107.304592" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 98.898015,662.023050 A 83.682922,83.682922 -0.000000 0 0 15.215093,745.705972" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M -0.000000,1023.621670 A 98.898015,98.898015 -0.000000 0 0 98.898015,1122.519685" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    <path d="M 98.898015,646.807957 A 98.898015,98.898015 -0.000000 0 0 -0.000000,745.705972" style="stroke:#000000;stroke-width: 5px;fill:none"/>
    </g>
    </svg>`;
}
