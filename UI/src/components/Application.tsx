import React, { useEffect, useState } from 'react';
import { getStateApi, saveSate } from './application.action';
import './Application.scss';
import { Switch } from './Switch/Switch';

export const Application = () => {
  document.body.classList.add('dark-mode');
  let pin = 0;
  const maxValue = 100;
  const initValue = Math.floor(maxValue * 0.3);
  const url = '';
  const [lightValues, setLightValues] = useState([
    initValue,
    initValue,
    initValue,
    initValue,
  ]);

  const statusResp = getStateApi(url);

  useEffect(() => {
    console.log('#1 Status Api call:', statusResp);
    if (!statusResp.loading) {
      if (!statusResp.error) {
        setLightValues(statusResp.data);
      } else {
      }
    }
  }, [statusResp.loading]);

  console.log('#1 lightValues:', lightValues);
  const updateLightValue = (pin: number, value: number) => {
    lightValues[pin - 1] = value;
    setLightValues([...lightValues]);
    console.log(`#1 updateLightValue: pin: ${pin} value: ${value}`);
  };

  return (
    <div id='erwt'>
      <div className='header'>
        <div className='main-heading'>
          <h1 className='themed'>Smart Switch #1</h1>
        </div>
        <div className='div-btn'>
          <button
            className='save-btn'
            onClick={() => {
              saveSate(url, lightValues);
            }}
          >
            Save
          </button>
        </div>
        <div className='switch_container_div'>
          <Switch
            pin={++pin}
            sync={false}
            value={lightValues[pin - 1]}
            setValue={updateLightValue}
          />        
        </div>
      </div>
    </div>
  );
};
