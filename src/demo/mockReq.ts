export default function mockReq(mockSuccess: boolean, delay: number = 2000) {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => {

      if (mockSuccess) {
        resolve({
          data: {
            name: 'deo',
          },
        });
      } else {
        reject({
          error: 'i\'m error.',
        });
      }
    }, delay);
  });
}
