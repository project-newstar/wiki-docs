import { ElMessage } from "element-plus";

export function training() {
  window.open("https://ctf.xidian.edu.cn/training/14");
}

export function signup() {
  const nowdate = new Date();
  const signdate = [new Date("2024-09-13 10:00:00"), new Date("2024-11-03 21:00:00")];
  if (nowdate.getTime() < signdate[0].getTime()) {
    ElMessage({
      message: "公开赛道报名通道于 9.13 10:00 开放",
      type: "warning",
    });
  } else if (nowdate.getTime() > signdate[1].getTime()) {
    ElMessage({
      message: "报名已结束！",
      type: "warning",
    });
  } else {
    const year = signdate[0].getFullYear();
    const matchname = "newstar";
    const origin = "endbm.ichunqiu.com";
    const protocol = "https:";
    const path = `/${year}${matchname}`;
    window.open(`${protocol}//${origin}${path}`);
  }
}

export function participate(channel: "internal" | "external") {
  const time = {
    internal: [new Date("2024-09-23 09:00:00").getTime(), new Date("2024-10-27 21:00:00").getTime()],
    external: [new Date("2024-09-30 09:00:00").getTime(), new Date("2024-11-03 21:00:00").getTime()],
  };
  const now = Date.now();
  const gap = time[channel];
  if (!gap) return;
  if (now < gap[0]) {
    ElMessage({
      message: "比赛尚未开始！",
      type: "warning",
    });
  } else if (now > gap[1]) {
    ElMessage({
      message: "比赛已结束！",
      type: "warning",
    });
  } else {
    const year = new Date(gap[0]).getFullYear();
    const matchname = "newstar";
    const origin = "match.ichunqiu.com";
    const protocol = "https:";
    const tail = {
      internal: "xn",
      external: "gk",
    }[channel];
    const path = `/${year}${matchname}${tail}`;
    window.open(`${protocol}//${origin}${path}`);
  }
}
