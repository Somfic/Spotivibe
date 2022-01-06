import { get } from 'svelte/store';
import * as THREE from 'three';

import { current } from '../lib/stores';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { Color } from 'three';

function lerp(a: number, b: number, t = 0.5) {
  return (1 - t) * a + t * b;
}

function lerpColor(a: Color, b: Color, t = 0.01) {
  const rColor = lerp(a.r, b.r, t);
  const gColor = lerp(a.g, b.g, t);
  const bColor = lerp(a.b, b.b, t);

  return new THREE.Color(rColor, gColor, bColor);
}

let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const clouds: THREE.Mesh[] = [];

const loader = new THREE.TextureLoader();
const cloudTexture1 = await loader.loadAsync('/cloud.png');
const cloudTexture2 = await loader.loadAsync('/cloud2.png');
const cloudTexture3 = await loader.loadAsync('/cloud3.png');

const cloudTexture = [cloudTexture1];

const cloudGeometry = new THREE.PlaneBufferGeometry(400, 400);
const cloudMaterial = new THREE.MeshLambertMaterial({
  // Pick a random cloud texture
  map: cloudTexture[Math.floor(Math.random() * cloudTexture.length)],
  transparent: true,
  opacity: 0.1,
});

const cloudsX = 800;
const cloudsXOffset = 0;

const cloudsY = 200;
const cloudsYOffset = 100;

const cloudsZ = 100;
const cloudsZOffset = -400;

for (let p = 0; p < 100; p++) {
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(Math.random() * cloudsX * 2 - cloudsX + cloudsXOffset, Math.random() * cloudsY * 2 - cloudsY + cloudsYOffset, Math.random() * cloudsZ * 2 - cloudsZ + cloudsZOffset);
  cloud.rotation.z = Math.random() * 2 * Math.PI;
  cloud.material.opacity = 0.55;
  clouds.push(cloud);
  scene.add(cloud);
}

const light1 = new THREE.PointLight(0xff0000, 0);
light1.position.set(-300, -200, -200)
scene.add(light1);

const light2 = new THREE.PointLight(0x00ff00, 0);
light2.position.set(300, 0, -300);
scene.add(light2);

const light3 = new THREE.PointLight(0x00ff00, 0);
light3.position.set(-100, 300, -100);
scene.add(light3);

const directional = new THREE.DirectionalLight(0x0000ff, 0);
directional.position.set(0, 0, 1)
scene.add(directional);

const animate = () => {
  requestAnimationFrame(animate);

  const c = get(current);

  if (c.analysis == undefined || c.analysis.bar.elapsed == undefined || c.analysis.sections == undefined || c.colors == undefined || c.colors.DarkMuted == undefined) {
    return;
  }

  light1.color = lerpColor(light1.color, new THREE.Color(c.colors?.Muted?.hex));
  light2.color = lerpColor(light2.color, new THREE.Color(c.colors?.Vibrant?.hex));
  light3.color = lerpColor(light3.color, new THREE.Color(c.colors?.LightVibrant?.hex));
  directional.color = lerpColor(directional.color, new THREE.Color(c.colors?.DarkVibrant?.hex));

  if(c.playback.is_playing) {
    light1.intensity = lerp( light1.intensity, -1 / (c.analysis?.section?.loudness) * 8, 0.08);
    light2.intensity = lerp( light2.intensity, -1 / (c.analysis?.segment?.loudness_max) * 10, 0.8);
    light3.intensity = lerp( light3.intensity , ease(c.analysis?.beat?.elapsed) * 0.2, 0.6);
    directional.intensity = lerp(directional.intensity, ease(c.analysis?.beat?.elapsed) * 1.5, 0.6);
  } else {
    light1.intensity = lerp(light1.intensity, 1, 0.002);
    light2.intensity = lerp(light2.intensity, 1, 0.002);
    light3.intensity = lerp(light3.intensity, 0.25, 0.002);
    directional.intensity = lerp(directional.intensity, 0.25, 0.002);
  }

  light1.intensity = Math.max(0.1, light1.intensity);
  light2.intensity = Math.max(0.1, light2.intensity);


  clouds.forEach(p => {
    p.rotation.z -= c.analysis?.section?.tempo * 0.000000006 * -p.position.z;
    p.position.x += c.analysis?.section?.tempo * 0.000002 * -p.position.z;

    if(p.position.x > cloudsX) {
      p.position.x = -cloudsX;
      p.position.y = Math.random() * cloudsY * 2 - cloudsY + cloudsYOffset;
      p.position.z = Math.random() * cloudsZ * 2 - cloudsZ + cloudsZOffset;
    }
  });

  composer.render();
};

const ease = (x: number) => {
  return Math.pow(x, 0.05);
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createScene = (el: HTMLCanvasElement) => {
  renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    stencil: false,
    depth: true,
    alpha: true,
    canvas: el,
  });
  renderer.setClearColor(0x000000, 0);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
 // composer.addPass(new UnrealBloomPass(new THREE.Vector2(5,5), 0.2, 2, 0));

  resize();
  animate();
};

window.addEventListener('resize', resize);
