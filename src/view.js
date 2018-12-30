import svg from "./svg"

export default class Node {

    constructor(model, scene) {
        this.model = model;
        this.scene = scene;
        this.g = svg("g", { },
            this.ellipse = svg( "ellipse", { rx: 50, ry: 50, fill: "#0026ff" } ),
            svg( "text", { fill: "#fff", "alignment-baseline": "middle", "text-anchor": "middle", text: model.axis ? "O" : model.key } )
        );
        this._links = [];
    }

    get links() {
        const added =
            new Array(this.model.item.length - this._links.length)
                .fill(0)
                .map( () => svg( "line", { style: { stroke: "#0026ff", strokeWidth: 2 } } ) );
        this._links.push( ...added );
        this.scene.lines.append( ...added );
        return this._links;
    }

    paint() {

        const [x, y] = this.model.pos;

        this.links.map( (link, i) => {
            link.setAttribute( "x1", x );
            link.setAttribute( "y1", y );
            link.setAttribute( "x2", this.model.item[i].pos[0] );
            link.setAttribute( "y2", this.model.item[i].pos[1] );
        } );

        if(this.model.axis) this.ellipse.setAttribute("fill", "#26aaff");
        this.ellipse.setAttribute("rx", this.model.mass);
        this.ellipse.setAttribute("ry", this.model.mass);

        this.g.setAttribute( "transform", `translate(${x|0},${y|0})` );
    }

}