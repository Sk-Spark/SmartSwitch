const axios = require('axios');

export const updateSlider = (url: string, value: number, pin: number) => {
  axios
    .get(`${url ?? ''}/slider?pin=${pin}&value=${value}`)
    .then((resp: any) => {
      console.log(resp.data);
    })
    .catch((err: any) => {
      console.error('ERROR:', err);
    });
};

export const updateSwitch = (url: string, value: number, pin: number) => {
  console.log('#1 updateSwitch: url:', url, 'value:', value, 'pin:', pin);
  axios
    .post(`${url ?? ''}/servo`, { pin, value },{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((resp: any) => {
      console.log(resp.data);
    })
    .catch((err: any) => {
      console.error('ERROR:', err);
    });
};
