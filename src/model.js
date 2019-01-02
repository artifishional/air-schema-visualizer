const AXIS = { x: 0, y: 0 };
const DELTA_REQ = 2.5;
const speed = 5;

const { pow, sqrt, abs, cos, sign, sin, PI, asin, max } = Math;

function len([x0, y0], [x, y]) {
    return sqrt( pow(x-x0, 2) + pow(y-y0, 2) )
}

function norm( [ [x0, y0], [ x, y ] ] ) {
    const length = len( [x0, y0], [ x, y ] );
    return [(x - x0) / length, (y - y0) / length];
}

export default class Node {

    constructor( area, { key, round = 0, head = false } ) {
        this.obs = [];
        this.item = [  ];
        this.isHead = head;
        this._round = round;
        this.startMass = 0;
        this.key = key;
        this._segment = 0;
        area.push( this );
        this.area = area;
        this.mass = 50;
        this.firstChild = this;
        this.lastChild = this;
        /*if(!head) {
            this.insert( new Node( area, { key, round: round +1, head: true } ) );
        }*/
    }

    head() {
        let parent = null;
        while (this.parent) {
            parent = this.parent;
        }
        return parent;
    }

    insert( node ) {
        node.parent = this;
        node.on( this );
        if(!this.item.length) {
            this.firstChild = node.firstChild;
        }
        this.lastChild = node.lastChild;
        this.item.push( node );
        node.round = this._round + 1;
    }

    set firstChild( value ) {
        if(value === this._firstChild) { return; }
        this._firstChild && this._firstChild.off( this );
        this._firstChild = value;
        this._firstChild.on( this );
        this.emt( { type: "firstNodeChanged", src: this }  );
    }

    get firstChild( ) {
        return this._firstChild;
    }

    set lastChild( value ) {
        if(value === this._lastChild) { return; }
        this._lastChild && this._lastChild.off( this );
        this._lastChild = value;
        this._lastChild.on( this );
        this.emt( { type: "lastChildChanged", src: this } );
    }

    get lastChild( ) {
        return this._lastChild;
    }

    emt( evt ) {
        this.obs.map( obs => obs.handle(evt) );
    }

    handle( { type, src } ) {
        if(type === "firstChildChanged") {
            this.fisrtChild = src.fisrtChild;
        }
        else if(type === "lastChildChanged") {
            this.lastChild = src.lastChild;
        }
    }

    on(obs) {
        this.obs.push( obs );
    }

    off(obs) {
        this.obs.splice( this.obs.indexOf(obs), 1 );
    }

    get segment() {
        return this._segment;
    }

    set segment(value) {
        this._segment = value;
    }

    set round(value) {
        this._round = value;
        this.item.map( nd => nd.round = value + 1 );
    }

    get round() {
        return this._round;
    }

    update() {

        if(this.item.length) {
            this.mass = this.item.reduce( (acc, { mass }) => acc + mass, 0 );
        }
        else {
            this.mass = 1;
        }

        if(this.parent) {
            this.startMass =
                this.parent.item
                    .slice(0, this.parent.item.indexOf( this ))
                    .reduce( (acc, { mass }) => acc + mass, this.parent.startMass )
        }
        else {
            this.startMass = 0;
        }

    }

}