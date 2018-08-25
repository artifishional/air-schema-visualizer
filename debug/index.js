import { NodeModel, NodeView } from  "../src"


const area = [];
/*
const v1 = new NodeModel( area, { key: "v1", mass: 100, speed: [ 1, 1 ], pos: [10, 10] } );

const v3 = new NodeModel( area, { key: "v3", mass: 50, speed: [ -1, 1 ], pos: [-50, -30] } );




NodeModel.tie( v1, v3 );
NodeModel.tie( v5, v3 );

area.push( v1, v2, v3, v4, v5, v6 );
*/
const axis = new NodeModel( area, { key: "axis", mass: 100, speed: [ 0, 0 ], pos: [0, 0] }, true );

const v1 = new NodeModel( area, { key: "v1", mass: 70, speed: [ 1, 1 ], pos: [10, 10] } );
const v3 = new NodeModel( area, { key: "v3", mass: 70, speed: [ -1, 1 ], pos: [-50, -30] } );
const v2 = new NodeModel( area, { key: "v2", mass: 70, speed: [ -1, 1 ], pos: [-30, -10] } );
const v4 = new NodeModel( area, { key: "v4", mass: 50, speed: [ 1, 1 ], pos: [70, 15] } );

const v5 = new NodeModel( area, { key: "v5", mass: 50, speed: [ -1, 1 ], pos: [-90, -90] } );
const v6 = new NodeModel( area, { key: "v6", mass: 50, speed: [ -1, 1 ], pos: [-110, -30] } );

const v7 = new NodeModel( area, { key: "v7", mass: 70, speed: [ -1, 1 ], pos: [-50, -30] } );
const v8 = new NodeModel( area, { key: "v8", mass: 50, speed: [ -1, 1 ], pos: [-50, -30] } );

const v9 = new NodeModel( area, { key: "v9", mass: 70, speed: [ 1, -1 ], pos: [-10, -80] } );

const v10 = new NodeModel( area, { key: "v10", mass: 50, speed: [ -1, 1 ], pos: [-30, -10] } );
const v11 = new NodeModel( area, { key: "v11", mass: 70, speed: [ 1, 1 ], pos: [70, 15] } );

const v12 = new NodeModel( area, { key: "v12", mass: 50, speed: [ -1, 1 ], pos: [-30, -10] } );
const v13 = new NodeModel( area, { key: "v13", mass: 50, speed: [ 1, 1 ], pos: [70, 15] } );

const v14 = new NodeModel( area, { key: "v14", mass: 50, speed: [ 0, 0 ], pos: [0, 0] } );

window.v14 = v14;

//NodeModel.tie( axis, v1 );
//NodeModel.tie( axis, v1 );

NodeModel.tie( v1, v3 );
NodeModel.tie( v1, v2 );

NodeModel.tie( v2, v4 );
NodeModel.tie( v2, v5 );

NodeModel.tie( v3, v6 );
NodeModel.tie( v3, v7 );


NodeModel.tie( v7, v8 );
NodeModel.tie( v7, v9 );

NodeModel.tie( v9, v10 );
NodeModel.tie( v9, v11 );

NodeModel.tie( v11, v12 );
NodeModel.tie( v11, v13 );

area.push( axis, v1, v3, v2, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13 );

window.push = function() {

    area.push(v14);
    NodeModel.tie( v3, v14 );

};

window.area = area;

area.map( node =>  NodeModel.tie(axis, node) );

(function frame() {
    requestAnimationFrame( frame );
    area.map( area => area.update() );
})();


window.addEventListener("load", () => {

    const views = [];

    (function frame() {
        requestAnimationFrame( frame );

        area.map( model => {
            if(!views.find( view => view.model === model ))  {
                const view = new NodeView(model);
                views.push( view );
                document.querySelector("svg").append( view.g );
            }
        } );

        views.map( view => view.paint() );
    })();

});