import axios from "axios";

export function getSmartCityInfo() {
  return axios.get("http://127.0.0.1:4523/m1/4369355-4013370-default/api/smartcity/info");
}

export function getSmartCityList() {
  return axios.get("http://127.0.0.1:4523/m1/4369355-4013370-default/api/smartcity/list");
}
