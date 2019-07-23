import { notification } from 'antd';

function showError(message: string) {
    notification.error({
        message: 'Request Failed',
        description: message
    });
}

export function collectRequestParams(param, name = undefined): string[] {
    if (param instanceof Array) {
        let ps = [];
        for (let v of param) {
            ps.push(...collectRequestParams(v, name));
        }
        return ps;
    }
    if (param instanceof Object) {
        let ps = [];
        for (let key in param) {
            if (param.hasOwnProperty(key)) {
                ps.push(...collectRequestParams(param[key], name ? name + '.' + key : key));
            }
        }
        return ps;
    }
    if (!name) {
        throw new Error("name must be provided");
    }
    if (param === undefined || param === null) {
        return [];
    }
    return [name + '=' + encodeURIComponent('' + param)];
}

export function request({url, method = 'GET', params = {}}, callback: (result: any) => void) {
    let ps = collectRequestParams(params);

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: ps.length === 0 ? undefined : ps.join('&')
    }).then(
        r => r
            .text()
            .then(
                t => {
                    if (r.ok) {
                        callback(t ? JSON.parse(t) : undefined);
                    } else {
                        showError(t);
                    }
                }
            ).catch(
                e =>  showError('' + e)
            ),
        r => showError(r.toString())
    ).then(
        undefined,
        r => showError(r.toString())
    )
}