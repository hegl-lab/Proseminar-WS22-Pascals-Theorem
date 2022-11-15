import {scale_and_translate, position_range, mouse_position, SCALE_FACTOR} from "./scroll_and_zoom.js";

import {Point} from "./point.js";

import {createSettings} from "./settings.js";

export const WIDTH = 500;
export const HEIGHT = 500;

// points on the conic
let points = [];
// point that is currently being dragged, or null if none is being dragged
export let dragging = null;

// finds the nearest points from the list points based on the euclidean norm
function findNearestPoint(src_point) {
    let distance = Number.MAX_VALUE;
    let found = null;

    for (let point of points) {
        if (point.distance_to_point(src_point) < distance) {
            distance = point.distance_to_point(src_point);
            found = point;
        }
    }

    return found;
}

let shape = null;

// found here: https://stackoverflow.com/questions/57126779/p5-js-how-do-i-let-a-line-go-endless-in-both-directions
function endlessLine(x1, y1, x2, y2) {
    let p1 = new p5.Vector(x1, y1);
    let p2 = new p5.Vector(x2, y2);

    let dia_len = new p5.Vector(windowWidth / SCALE_FACTOR, windowHeight / SCALE_FACTOR).mag();
    let dir_v = p5.Vector.sub(p2, p1).setMag(dia_len);
    let lp1 = p5.Vector.add(p1, dir_v);
    let lp2 = p5.Vector.sub(p1, dir_v);

    line(lp1.x, lp1.y, lp2.x, lp2.y);
}

function intersection(a, b, c, d) {
    let slope_1 = (b.y - a.y) / (b.x - a.x);
    let slope_2 = (d.y - c.y) / (d.x - c.x);

    let starting_value_1 = a.y - a.x * slope_1;
    let starting_value_2 = c.y - c.x * slope_2;

    let x = (starting_value_2 - starting_value_1) / (slope_1 - slope_2);
    let y = starting_value_1 + x * slope_1;

    dotted_line(a.x, a.y, x, y);
    dotted_line(c.x, c.y, x, y);

    return new Point(x, y);
}

function dotted_line(x1, y1, x2, y2) {
    let length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    let dx = (x2 - x1) / length;
    let dy = (y2 - y1) / length;

    for (let i = 0; i < length / 10; ++i) {
        line(x1 + dx * i * 10, y1 + dy * i * 10, x1 + dx * (i * 10 + 5), y1 + dy * (i * 10 + 5));
    }
}

function drawIntersectionsAndLine() {
    stroke('#7a3225');
    let p = intersection(points[0], points[4], points[1], points[5]);
    circle(p.x, p.y, 10);
    stroke('#297a25');
    let q = intersection(points[0], points[3], points[2], points[5]);
    circle(q.x, q.y, 10);
    stroke('#257a7a');
    let r = intersection(points[1], points[3], points[2], points[4]);
    circle(r.x, r.y, 10);

    stroke(0);
    endlessLine(p.x, p.y, q.x, q.y);
}

function drawConnections() {
    stroke('#7a3225');
    // A-B
    line(points[0].x, points[0].y, points[4].x, points[4].y);
    // D-E
    line(points[5].x, points[5].y, points[1].x, points[1].y);
    stroke('#297a25');
    // F-A
    line(points[3].x, points[3].y, points[0].x, points[0].y);
    // C-D
    line(points[2].x, points[2].y, points[5].x, points[5].y);
    stroke('#257a7a');
    // B-C
    line(points[4].x, points[4].y, points[2].x, points[2].y);
    // E-F
    line(points[1].x, points[1].y, points[3].x, points[3].y);
}

export function set_shape(new_shape) {
    shape = new_shape;
    points = [];
    shape.init_points(points, width, height);
    dragging = null;
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    createSettings();
    strokeWeight(1);
}

function draw() {
    if (shape === null) return;
    background(220);

    translate(WIDTH / 2, HEIGHT / 2);
    scale_and_translate();

    // draw shape
    stroke(0);
    noFill();
    let [x_range, y_range] = position_range();
    shape.plot(x_range, y_range);

    // draw connections between points and their intersections
    drawConnections();
    drawIntersectionsAndLine();

    // draw points
    fill(0);
    for (let point of points) {
        if (point !== dragging) {
            circle(point.x, point.y, 10);
        }
    }

    let [mouse_x, mouse_y] = mouse_position();
    let position = shape.nearest_point_on_shape(mouse_x, mouse_y);
    if (dragging === null) {
        // currently not dragging a point, so we check if a point is in range of the cursor and highlight it
        let nearest = findNearestPoint(position);
        if (nearest.distance_to_point(position) <= 50 / SCALE_FACTOR) {
            fill('#4faa30');
            stroke('#4faa30');
            circle(nearest.x, nearest.y, 15);
        }
    } else {
        // update position of the point that is being dragged
        dragging.x = position.x;
        dragging.y = position.y;
        circle(dragging.x, dragging.y, 15);
    }
}

// checks if a point is selected and switches it into "dragging-mode"
function mousePressed(event) {
    if (event.force || (event.path[0].className === 'p5Canvas' && event.button === 0 && shape !== null)) {
        let [mouse_x, mouse_y] = mouse_position();
        let point = shape.nearest_point_on_shape(mouse_x, mouse_y);
        if (event.force) {
            if (point.distance(mouse_x, mouse_y) > 50) return;
        }

        let nearest = findNearestPoint(point);
        if (nearest.distance_to_point(point) <= 50 / SCALE_FACTOR) {
            dragging = nearest;
        }
    }
}

// stops dragging points
function mouseReleased() {
    dragging = null;
}

// set window method so p5.js knows which methods to call
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;