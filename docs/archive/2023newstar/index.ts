import { ElMessage } from "element-plus";

export function training() {
  window.open("https://buuoj.cn/match/matches/190");
}

export function writeup() {
  ElMessage({
    message: "该届赛事暂无题解",
    type: "warning",
  });
}
