export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    }

    distance_to_point(point) {
        return this.distance(point.x, point.y);
    }
}