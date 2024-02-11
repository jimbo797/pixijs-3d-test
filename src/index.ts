/// <reference path='../global.d.ts' />

import { Application, Assets, Renderer } from "pixi.js"
import { CameraOrbitControl, LightingEnvironment, ImageBasedLighting, Model, Mesh3D, Light, LightType, ShadowCastingLight, ShadowQuality } from "pixi3d/pixi7"

let app = new Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view as HTMLCanvasElement)

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
    ],
  }]
}

await Assets.init({ manifest })
let assets = await Assets.loadBundle("assets")

let model = app.stage.addChild(Model.from(assets.teapot))
model.y = -0.8

let ground = app.stage.addChild(Mesh3D.createPlane())
ground.y = -0.8
ground.scale.set(10, 1, 10)

LightingEnvironment.main.imageBasedLighting = new ImageBasedLighting(
  assets.diffuse,
  assets.specular
)

let directionalLight = new Light()
directionalLight.intensity = 1
directionalLight.type = LightType.directional
directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0)
LightingEnvironment.main.lights.push(directionalLight)

let shadowCastingLight = new ShadowCastingLight(
  app.renderer as Renderer, directionalLight, { shadowTextureSize: 1024, quality: ShadowQuality.medium })
shadowCastingLight.softness = 1
shadowCastingLight.shadowArea = 15

let pipeline = app.renderer.plugins.pipeline
pipeline.enableShadows(ground, shadowCastingLight)
pipeline.enableShadows(model, shadowCastingLight)

let control = new CameraOrbitControl(app.view as HTMLCanvasElement);