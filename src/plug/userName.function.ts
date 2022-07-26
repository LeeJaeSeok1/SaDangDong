export function userName() {
    const userName = "unnamed" + "#" + Math.floor(Math.random() * (9999 - 1) + 1);
    return userName;
}
