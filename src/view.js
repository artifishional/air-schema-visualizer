import svg from "./svg"
const { PI, random } = Math;
const ROUND_WIDTH = 20;
const SPEED = 0.05;
import * as d3 from "d3"

let EN_COUNTERED = 0;

const COLORS = {};

function gcolor({ key }) {
    COLORS[key] = COLORS[key] || `rgb(${random()*256|0},${random()*256|0},${random()*256|0})`;
    return COLORS[key];
}

export default class Node {

    tween(arc, startAngle, endAngle) {
        return (d) => {
            const iStartAngle = d3.interpolate(d.startAngle, startAngle);
            const iEndAngle = d3.interpolate(d.endAngle, endAngle);
            return (t) => {
                d.startAngle = iStartAngle(t);
                d.endAngle = iEndAngle(t);
                return arc(d);
            };
        };
    }

    constructor(model, scene) {
        this.model = model;

        const color = gcolor(model);

        this.g = svg("g", { },

            this.path = svg( "path", { fill: color } ),

            svg("defs", {},
                this.path2 = svg( "path", {
                    stroke: "#000", strokeWidth: 2, id: "ID" + ++EN_COUNTERED, fill: "#000"
                } ),
            ),

            svg( "text", { },
                this.text = svg( "textPath", {
                    dy: -200,
                    side: "left",
                    style: { textAnchor: "middle" },
                    startOffset: "75%",
                    text: this.model.key,
                    href: "#ID" + EN_COUNTERED,
                }),
            ),
        );

        this.animate = d3
            .select(this.path)
            .datum({ endAngle: 0, startAngle: 0 });

        this.animate2 = d3
            .select(this.path2)
            .datum({ endAngle: 0, startAngle: 0 });

        this.__arc = d3.arc()
            .padAngle(0.01)
            .cornerRadius(2);

        this.__arc2 = d3.arc();

    }

    paint() {
/*
        if(!this.model.isHead && this.model.item.length < 2) {
            return;
        }
*/

        if(this.model.item.length) {
            this.text.textContent = this.model.key;
        }
        else {
            this.text.textContent = this.model.key.substring(0, 2);
        }

        const perSector = PI * 2 / this.model.area.ultimate;
        const mass = this.model.mass;

        const reqStartAngle = this.model.startMass * perSector;
        const reqEndAngle = (this.model.startMass + mass) * perSector;

        const roundStart = this.model.isHead ? this.model.round: this.model.round + 1;
        const roundEnd = this.model.isHead ? this.model.area.maxRound + 1 : this.model.round + 2;

        this.__arc = this.__arc
            .innerRadius(roundStart * ROUND_WIDTH + 0.35)
            .outerRadius(roundEnd * ROUND_WIDTH - 0.35);

        this.__arc2 = this.__arc2
            .innerRadius(( roundStart + (roundEnd - roundStart)*0.6 ) * ROUND_WIDTH)
            .outerRadius(( roundStart + (roundEnd - roundStart)*0.6 ) * ROUND_WIDTH);

        this.animate
            .transition()
            .duration(1000)
            .attrTween( "d", this.tween( this.__arc, reqStartAngle, reqEndAngle ) );

        this.animate2
            .transition()
            .duration(1000)
            .attrTween( "d", this.tween( this.__arc2, reqStartAngle, reqEndAngle ) )

    }

}