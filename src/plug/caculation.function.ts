export function date_calculation(ended_at) {
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
