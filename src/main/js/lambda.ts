import moment from "moment";

export function unique<T>(list: T[]) {
    let result = [];
    for (let t of list) {
        if (!result.includes(t)) {
            result.push(t);
        }
    }
    return result;
}

export function onlyDate(m: moment.Moment) {
    return moment({
        year: m.year(),
        month: m.month(),
        date: m.date()
    });
}