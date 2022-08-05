export function date_calculate(ended_at) {
    const UTC_date = new Date();
    const now_date = new Date();
    now_date.setHours(UTC_date.getHours() + 9);

    const remained_time: number = ended_at.getTime() - now_date.getTime();
    const fixed_time = new Date(remained_time).toISOString().split("T")[1].split(".")[0];
    return fixed_time;
}

export function create_date() {
    const UTC_date = new Date();
    const start = new Date();
    start.setHours(UTC_date.getHours() + 9);
    const end = new Date(start);
    // end.setDate(start.getDate() + 1);
    end.setHours(start.getHours() + 2);
    return { start, end };
}

export function now_date() {
    const UTC_date = new Date();
    const nowDate = new Date();
    nowDate.setHours(UTC_date.getHours() + 9);
    return nowDate;
}

export function mysqlnow_date() {
    const UTC_date = new Date();
    console.log(UTC_date);
    const nowDate = new Date();
    nowDate.setHours(UTC_date.getHours() + 9);
    const year = nowDate.getFullYear();
    let date = nowDate.getMonth() + 1 + "";
    if (date.length == 1) {
        date = "0" + date;
    }

    let day = nowDate.getDate() + "";
    if (day.length == 1) {
        day = "0" + day;
    }

    let hour = nowDate.getHours() + "";
    if (hour.length == 1) {
        hour = "0" + hour;
    }

    let minute = nowDate.getMinutes() + "";
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    const seconds = nowDate.getSeconds();
    console.log(year);
    // return `${year}-${date}-${day} ${hour}:${minute}:${seconds}`;
    return `${year}-${date}-${day}`;
    // 2022-07-28 17:56:32.480812
}

export function weekly_calculate() {
    const standard_date = new Date("2022-07-10T00:00:00");
    standard_date.setHours(standard_date.getHours() + 9);
    const standard_end_date = new Date("2022-07-16T24:00:00");
    standard_end_date.setHours(standard_end_date.getHours() + 9);

    const one_week = 604800000;

    const nowdate = new Date();
    nowdate.setHours(nowdate.getHours() + 9);

    const multiple_week = Math.floor((nowdate.getTime() - standard_date.getTime()) / one_week);
    const start_date = new Date(standard_date.setDate(standard_date.getDate() + 7 * multiple_week));
    const end_date = new Date(standard_end_date.setDate(standard_end_date.getDate() + 7 * multiple_week));
    return { start_date, end_date };
}

export function parse_calculate(ended_at: Date) {
    const new_date = new Date(ended_at);
    const date = new_date.getMonth() + 1;
    const day = new_date.getDate();
    let hour = new_date.getHours() + "";
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    let minute = new_date.getMinutes() + "";
    if (minute.length == 1) {
        minute = "0" + minute;
    }

    return `${date}월 ${day}일 ${hour}:${minute}`;
}

export function parse_Kcalculate(UTC, hours) {
    const new_date = new Date(UTC);
    new_date.setHours(new_date.getHours() + hours);
    const year = new_date.getFullYear();
    let date = new_date.getMonth() + 1 + "";
    if (date.length == 1) {
        date = "0" + date;
    }

    let day = new_date.getDate() + "";
    if (day.length == 1) {
        day = "0" + day;
    }

    let hour = new_date.getHours() + "";
    if (hour.length == 1) {
        hour = "0" + hour;
    }

    let minute = new_date.getMinutes() + "";
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    let seconds = new_date.getSeconds() + "";
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }

    return `${year}-${date}-${day} ${hour}:${minute}:${seconds}`;
}
