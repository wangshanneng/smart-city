<template>
  <div class="home">
    <Scene />
    <BigScreen :dataInfo="dataInfo" :eventList="eventList" />
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
  getEventList();
  setInterval(() => {
    changeInfo();
    getEventList();
  }, 10000);
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

const eventList = ref([]);
const getEventList = async () => {
  let result = await getSmartCityList();
  eventList.value = result.data.list;
  // console.log(result.data.list);
};
</script>
