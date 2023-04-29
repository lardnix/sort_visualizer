"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DEFAULT_ARRAY_SIZE = 500;
const DISPLAY_WIDTH = 1300;
const DISPLAY_HEIGHT = 600;
function create_array(size) {
    return new Array(size).fill(0).map((element, index, array) => index + 1);
}
function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
function randomize_array(display, ctx, array) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const str_value in array) {
            const value = parseInt(str_value);
            const random = Math.floor(Math.random() * array.length);
            render(display, ctx, array, value);
            swap(array, value, random);
            render(display, ctx, array, random);
            yield sleep(1);
        }
        render(display, ctx, array, null);
    });
}
function render(display, ctx, array, current) {
    ctx.clearRect(0, 0, display.width, display.height);
    const bar_width = DISPLAY_WIDTH / array.length;
    const bar_height = DISPLAY_HEIGHT / array.length;
    for (const bar in array) {
        ctx.fillStyle = parseInt(bar) == current ? "#ff2323" : "#fff";
        ctx.fillRect(parseInt(bar) * bar_width, display.height, bar_width, 0 - array[bar] * bar_height);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function bubble_sort(display, ctx, array) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (array[j] >= array[j + 1]) {
                    render(display, ctx, array, j);
                    swap(array, j, j + 1);
                    render(display, ctx, array, j + 1);
                    yield sleep(1);
                }
            }
        }
        render(display, ctx, array, null);
    });
}
function quick_sort_parition(display, ctx, array, left, right) {
    return __awaiter(this, void 0, void 0, function* () {
        const pivot = array[left];
        let i = left;
        for (let j = left + 1; j <= right; j++) {
            if (array[j] <= pivot) {
                i++;
                render(display, ctx, array, j);
                swap(array, i, j);
                render(display, ctx, array, i);
                yield sleep(1);
            }
        }
        render(display, ctx, array, i);
        swap(array, left, i);
        render(display, ctx, array, left);
        yield sleep(1);
        return i;
    });
}
function quick_sort(display, ctx, array, left, right) {
    return __awaiter(this, void 0, void 0, function* () {
        if (left < right) {
            const pivot_index = yield quick_sort_parition(display, ctx, array, left, right);
            yield quick_sort(display, ctx, array, left, pivot_index - 1);
            yield quick_sort(display, ctx, array, pivot_index + 1, right);
        }
    });
}
function quick_sort_wrapper(display, ctx, array) {
    return __awaiter(this, void 0, void 0, function* () {
        yield quick_sort(display, ctx, array, 0, array.length - 1);
        render(display, ctx, array, null);
    });
}
function selection_sort(display, ctx, array) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < array.length; i++) {
            let lowest_index = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] <= array[lowest_index]) {
                    lowest_index = j;
                }
            }
            if (lowest_index != i) {
                render(display, ctx, array, i);
                swap(array, i, lowest_index);
                render(display, ctx, array, lowest_index);
                yield sleep(1);
            }
        }
        render(display, ctx, array, null);
    });
}
window.onload = () => {
    const Sorts = [
        {
            name: "bubble_sort",
            function: bubble_sort,
        },
        {
            name: "quick_sort",
            function: quick_sort_wrapper,
        },
        {
            name: "selection_sort",
            function: selection_sort,
        }
    ];
    const display = document.getElementById("display");
    const ctx = display.getContext("2d");
    display.width = DISPLAY_WIDTH;
    display.height = DISPLAY_HEIGHT;
    const range_visualizer = document.getElementById("range_visualizer");
    const range_slider = document.getElementById("range_slider");
    const randomize_button = document.getElementById("randomize_button");
    let array = create_array(DEFAULT_ARRAY_SIZE);
    randomize_array(display, ctx, array);
    render(display, ctx, array, null);
    range_visualizer.innerHTML = DEFAULT_ARRAY_SIZE.toString();
    range_slider.min = "100";
    range_slider.max = "1000";
    range_slider.value = DEFAULT_ARRAY_SIZE.toString();
    range_slider.addEventListener("input", () => {
        const value = range_slider.value;
        range_visualizer.innerHTML = value;
        array = create_array(parseInt(value));
    });
    range_slider.addEventListener("change", () => {
        randomize_array(display, ctx, array);
    });
    randomize_button.onclick = () => {
        randomize_array(display, ctx, array);
    };
    for (const sort of Sorts) {
        const sort_button = document.getElementById(`${sort.name}_button`);
        sort_button.onclick = () => {
            sort.function(display, ctx, array);
        };
    }
};
