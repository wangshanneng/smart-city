import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import scene from "./scene";

export default function createMesh() {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
  );
  plane.position.set(0, 0, -6);
  plane.receiveShadow = true;
  scene.add(plane);
}
