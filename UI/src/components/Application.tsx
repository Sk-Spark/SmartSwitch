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
  const [switchState, setSwitchState] = useState([0, 0, 0, 0, 0]);

  const statusResp = getStateApi(url);

  useEffect(() => {
    console.log('#1 Status Api call:', statusResp);
    if (!statusResp.loading) {
      if (!statusResp.error) {
        setSwitchState(statusResp.data);
      } else {
      }
    }
  }, [statusResp.loading]);

  const updateSwitchState = (pin: number, value: number) => {
    switchState[pin - 1] = value;
    setSwitchState([...switchState]);
    console.log(`#1 updateSwitchState: pin: ${pin} value: ${value}`);
  };

  return (
    <div id='erwt'>
      <div className='header'>
        <div className='main-heading'>
          <h1 className='themed'>Smart Switch #1</h1>
        </div>
        {/* <div className='div-btn'>
          <button
            className='save-btn'
            onClick={() => {
              saveSate(url, lightValues);
            }}
          >
            Save
          </button>
        </div> */}
        <div className='switch_container_div'>
          <Switch
            pin={++pin}
            sync={false}
            value={switchState[pin - 1]}
            setSwitchState={updateSwitchState}
            onValue={0}
            offValue={90}
          />        
          <Switch
            pin={++pin}
            sync={false}
            value={switchState[pin - 1]}
            setSwitchState={updateSwitchState}
            onValue={0}
            offValue={90}
          />        
        </div>
      </div>
    </div>
  );
};
