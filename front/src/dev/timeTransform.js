function timeTransform (timespan) {
    if (!!!timespan) {
        return "历史遗留";
    }
    timespan = parseInt(timespan)*1000;
    var dateTime = new Date(timespan);

    var year = dateTime.getFullYear(),
        month = dateTime.getMonth() + 1,
        day = dateTime.getDate(),
        hour = dateTime.getHours(),
        minute = dateTime.getMinutes(),
        second = dateTime.getSeconds(),
        now = new Date(),
        now_new = Date.parse(new Date()),

        milliseconds = 0,
        timeSpanStr;

    milliseconds = now_new - timespan;

    if (milliseconds <= 1000 * 60 * 1) {
        timeSpanStr = '刚刚';
    }else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
    }else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    }else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    }else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
    }else {
        timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }
    return timeSpanStr;
};
module.exports = timeTransform;