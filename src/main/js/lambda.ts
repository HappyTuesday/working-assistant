export function unique<T>(list: T[]) {
    let result = [];
    for (let t of list) {
        if (!result.includes(t)) {
            result.push(t);
        }
    }
    return result;
}