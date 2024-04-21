import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/shader/flyLine/vertex.glsl?raw";
import fragment from "@/shader/flyLine/fragment.glsl?raw";

export default class FlyLineShader {
  constructor() {
    // 根据点生成曲线
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-5, 4, 0),
      new THREE.Vector3(-10, 0, 0),
    ];
    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    const points = this.lineCurve.getPoints(1000);
    // 创建几何顶点
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 给每一个顶点设置属性
    const aSizeArray = new Float32Array(points.length);
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i;
    }
    // 设置几何体顶点属性
    this.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(aSizeArray, 1)
    );
    // 设置着色器材质
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0.5,
        },
        uColor: {
          value: new THREE.Color(0xffff00),
        },
        uLength: {
          value: points.length,
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Points(this.geometry, this.shaderMaterial);

    // 改变uTime来控制动画
    gsap.to(this.shaderMaterial.uniforms.uTime, {
      value: 1000,
      duration: 2,
      repeat: -1,
      ease: "none",
    });
  }
}
