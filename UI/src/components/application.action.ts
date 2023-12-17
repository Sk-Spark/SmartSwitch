// const axios = require('axios');
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  getApiValueFromSliderValue,
  getSliderValueFromApiValue,
} from './helper';

export const saveSate = (url: string, state: number[]) => {
  const apiVal = state.map((val) => getApiValueFromSliderValue(val));
  axios
    .post(
      `${url ?? ''}/saveState`,
      { state: apiVal, len: state.length },
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      },
    )
    .then((resp: any) => {
      console.log(resp.data);
    })
    .catch((err: any) => {
      console.error('ERROR:', err);
    });
};

export const getStateApi = (url: string) => {
  const [data, setData] = useState({ loading: true, error: false, data: null });
  useEffect(() => {
    axios
      .get(`${url ?? ''}/status`)
      .then((resp: any) => {
        console.log(resp.data);
        setData({
          loading: false,
          error: false,
          data: resp.data.status.map((d: any) => getSliderValueFromApiValue(d)),
        });
      })
      .catch((err: any) => {
        console.error('ERROR:', err);
        setData({ loading: false, error: true, data: err });
      });
  }, []);
  return data;
};
