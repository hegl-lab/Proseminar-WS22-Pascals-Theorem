import {WIDTH, HEIGHT, set_shape} from "./pascals_theorem.js";
import {Ellipse} from "./shape/ellipse.js";
import {Parabola} from "./shape/parabola.js";
import {Hyperbola} from "./shape/hyperbola.js";

// default values

const ellipse_alpha = 1.0;
const ellipse_alpha_min = 0.1;
const ellipse_alpha_max = 10;

const parabola_alpha = 100.0;
const parabola_alpha_min = 0.1;
const parabola_alpha_max = 1000.0;

const hyperbola_alpha = 50.0;
const hyperbola_alpha_min = 0.1;
const hyperbola_alpha_max = 100.0;

const hyperbola_beta = 50.0;
const hyperbola_beta_min = 0.1;
const hyperbola_beta_max = 100.0;

let settings;

function updateEllipse() {
    set_shape(new Ellipse(settings.getValue('alpha'), WIDTH, HEIGHT));
}

function updateParabola() {
    set_shape(new Parabola(settings.getValue('alpha')));
}

function updateHyperbola() {
    set_shape(new Hyperbola(settings.getValue('alpha'), settings.getValue('beta')));
}

function updateShape() {
    let shape = settings.getValue('Shape').value;
    settings.removeControl('alpha');
    settings.removeControl('beta');

    switch (shape) {
        case 'Ellipse':
            settings.addRange('alpha', ellipse_alpha_min, ellipse_alpha_max, ellipse_alpha, 0.1, updateEllipse);
            set_shape(new Ellipse(ellipse_alpha, WIDTH, HEIGHT));
            break;
        case 'Parabola':
            settings.addRange('alpha', parabola_alpha_min, parabola_alpha_max, parabola_alpha, 0.1, updateParabola);
            set_shape(new Parabola(parabola_alpha));
            break;
        case 'Hyperbola':
            settings.addRange('alpha', hyperbola_alpha_min, hyperbola_alpha_max, hyperbola_alpha, 0.1, updateHyperbola);
            settings.addRange('beta', hyperbola_beta_min, hyperbola_beta_max, hyperbola_beta, 0.1, updateHyperbola);
            set_shape(new Hyperbola(hyperbola_alpha, hyperbola_beta));
            break;
    }
}

export function createSettings() {
    settings = QuickSettings.create(WIDTH + 20, 20, 'Settings');
    settings.addHTML("Select a shape",
        "In the following dropdown menu, you can select the conic you want the visualization to run on.");
    settings.addDropDown('Shape', [
        'Ellipse', 'Parabola', 'Hyperbola'
    ], updateShape);
    settings.addHTML("Modify shape",
        "Bellow the dropdown menu you can find different parameters that you can change to modify the shape of conic." +
        "<br>By dragging the points on the conic you can change their position and updated the Pascal line." +
        "<br>Using your mousewheel you can zoom in and out.")
    updateShape();
}