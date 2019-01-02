import { NodeModel as Node, NodeView } from  "../src"
import svg from "../src/svg"
import Area from "../src/area"

const area = new Area();

window.area = area;

const a = new Node( area, { key: "a" } );

const b = new Node( area, { key: "b" } );
a.insert(b);

const c = new Node( area, { key: "c" } );
a.insert(c);

setTimeout( () => {

    const l = new Node( area, { key: "l" } );
    a.insert(l);

}, 5000 );


const d = new Node( area, { key: "d" } );
a.insert(d);

const e = new Node( area, { key: "e" } );
a.insert(e);

const f = new Node( area, { key: "f" } );
a.insert(f);


const g = new Node( area, { key: "g" } );
f.insert(g);

const h = new Node( area, { key: "h" } );
f.insert(h);

const i = new Node( area, { key: "i" } );
c.insert(i);

setTimeout( () => {

    const j = new Node( area, { key: "j" } );
    c.insert(j);

    setTimeout( () => {

        const k = new Node( area, { key: "k" } );
        a.insert(k);

        setTimeout( () => {

            Array(25).fill(0).map( (_, index)=> {
                j.insert(new Node( area, { key: "m"+index } ));
            } );

        }, 2500 );

    }, 2500 );

}, 2500 );


(function frame() {
    requestAnimationFrame( frame );
    area.update();
    area.map( area => area.update() );
})();


window.addEventListener("load", () => {

    const scenes = {};

    const scene = svg( "svg", { viewBox: "-150 -150 300 300" },

        //svg( "ellipse", { "rx": 45, "ry": 45, cx: "0", cy: "0", fill: "none", stroke: "#000" } ),
        //svg( "ellipse", { "rx": 70, "ry": 70, cx: "0", cy: "0", fill: "none", stroke: "#000" } ),

        scenes.lines = svg( "g" ),
        scenes.units = svg( "g" ),
    );

    document.body.append( scene );

    const views = [];

    setTimeout(function frame() {
        setTimeout( frame, 2000 );

        area.map( model => {
            if(!views.find( view => view.model === model ))  {
                const view = new NodeView(model, scenes);
                views.push( view );
                scenes.units.append( view.g );
            }
        } );

        views.map( view => view.paint() );
    }, 2000);

});