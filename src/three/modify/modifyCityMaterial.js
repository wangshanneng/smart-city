import * as THREE from "three";
import gsap from "gsap";
export default function modifyCityMaterial(mesh) {
  mesh.geometry.computeBoundingBox();
//   console.log(mesh.geometry.boundingBox);
  const { min, max } = mesh.geometry.boundingBox;
  // 获取物体高度差
  const uHeight = max.y - min.y;

  mesh.material.onBeforeCompile = (shader) => {
    // console.log(shader.vertexShader);
    // console.log(shader.fragmentShader);
    shader.uniforms.uTopColor = {
      value: new THREE.Color("#aaaeff"),
    };
    shader.uniforms.uHeight = {
      value: uHeight,
    };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
        #include <common>
        varying vec3 vPosition;
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
        #include <begin_vertex>
        vPosition = position;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `
        #include <common>
        uniform vec3 uTopColor;
        uniform float uHeight;
        varying vec3 vPosition;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        vec4 distGradColor = gl_FragColor;
        // 设置混合百分比
        float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
        // 计算混合颜色
        vec3 gridMixColor = mix(distGradColor.xyz, uTopColor, gradMix);
        gl_FragColor = vec4(gridMixColor, 1.0);
      `
    );
  };
}
