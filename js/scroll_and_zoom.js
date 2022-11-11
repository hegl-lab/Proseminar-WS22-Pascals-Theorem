import {WIDTH, HEIGHT} from "./pascals_theorem.js";

export let SCALE_FACTOR = 1.0;
let window_move = [0, 0];

export function scale_and_translate() {
    scale(SCALE_FACTOR, SCALE_FACTOR);
    translate(window_move[0], window_move[1]);
}

export function mouse_position() {
    return [
        (mouseX - WIDTH / 2) / SCALE_FACTOR - window_move[0],
        (mouseY - HEIGHT / 2) / SCALE_FACTOR - window_move[1]
    ];
}

export function position_range() {
    return [
        [-WIDTH / SCALE_FACTOR / 2 - window_move[0], WIDTH / SCALE_FACTOR / 2 - window_move[0]], // x_range
        [-HEIGHT / SCALE_FACTOR / 2 - window_move[1], HEIGHT / SCALE_FACTOR / 2 - window_move[1]] // y_range
    ];
}

function mouseWheel(event) {
    let delta = event.delta;
    if (delta < 0) {
        SCALE_FACTOR *= 1.1;
    } else {
        SCALE_FACTOR /= 1.1;
    }
    return false;
}

function mouseDragged(event) {
    if (event.buttons === 4) {
        window_move[0] += event.movementX / SCALE_FACTOR;
        window_move[1] += event.movementY / SCALE_FACTOR;
    }
}

window.mouseWheel = mouseWheel;
window.mouseDragged = mouseDragged;