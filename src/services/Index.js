import axios from "axios";
import * as Constants from "../constants/Index";
export function post(obj, url, resolve, reject) {
  axios
    .post(`${Constants.BASE_URL}${url}`, obj)
    .then((res) => resolve(res.data))
    .catch((res) => reject(res));
}
export function get(url, resolve, reject) {
  axios
    .get(`${Constants.BASE_URL}${url}`)
    .then((res) => resolve(res.data))
    .catch((res) => resolve(res));
}
