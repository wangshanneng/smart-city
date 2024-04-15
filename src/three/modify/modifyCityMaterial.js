import * as THREE from "three";
import gsap from "gsap";
export default function modifyCityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        //#end#
      `
    );

    addGradColor(shader, mesh);
    addSpread(shader);
  };
}

// 渐变效果
export function addGradColor(shader, mesh) {
  mesh.geometry.computeBoundingBox();
  //   console.log(mesh.geometry.boundingBox);
  const { min, max } = mesh.geometry.boundingBox;
  // 获取物体高度差
  const uHeight = max.y - min.y;

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
    "//#end#",
    `
      vec4 distGradColor = gl_FragColor;
      // 设置混合百分比
      float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
      // 计算混合颜色
      vec3 gridMixColor = mix(distGradColor.xyz, uTopColor, gradMix);
      gl_FragColor = vec4(gridMixColor, 1.0);
      //#end#
    `
  );
}
// 光波扩散特效
export function addSpread(shader) {
  // 扩散中心点
  shader.uniforms.uSpreadCenter = {
    value: new THREE.Vector2(0, 0),
  };
  // 扩散时间
  shader.uniforms.uSpreadTime = {
    value: -2000,
  };
  // 条带宽度
  shader.uniforms.uSpreadWidth = {
    value: 40,
  };

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
      #include <common>
      uniform vec2 uSpreadCenter;
      uniform float uSpreadTime;
      uniform float uSpreadWidth;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "//#end#",
    `
      float spreadRadius = distance(vPosition.xz, uSpreadCenter);
      // 扩散范围函数
      float spreadIndex =  - (spreadRadius - uSpreadTime)*(spreadRadius - uSpreadTime) + uSpreadWidth;

      if(spreadIndex > 0.0){
        gl_FragColor = mix(gl_FragColor, vec4(1,1,1,1), spreadIndex/uSpreadWidth);
      }
      //#end#
    `
  );

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 3,
    ease: "none",
    repeat: -1,
  });
}
