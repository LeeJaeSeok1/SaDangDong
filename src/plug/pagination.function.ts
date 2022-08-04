export function Offset(page, limit) {
    let start = 0;
    if (page <= 0) {
        page = 1;
    }
    return (start = (page - 1) * limit);
}
