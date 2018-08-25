const K = 10;
const K2 = 0.000001;
const {sqrt, max, sign, abs, min, pow} = Math;
const sqr = x => x*x;
const RESIST = 0.5;

const DT = 1;

let id = 0;

const normalize = ( ([x, y], len) => [x/len,y/len] );
const length = ([x, y]) => sqrt(sqr(x) + sqr(y));

export default class Node {

    constructor( area, { key, mass, speed, pos: [x, y] }, axis = false ) {
        this.id = id++;
        this.key = key;
        this.area = area;
        this._mass = mass;
        this.speed = [...speed];
        this.acc = [0, 0];
        this.pos = [x, y];
        this.children = [];
        this.axis = axis;
    }

    static tie(a, b) {
        a.add(b);
        b.add(a);
    }

    add(...children) {
        this.children.push( ...children );
    }

    set mass(value) {
        this._mass = value;
    }

    get mass() {
        return this._mass;
    }

    update() {

        if(this.axis) return;

        let repulsive  = this.area.reduce( ([vx, vy], node) => {
            if(node !== this) {

                const {mass, pos: [x, y]} = node;

                const dt = [ - (x - this.pos[0]), - (y - this.pos[1]) ];
                const len = length(dt);
                const r = max( len, 2);
                const n = K * pow(mass * this.mass, 4) / pow(r, 6);

                const base = [ dt[0] / r, dt[1] / r ];

                return [vx + base[0] * n, vy + base[1] * n];

            }
            else {
                return [vx, vy];
            }
        }, [0, 0]);


        let len = length(repulsive);
        let base = normalize(repulsive, len);
        len = min(15, length(repulsive));
        repulsive = [
            base[0] * len,
            base[1] * len
        ];

        this.repulsive = repulsive;


        let gravity = this.children.reduce( ([ vx, vy ], node) => {

            const {mass, pos: [x, y]} = node;

            const dt = [ x - this.pos[0], y - this.pos[1]];
            const len = length(dt);
            const r = max( len, 2);
            const t = K2 * r * r * r;

            const base = [ dt[0] / r, dt[1] / r ];

            return [vx + base[0] * t, vy + base[1] * t];

        }, [0, 0] );

        len = length(gravity);
        if(len) {
            base = normalize(gravity, len);
            len = min(15, length(gravity));
            gravity = [
                base[0] * len,
                base[1] * len
            ];
        }
        else {
            gravity = [ 0, 0 ];
        }




        this.acc = [
            (repulsive[0] + gravity[0] - this.speed[0] * RESIST) / this.mass,
            (repulsive[1] + gravity[1] - this.speed[1] * RESIST) / this.mass,
        ];

        if(isNaN(this.acc[0])) {
debugger;
        }

        //if(abs(this.acc[0]) < 0.15) this.acc[0] = 0;
        //if(abs(this.acc[1]) < 0.15) this.acc[1] = 0;

        this.speed = [
            this.speed[0] + this.acc[0] * DT,
            this.speed[1] + this.acc[1] * DT,
        ];

        if(abs(this.speed[0]) < 0.1) this.speed[0] = 0;
        if(abs(this.speed[1]) < 0.1) this.speed[1] = 0;

        this.pos = [
            this.pos[0] + this.speed[0] * DT + this.acc[0] * sqr(DT) / 2,
            this.pos[1] + this.speed[1] * DT + this.acc[1] * sqr(DT) / 2
        ];

    }

}