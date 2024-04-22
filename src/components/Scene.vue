<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";

// 导入GUI对象
import gui from "@/three/gui";
// 导入场景
import scene from "@/three/scene";
// 导入相机
import camera from "@/three/camera";
// 导入控制器
import controls from "@/three/controls";
// 初始化调整屏幕
import "@/three/init";
// 导入辅助坐标轴
import axesHelper from "@/three/axesHelper";
// 导入渲染器
import renderer from "@/three/renderer";
// 导入添加物体函数
import createMesh from "@/three/createMesh";

// 导入每一帧的执行函数
import animate from "@/three/animate";
import AlarmSprite from "@/three/mesh/AlarmSprite";
import LightWall from "@/three/mesh/LightWall";
import FlyLineShader from "@/three/mesh/FlyLineShader";
import LightRadar from "@/three/mesh/LightRadar";
import eventHub from "@/utils/eventHub";

const props = defineProps(["eventList"]);
// 场景元素div
let sceneDiv = ref(null);

scene.add(camera);
scene.add(axesHelper);
createMesh();

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement);
  animate();
});

const eventListMesh = [];
let mapFn = {
  火警: (position, i) => {
    const lightWall = new LightWall(1, 2, position);
    lightWall.eventListIndex = i;
    scene.add(lightWall.mesh);
    eventListMesh.push(lightWall);
  },
  治安: (position, i) => {
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    ).getHex();
    const flyLineShader = new FlyLineShader(position, color);
    flyLineShader.eventListIndex = i;
    scene.add(flyLineShader.mesh);
    eventListMesh.push(flyLineShader);
  },
  电力: (position, i) => {
    const lightRadar = new LightRadar(2, position);
    lightRadar.eventListIndex = i;
    scene.add(lightRadar.mesh);
    eventListMesh.push(lightRadar);
  },
};

eventHub.on("eventToggle", (i) => {
  eventListMesh.forEach((item) => {
    if (item.eventListIndex === i) {
      item.mesh.visible = true;
    } else {
      item.mesh.visible = false;
    }
  });
  const position = {
    x: props.eventList[i].position.x / 5 - 10,
    y: 0,
    z: props.eventList[i].position.y / 5 - 10,
  };
  gsap.to(controls.target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
  });
});

watch(
  () => props.eventList,
  (val) => {
    eventListMesh.forEach((item) => {
      item.remove();
    });
    props.eventList.forEach((item, i) => {
      const position = {
        x: item.position.x / 5 - 10,
        z: item.position.y / 5 - 10,
      };
      const alarmSprite = new AlarmSprite(item.name, position);
      alarmSprite.onClick(() => {
        eventHub.emit("spriteClick", { event: item, i });
      });
      eventListMesh.push(alarmSprite);
      scene.add(alarmSprite.mesh);
      if (mapFn[item.name]) {
        mapFn[item.name](position, i);
      }
    });
  }
);
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
