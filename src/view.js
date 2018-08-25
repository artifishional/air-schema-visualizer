const svg = (type, { style = {}, text, class: className, ...attr } = {}, ...nodes) => {
    const src = document.createElementNS("http://www.w3.org/2000/svg", type);
    className && (src.className.baseVal = className);
    if(text) {
        if(text.split("\n").length > 1) {
            text.split("\n").map( (text, i, arr) => src.append( svg( "tspan", { text, x: 0, dy: !i ? "-0.5em" : "1.1em" } ) ) );
        }
        else {
            src.textContent = text;
        }
    }
    Object.keys(style).map( key => src.style[key] = attr[key] );
    Object.keys(attr).map( key => src.setAttribute(key, attr[key]) );
    nodes.filter(n=>n).map( ch => src.append(ch) );
    return src;
};

export default class Node {

    constructor(model) {
        this.model = model;
        this.g = svg("g", { },
            this.ellipse = svg( "ellipse", { rx: 50, ry: 50, fill: "#0026ff" } ),
            svg( "text", { fill: "#fff", "alignment-baseline": "middle", "text-anchor": "middle", text: model.axis ? "O" : model.key } )
        );
    }

    paint() {
        if(this.model.axis) this.ellipse.setAttribute("fill", "#26aaff");
        this.ellipse.setAttribute("rx", this.model.mass);
        this.ellipse.setAttribute("ry", this.model.mass);
        const [x, y] = this.model.pos;
        this.g.setAttribute( "transform", `translate(${x|0},${y|0})` );
    }

}