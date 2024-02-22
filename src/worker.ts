/// <reference path='../global.d.ts' />

import { Application, Assets, Renderer, Sprite, Ticker } from "pixi.js";
import { CameraOrbitControl, LightingEnvironment, ImageBasedLighting, Model, Mesh3D, Light, LightType, ShadowCastingLight, ShadowQuality } from "pixi3d/pixi7";


// Everything should run in a worker, and worker should receive the canvas information (and everything related to it)
// Main thread hands off the canvas to the worker, and the worker receives canves info and then does everything

self.onmessage = async e => {
  // Recieve OffscreenCanvas from index.js
  const { width, height, resolution, view } = e.data;

  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  const app = new Application({ width, height, resolution, view });

  // let app = new Application({
  //   backgroundColor: 0xdddddd, resizeTo: window, antialias: true
  // });

  document.body.appendChild(app.view as HTMLCanvasElement);
  app.stage.sortableChildren = true;

  const manifest = {
    bundles: [{
      name: "assets",
      assets: [
        {
          name: "diffuse",
          srcs: "assets/chromatic/diffuse.cubemap",
        },
        {
          name: "specular",
          srcs: "assets/chromatic/specular.cubemap",
        },
        {
          name: "teapot",
          srcs: "assets/teapot/teapot.gltf",
        },
        {
          name: "desk",
          srcs: "assets/desk.jpg"
        },
        {
          name: "doodlebot",
          srcs: "assets/Doodlebot.gltf"
        }
      ],
    }]
  };

  await Assets.init({ manifest });
  let assets = await Assets.loadBundle("assets");

  // let model = app.stage.addChild(Model.from(assets.teapot));
  // model.y = -0.8;

  let doodlebot = app.stage.addChild(Model.from(assets.doodlebot));
  const doodlebotScale = 0.02;
  doodlebot.scale.set(doodlebotScale, doodlebotScale, doodlebotScale);

  // let ground = app.stage.addChild(Mesh3D.createPlane())
  // ground.y = -0.8
  // ground.scale.set(10, 1, 10)

  let backdrop = app.stage.addChild(Sprite.from(assets.desk));
  backdrop.y = -250;
  backdrop.zIndex = -10;
  backdrop.scale.set(.75, .8);


  LightingEnvironment.main.imageBasedLighting = new ImageBasedLighting(
    assets.diffuse,
    assets.specular
  );

  let directionalLight = new Light();
  directionalLight.intensity = 1;
  directionalLight.type = LightType.directional;
  directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0);
  LightingEnvironment.main.lights.push(directionalLight);

  let shadowCastingLight = new ShadowCastingLight(
    app.renderer as Renderer, directionalLight, { shadowTextureSize: 1024, quality: ShadowQuality.medium });
  shadowCastingLight.softness = 1;
  shadowCastingLight.shadowArea = 15;

  let pipeline = app.renderer.plugins.pipeline;
  // pipeline.enableShadows(ground, shadowCastingLight)
  // pipeline.enableShadows(model, shadowCastingLight);
  pipeline.enableShadows(doodlebot, shadowCastingLight);

  let control = new CameraOrbitControl(app.view as HTMLCanvasElement);


};