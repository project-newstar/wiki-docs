import { ElMessage } from 'element-plus';

export function signup() {
    let nowdate = new Date();
    let signdate = [new Date('2024-09-13 10:00:00'), new Date('2024-11-03 21:00:00')];
    if (nowdate.getTime() < signdate[0].getTime()) {
        ElMessage({
            message: '公开赛道报名通道于 9.13 10:00 开放',
            type: 'warning',
        })
    } else if (nowdate.getTime() > signdate[1].getTime()) {
        ElMessage({
            message: '报名已结束！',
            type: 'warning',
        })
    } else {
        let year = signdate[0].getFullYear();
        let matchname = 'newstar';
        let origin = 'endbm.ichunqiu.com';
        let protocol = 'https:';
        let path = '/' + year + matchname;
        window.open(`${protocol}//${origin}` + path);
    }
}

export function participate(channel: 'internal' | 'external') {
    let time = {
        'internal': [new Date('2024-09-23 09:00:00').getTime(), new Date('2024-10-27 21:00:00').getTime()],
        'external': [new Date('2024-09-30 09:00:00').getTime(), new Date('2024-11-03 21:00:00').getTime()],
    }
    let now = Date.now();
    let gap = time[channel];
    if (!gap) return
    if (now < gap[0]) {
        ElMessage({
            message: '比赛尚未开始！',
            type: 'warning',
        })
    } else if (now > gap[1]) {
        ElMessage({
            message: '比赛已结束！',
            type: 'warning',
        })
    } else {
        let year = new Date(gap[0]).getFullYear();
        let matchname = 'newstar';
        let origin = 'match.ichunqiu.com';
        let protocol = 'https:';
        let tail = {
            'internal': 'xn',
            'external': 'gk',
        }[channel];
        let path = '/' + year + matchname + tail;
        window.open(`${protocol}//${origin}` + path);
    }
}