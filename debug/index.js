import { NodeModel as Node, NodeView } from  "../src"
import svg from "../src/svg"
const { max } = Math;

function lasted(exist, vertex) {
    if(vertex.item.length) {
        return vertex.item.reduce( lasted, exist );
    }
    return [ ...exist, vertex ];
}

class Area extends Array {

    constructor() {
        super();
        this.extreme = [];
        this.maxRound = 0;
    }

    update() {
        this.extreme = lasted( [], this[0] );
        this.maxRound = max( ...this.extreme.map( ({ round }) => round ) );
    }

}

const area = new Area();

window.area = area;

const a = new Node( area, { key: "a" } );


const b = new Node( area, { key: "b" } );
a.insert(b);

const c = new Node( area, { key: "c" } );
a.insert(c);

const d = new Node( area, { key: "d" } );
c.insert(d);

const e = new Node( area, { key: "e" } );
c.insert(e);

const f = new Node( area, { key: "f" } );
c.insert(f);

const g = new Node( area, { key: "g" } );
c.insert(g);

const h = new Node( area, { key: "h" } );
b.insert(h);

const i = new Node( area, { key: "i" } );
b.insert(i);

const j = new Node( area, { key: "j" } );
e.insert(j);

const k = new Node( area, { key: "k" } );
e.insert(k);

const l = new Node( area, { key: "l" } );
a.insert(l);

const m = new Node( area, { key: "m" } );
l.insert(m);

const n = new Node( area, { key: "n" } );
a.insert(n);

const o = new Node( area, { key: "o" } );
n.insert(o);


(function frame() {
    requestAnimationFrame( frame );
    area.update();
    area.map( area => area.update() );
})();


window.addEventListener("load", () => {

    const scenes = {};

    const scene = svg( "svg", { viewBox: "-1000 -1000 2000 2000" },
        scenes.lines = svg( "g" ),
        scenes.units = svg( "g" ),
    );

    document.body.append( scene );

    const views = [];

    (function frame() {
        requestAnimationFrame( frame );

        area.map( model => {
            if(!views.find( view => view.model === model ))  {
                const view = new NodeView(model, scenes);
                views.push( view );
                scenes.units.append( view.g );
            }
        } );

        views.map( view => view.paint() );
    })();

});