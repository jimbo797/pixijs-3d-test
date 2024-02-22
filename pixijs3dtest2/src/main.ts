import * as PIXI from '@pixi/webworker';
import { Application, Assets, Sprite } from '@pixi/webworker';

const width = window.innerWidth, height = window.innerHeight;
const resolution = window.devicePixelRatio;
const canvas = document.createElement('canvas');
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
document.body.appendChild(canvas);

import('./worker.ts?worker').then((worker) => {
  const instance = new worker.default();
  const view = canvas.transferControlToOffscreen();
  instance.postMessage({ width, height, resolution, view }, [view]);
});