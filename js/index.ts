const DEFAULT_ARRAY_SIZE = 500;
const DISPLAY_WIDTH = 1300;
const DISPLAY_HEIGHT = 600;

function create_array(size: number) {
  return new Array<number>(size).fill(0).map((element, index, array) => index + 1);
}

function swap(array: number[], i: number, j: number) {

  const temp = array[i];

  array[i] = array[j];
  array[j] = temp;
}

async function randomize_array(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[]) {
  for (const str_value in array) {
    const value = parseInt(str_value);
    const random = Math.floor(Math.random() * array.length);

    render(display, ctx, array, value);
    swap(array, value, random);
    render(display, ctx, array, random);

    await sleep(1);
  }

  render(display, ctx, array, null);
}

function render(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[], current: number | null) {
  ctx.clearRect(0, 0, display.width, display.height);

  const bar_width = DISPLAY_WIDTH / array.length;
  const bar_height = DISPLAY_HEIGHT / array.length;
  for (const bar in array) {
    ctx.fillStyle = parseInt(bar) == current ? "#ff2323" : "#fff";
    ctx.fillRect(parseInt(bar) * bar_width, display.height, bar_width, 0 - array[bar] * bar_height);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubble_sort(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[]) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] >= array[j + 1]) {
        render(display, ctx, array, j);
        swap(array, j, j + 1);
        render(display, ctx, array, j + 1);

        await sleep(1);
      }
    }
  }

  render(display, ctx, array, null);
}

async function quick_sort_parition(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[], left: number, right: number) {
  const pivot = array[left];
  let i = left;

  for (let j = left + 1; j <= right; j++) {
    if (array[j] <= pivot) {
      i++;
      render(display, ctx, array, j);
      swap(array, i, j);
      render(display, ctx, array, i);

      await sleep(1);
    }
  }


  render(display, ctx, array, i);
  swap(array, left, i);
  render(display, ctx, array, left);

  await sleep(1);

  return i;
}

async function quick_sort(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[], left: number, right: number) {
  if (left < right) {
    const pivot_index: number = await quick_sort_parition(display, ctx, array, left, right);

    await quick_sort(display, ctx, array, left, pivot_index - 1);
    await quick_sort(display, ctx, array, pivot_index + 1, right);
  }
}

async function quick_sort_wrapper(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[]) {
  await quick_sort(display, ctx, array, 0, array.length - 1);

  render(display, ctx, array, null);
}

async function selection_sort(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[]) {
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

      await sleep(1);
    }
  }

  render(display, ctx, array, null);
}

interface Sort {
  name: string;
  function(display: HTMLCanvasElement, ctx: CanvasRenderingContext2D, array: number[]): Promise<void>;
}

window.onload = () => {
  const Sorts: Sort[] = [
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

  const display = document.getElementById("display") as HTMLCanvasElement;
  const ctx = display.getContext("2d") as CanvasRenderingContext2D;

  display.width = DISPLAY_WIDTH;
  display.height = DISPLAY_HEIGHT;

  const range_visualizer = document.getElementById("range_visualizer") as HTMLLabelElement;
  const range_slider = document.getElementById("range_slider") as HTMLInputElement;
  const randomize_button = document.getElementById("randomize_button") as HTMLButtonElement;

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
  }

  for (const sort of Sorts) {
    const sort_button = document.getElementById(`${sort.name}_button`) as HTMLButtonElement;

    sort_button.onclick = () => {
      sort.function(display, ctx, array);
    }
  }
}
