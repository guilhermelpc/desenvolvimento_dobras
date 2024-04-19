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
        this.limComprPprScl = 40;

        this.bigger = (this.angulo<180) ? 0 : 1;
        const angAbertura = 2 * Math.PI - this.angulo * Math.PI / 180 + 1e-5;
        const angPonto = (Math.PI - angAbertura) / 2;
        this.startY = this.cY - this.rExtPaperScale * Math.sin(angPonto);
        this.startX = this.cX + this.rExtPaperScale * Math.cos(angPonto);
        this.endX = this.cX - this.rExtPaperScale * Math.cos(angPonto);
        this.startYIn = this.cY - this.rIntPaperScale * Math.sin(angPonto);
        this.startXIn = this.cX + this.rIntPaperScale * Math.cos(angPonto);
        this.endXIn = this.cX - this.rIntPaperScale * Math.cos(angPonto);

        this.distBetweenViews = 35;
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

class textElement {
    constructor(text, coordsObj, parentElement, textHeight=4.5) {
        this.text = text;
        this.coords = coordsObj;
        this.parentElement = parentElement;
        this.textHeight = textHeight;
        this.content = createSvgElement("text", {x:this.coords.x, y:this.coords.y, 'font-size':this.textHeight}, this.parentElement);
    }
    render() {
        this.content.textContent = this.text;
    }
}

// Dev environment testing:
testFolha = false;
if (window.location.port.includes('5500')) {
    testFolha = true;
    draw(6.3, 400, 270, 4000);
    // draw(100, 350, 90, 4000);
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
    const viewBox = `0 0 ${folhaWidth} ${folhaHeight}`;
    let scaleMmMm = 57 / dext;
  
    // Posição vista 1:
    let cX = 68.7;
    let cY = 71.7;

    // SVG Std Styles:
    let stdLineWidth = 0.3;
    let stdTextHeight = 4.5;
    const arrowSize = 1.15 * stdTextHeight;
    // SVG Element:
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defsElement = svgElement.querySelector('defs') || createSvgElement('defs', {}, svgElement);
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", viewBox);
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
    // const textTop = createSvgElement("text", {x: 31.6, y: 20, 'font-size': stdTextHeight}, svgElement)
    // textTop.textContent = "Dimensões em milímetros"

    // Desenho do arco:
    let arc1 = new arcOutLine(dext, esp, angulo, cY, cX, svgElement, scaleMmMm, comprimento);
    arc1.createArc();
    arc1.createCenterMarkFront();
    arc1.createDimLines();

    // Folha:
    if (checkBoxIn.checked || testFolha) {
        const folhaElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        folhaElement.innerHTML = returnCBCPaper();
        svgElement.appendChild(folhaElement);
        testFolha = false;
    }

    // Texto:
    // let txtQtd = new textElement();

    // Renderização dependende da informação do comprimento:
    if (comprimento != null) {
        arc1.createSideView(comprimento);

        let txtDesenv = new textElement(`Desenvolvimento:  ${esp.toFixed(2)}  x  ${comprimento.toFixed(1)} x (${desenvolvimento(esp, dext, angulo).toFixed(1)} + sobremetal)`,{x:38, y:170}, svgElement);
        txtDesenv.render();
    }

    return svgElement.outerHTML;
}

function createDimLine(xyObj, distance, parentElement, textHeight, scale, text = "", align="aligned", color="grey", strokeWidth="0.3", override="") {
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
        let textLen = ("" + dimensionTxt).length * digitLen;
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
        if (cotaPaperScale < textLen + 3) { // Texto por fora da cota
            let leftArrow = [xyObj.x1 - 10, refY - distance + offset, xyObj.x1, refY - distance + offset, "grey"];
            let rightArrow = [xyObj.x2 + 15, refY - distance + offset, xyObj.x2, refY - distance + offset, "grey"];
            const arrowLinesCoords = [ leftArrow,rightArrow, ];  
            for (const line of arrowLinesCoords) {
                createSvgElement("polyline", 
                    {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: color, "stroke-width": strokeWidth,
                     "marker-end": "url(#arrowheadright)"}, parentElement);
            }
            // Text 
            const textElem = createSvgElement("text", {x: `${xyObj.x2 + 5}`, y: refY - distance + offset - 2, 'font-size': `${textHeight}px`}, parentElement);
            textElem.textContent = dimensionTxt;

        } else { // Texto por dentro da cota
            let leftArrow = [xyObj.x2 - cotaPaperScale/2, refY - distance + offset, xyObj.x1, refY - distance + offset, "grey"];
            let rightArrow = [xyObj.x2 - cotaPaperScale/2, refY - distance + offset, xyObj.x2, refY - distance + offset, "grey"];
            const arrowLinesCoords = [ leftArrow,rightArrow, ];  
            for (const line of arrowLinesCoords) {
                createSvgElement("polyline", 
                    {points: `${line[0]},${line[1]},${line[2]},${line[3]}`, stroke: color, "stroke-width": strokeWidth,
                     "marker-end": "url(#arrowheadright)"}, parentElement);
            }
            // Text 
            const textElem = createSvgElement("text", {
                x: `${xyObj.x2 - cotaPaperScale/2 - dimensionTxt.length*2.5/2}`, y: refY - distance + offset - 2, 'font-size': `${textHeight}px`
            }, parentElement);
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


