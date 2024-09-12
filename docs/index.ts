import { ElMessage } from 'element-plus';

export function signup() {
    let nowtime = new Date();
    let opentime = new Date('2024-09-13 10:00:00');
    if (nowtime.getTime() < opentime.getTime()) {
        ElMessage({
            message: '公开赛道报名通道于 9.13 10:00 开放',
            type: 'warning',
        })
    } else {
        let year = opentime.getFullYear();
        let matchname = 'newstar';
        let origin = 'endbm.ichunqiu.com';
        let protocol = 'https:';
        window.open(`${protocol}//${origin}` + `/${year + matchname}`);
    }
}