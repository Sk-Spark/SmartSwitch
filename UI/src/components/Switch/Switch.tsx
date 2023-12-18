import debounce from 'lodash/debounce';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { getApiValueFromSliderValue } from '../helper';
import { icons } from '../Icons';
import { updateSlider, updateSwitch } from './actions';
import './Switch.scss';

interface SwitchProps {
  pin: number;
  sync: boolean;
  value: number;
  onValue: number;
  offValue: number;
  setSwitchState: (pin: number, value: number) => void;
}

export const Switch = (props: SwitchProps) => {
  const minValue = 0;
  const maxValue = 100;
  const factor = 10.24;
  const step = 1;
  const initValue = Math.floor(maxValue * 0.3);
  const debounceTime = 50;

  const { pin, value, setSwitchState, onValue, offValue } = { ...props };
  const switchTable = `Switch ${pin}`;

  const disable = value === 0;
  const sliderProps = {
    fill: disable ? '#eee' : '#03a9f4',
    background: 'rgba(255, 255, 255, 0.214)',
  };
  const apiVal = Math.floor(Number(value) * factor);

  function getSliderBgColor(value: number): string {
    const percentage = (100 * (value - minValue)) / (maxValue - minValue);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background
      } ${percentage + 0.1}%)`;
    return bg;
  }

  const debouncedSliderUpdate = React.useRef(
    debounce((url, value, pin) => {
      console.log('#1 #2 debouncedSliderUpdate: pin:', pin, 'value:', value);
      updateSwitch(url, value, pin);
    }, debounceTime),
  ).current;

  useEffect(() => {
    console.log('#1 debouncedSliderUpdate: pin:', pin, 'value:', value);
    debouncedSliderUpdate('http://192.168.137.75', value, props.pin);
  }, [value]);

  return (
    <div className='range__slider'>
      <label className='length__title field-title'>{`${switchTable}`}</label>
      <button
        className='toggle_btn'
        onClick={() => {
          value == onValue ? setSwitchState(pin, offValue ) : setSwitchState(pin, onValue);
        }}

      >
        <label className='toggle_label' style={{marginLeft: value>0 ? '0.5em' : '35px' }} >{value > 0 ? 'ON' : 'OFF'}</label>
        <div className={`thumb_div thumb_${value == onValue ? 'off' : 'on'}`} />
      </button>      
    </div>
  );
};
