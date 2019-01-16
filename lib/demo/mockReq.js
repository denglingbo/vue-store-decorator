export default function mockReq(mockSuccess, delay) {
    if (delay === void 0) { delay = 2000; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (mockSuccess) {
                resolve({
                    data: {
                        name: 'deo',
                    },
                });
            }
            else {
                reject({
                    error: 'i\'m error.',
                });
            }
        }, delay);
    });
}
