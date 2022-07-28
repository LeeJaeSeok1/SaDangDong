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
    end.setDate(start.getDate() + 1);
    return { start, end };
}

export function now_date() {
    const UTC_date = new Date();
    const nowDate = new Date();
    nowDate.setHours(UTC_date.getHours() + 9);
    return nowDate;
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
    const date = ended_at.getMonth() + 1;
    const day = ended_at.getDate();
    const hour = ended_at.getHours();
    const minute = ended_at.getMinutes();
    return `${date}월${day}일${hour}:${minute}`;
}
