const { max } = Math;

export default class Area extends Array {

    constructor() {
        super();
        this.rounds = [];
    }

    update() {
        this.rounds = this.reduce((acc, { round }) => {
            acc[round] = acc[round] || 0;
            acc[round] += 1;
            return acc;
        }, []);

        const ultimate = this.filter( ({ item: {length} }) => !length );
        this.ultimate = ultimate.length;

        this.maxRound = max( ...ultimate.map( ({ round }) => round ) );

    }

}