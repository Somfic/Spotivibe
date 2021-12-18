import { get } from 'svelte/store';
import * as THREE from 'three';

import { current } from '../lib/stores';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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

const cloudTexture = [cloudTexture3];

const cloudGeometry = new THREE.PlaneBufferGeometry(400, 400);
const cloudMaterial = new THREE.MeshLambertMaterial({
  // Pick a random cloud texture
  map: cloudTexture[Math.floor(Math.random() * cloudTexture.length)],
  transparent: true,
  opacity: 0.8,
});

const cloudsX = 800;
const cloudsXOffset = 0;

const cloudsY = 400;
const cloudsYOffset = 100;

const cloudsZ = 20;
const cloudsZOffset = -400;

for (let p = 0; p < 100; p++) {
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(Math.random() * cloudsX * 2 - cloudsX + cloudsXOffset, Math.random() * cloudsY * 2 - cloudsY + cloudsYOffset, Math.random() * cloudsZ * 2 - cloudsZ + cloudsZOffset);
  cloud.rotation.z = Math.random() * 2 * Math.PI;
  cloud.material.opacity = 0.55;
  clouds.push(cloud);
  scene.add(cloud);
}

const light1 = new THREE.PointLight(0xff0000, 200);
light1.position.x = -20;
light1.position.y = -20;
light1.position.z = cloudsZOffset;
scene.add(light1);

const light2 = new THREE.PointLight(0x00ff00, 0.4);
light2.position.x = 20;
light2.position.y = 20;
light2.position.z = 0;
scene.add(light2);

const directional = new THREE.DirectionalLight(0x0000ff, 1.4);
directional.position.x = 100;
directional.position.y = 100;
directional.position.z = 1000;
scene.add(directional);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

const animate = () => {
  requestAnimationFrame(animate);

  const c = get(current);

  if (c.analysis == undefined || c.analysis.sections == undefined || c.colors == undefined || c.colors.DarkMuted == undefined) {
    return;
  }

  light1.color = new THREE.Color(c.colors?.Muted?.hex);
  light2.color = new THREE.Color(c.colors?.Vibrant?.hex);

  directional.color = new THREE.Color(c.colors?.DarkVibrant?.hex);
  ambient.color = new THREE.Color(c.colors?.DarkMuted?.hex);

  light1.intensity =  ease(1-c.analysis?.beat.elapsed) * 100 + 100;
  light2.intensity =  c.analysis?.segment.loudness_max / c.analysis?.segments.filter(x => x.loudness_max).reduce((a, b) => a + b.loudness_max, 0) * 200;
  ambient.intensity =  (1 - c.analysis?.bar.elapsed) * 0.2;
  directional.intensity = c.analysis?.section.loudness / c.analysis?.sections.filter(x => x.loudness).reduce((a, b) => a + b.loudness, 0)* 2;

  clouds.forEach(p => {
    p.rotation.z -= c.analysis?.section?.tempo * 0.000005;
  });

  composer.render();
};

const ease = (x: number) => {
  return Math.pow(x, 2);
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
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(5,5), 0.2, 0, 0));

  resize();
  animate();
};

window.addEventListener('resize', resize);
