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

    constructor( area, { key, round = 0 } ) {
        this.obs = [];
        this.item = [];
        this._round = round;
        this.minRadius = 200;
        this.key = key;
        this._segment = 0;
        area.push( this );
        this.area = area;
        this.pos = [0, 0];
        this.mass = 50;
        this.firstChild = this;
        this.lastChild = this;
        this.angle = 0;
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

        const last = this.area.extreme;

        const firstChildIndex = last.indexOf( this.firstChild );
        const lastChildIndex = last.indexOf( this.lastChild );


        /**
         *  Периметр правильного мноугоугольника,
         *  вписанного в опружность R, с количетсвом сторон n
         *  P = na = 2nR sin( PI / n )
         */

        const count = this.area.filter( node => node.round === this.round ).length;

        let radius;
        let minAngle;

        if(count > 3) {
            radius = max( this.minRadius * this.round,
                count * this.mass * DELTA_REQ / 2 /count / sin( PI / count )
            );
        }
        else {
            radius = this.minRadius * this.round;
        }

        if(count > 1) {
            minAngle = asin(this.mass * DELTA_REQ / 2 / radius) * 2;
        }
        else {
            minAngle = 0;
        }

        let angle;

        if(this.item.length) {
            angle = this.item[0].angle + (this.item.slice(-1)[0].angle - this.item[0].angle) / 2;
        }
        else {
            angle = - (count - 1) * minAngle / 2 + minAngle * (firstChildIndex + (lastChildIndex - firstChildIndex) / 2);
        }

        this.angle = angle;

        const req = [
            cos( angle - PI/2 ) * radius,
            - sin( angle - PI/2 ) * radius
        ];

        if(this.key === "a") {
           // debugger;
        }

        const cur = this.pos;
        const dt = [
            req[0] - cur[0],
            req[1] - cur[1],
        ];

        const normalized = norm( [cur, req] );

        this.pos = [
            abs(dt[0]) > speed ? cur[0] + normalized[0] * speed : req[0],
            abs(dt[1]) > speed ? cur[1] + normalized[1] * speed : req[1],
        ];

    }

}