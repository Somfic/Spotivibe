import { nextTick } from 'process';
import { get } from 'svelte/store';
import * as THREE from 'three';

import { current } from '../lib/stores';
import type { Current } from './Current';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const geometry = new THREE.BoxGeometry();

const barMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  transparent: true,
});
const beatMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  transparent: true,
});
const sectionMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  transparent: true,
});

const bar = new THREE.Mesh(geometry, barMaterial);
const beat = new THREE.Mesh(geometry, beatMaterial);
const section = new THREE.Mesh(geometry, sectionMaterial);

bar.castShadow = true;
bar.receiveShadow = true;
beat.castShadow = true;
beat.receiveShadow = true;
section.castShadow = true;
section.receiveShadow = true;

let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;

scene.add(bar);
scene.add(beat);
scene.add(section);

beat.position.x = -1.25;
bar.position.x = 0;
section.position.x = 1.25;

camera.position.z = 3;

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.x = 1;
light1.position.y = 0.5;
light1.position.z = 2;
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.x = -1;
light2.position.y = -0.5;
light2.position.z = -2;
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const animate = () => {
  requestAnimationFrame(animate);

  const c = get(current);

  if (c.analysis == undefined || c.analysis.sections == undefined) {
    return;
  }

  barMaterial.color = new THREE.Color(c.colors?.LightMuted.hex);
  beatMaterial.color = new THREE.Color(c.colors?.LightVibrant.hex);
  sectionMaterial.color = new THREE.Color(c.colors?.Vibrant.hex);
  light1.color = new THREE.Color(c.colors?.LightVibrant.hex);
  light2.color = new THREE.Color(c.colors?.Vibrant.hex);

  const bounce = 0.02;

  const beatElapsed = Math.pow(c.analysis?.beat.elapsed, bounce);
  const barElapsed = Math.pow(c.analysis?.bar.elapsed, bounce);
  const sectionElapsed = Math.pow(c.analysis?.section.elapsed, 1);

  bar.scale.setY(barElapsed);
  bar.position.setY(barElapsed / 2 - 0.6);

  beat.scale.setY(beatElapsed);
  beat.position.setY(beatElapsed / 2 - 0.6);

  section.scale.setY(sectionElapsed);
  section.position.setY(sectionElapsed / 2 - 0.6);

  // Rotate the camera around the scene
  controls.autoRotateSpeed = c.analysis?.section.tempo / 70;
  controls.update();

  composer.render();
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createScene = (el: HTMLCanvasElement) => {
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: true,
    alpha: true,
    canvas: el,
  });
  renderer.setClearColor(0x000000, 0);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.enableDamping = true;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  resize();
  animate();
};

window.addEventListener('resize', resize);
