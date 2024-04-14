import * as THREE from "three";
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  50
);

// 设置相机位置
camera.position.set(0, 0, 10);


export default camera;
