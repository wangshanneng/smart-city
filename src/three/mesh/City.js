import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import scene from "../scene";

export default function createCity() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("./model/city.glb", (gltf) => {
    console.log(gltf);
    gltf.scene.traverse((item) => {
        if (item.type === 'Mesh') {
            item.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0x0c0e33),
            });
        }
    });
    scene.add(gltf.scene);
  });
}
