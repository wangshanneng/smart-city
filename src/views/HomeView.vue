<template>
  <div class="home">
    <Scene />
    <BigScreen :dataInfo="dataInfo" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import gsap from "gsap";
import Scene from "@/components/Scene.vue";
import BigScreen from "@/components/BigScreen.vue";
import { getSmartCityInfo, getSmartCityList } from "@/api/api";

const dataInfo = reactive({
  iot: { number: 0 },
  event: { number: 0 },
  power: { number: 0 },
  test: { number: 0 },
});

onMounted(async () => {
  changeInfo();
});

const changeInfo = async () => {
  let res = await getSmartCityInfo();
  for (let key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name;
    dataInfo[key].unit = res.data.data[key].unit;
    gsap.to(dataInfo[key], {
      number: res.data.data[key].number,
      duration: 1,
    });
  }
};
</script>
