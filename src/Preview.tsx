import React, { useState } from 'react';
import events from './systems/events';

// bg color
// animation base
// color uv map
// current animation
// list of animations
// save animation button

const defaultAnims: Animation[] = [
  {
    name: `walk-up`,
    start: 8,
    end: 11,
    frameRate: 5
  },
  {
    name: `walk-down`,
    start: 0,
    end: 3,
    frameRate: 5
  },
  {
    name: `walk-left`,
    start: 4,
    end: 7,
    frameRate: 5
  },
  {
    name: `walk-leftup`,
    start: 16,
    end: 19,
    frameRate: 5
  },
  {
    name: `walk-leftdown`,
    start: 12,
    end: 15,
    frameRate: 5
  },
  {
    name: `walk-right`,
    start: 4,
    end: 7,
    frameRate: 5
  },
  {
    name: `walk-rightup`,
    start: 16,
    end: 19,
    frameRate: 5
  },
  {
    name: `walk-rightdown`,
    start: 12,
    end: 15,
    frameRate: 5
  },
  {
    name: `idle-up`,
    start: 32,
    end: 35,
    frameRate: 5
  },
  {
    name: `idle-down`,
    start: 28,
    end: 31,
    frameRate: 5
  },
  {
    name: `idle-left`,
    start: 20,
    end: 23,
    frameRate: 5
  },
  {
    name: `idle-leftup`,
    start: 24,
    end: 27,
    frameRate: 5
  },
  {
    name: `idle-leftdown`,
    start: 28,
    end: 31,
    frameRate: 5
  },
  {
    name: `idle-right`,
    start: 20,
    end: 23,
    frameRate: 5
  },
  {
    name: `idle-rightup`,
    start: 24,
    end: 27,
    frameRate: 5
  },
  {
    name: `idle-rightdown`,
    start: 28,
    end: 31,
    frameRate: 5
  },
  {
    name: `sit-down`,
    start: 44,
    end: 47,
    frameRate: 5
  },
  {
    name: `sit-left`,
    start: 40,
    end: 43,
    frameRate: 5
  },
  {
    name: `sit-right`,
    start: 40,
    end: 43,
    frameRate: 5
  },
  {
    name: `sit-up`,
    start: 48,
    end: 51,
    frameRate: 5
  },
]

function changeAnimation(event:any) {
  const file = event.target.files[0]

  if (!file) return

  const url = window.URL.createObjectURL(file)

  events.emit('changedAnimation', url)
}

function changeColorScheme(event:any) {
  const file = event.target.files[0]

  if (!file) return

  const url = window.URL.createObjectURL(file)

  events.emit('changedColorScheme', url)
}

function createAnimation(event:any) {
  events.emit('createAnimation')
}

type Animation = {
  start:number,
  end:number,
  name:string,
  frameRate:number
}

function Preview() {
  const [animations, setAnimations] = useState<Animation[]>(defaultAnims)

  const updatePreview = (event: any, id: string) => {
    const imgElem = document.getElementById(id)
    imgElem?.classList.remove("hidden")


    const [file] = event.target.files
    if (file) {

      /* @ts-ignore eslint-disable-next-line no-undef */
      imgElem.src = URL.createObjectURL(file)
    }
  }

  return (
    <div className='bg-slate-700 flex flex-1 flex-col p-2'>
      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>Frame Width</h3>
        <input type='number' defaultValue={32} onChange={(e) => {
          events.emit('changed-framewidth', e.target.value)
        }} />
      </div>

      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>Frame Height</h3>
        <input type='number' defaultValue={64} onChange={(e) => {
          events.emit('changed-frameheight', e.target.value)
        }} />
      </div>

      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>Base animation</h3>
        <input type='file' className='file-select' id='animation' name='animation' onChange={(e) => {
          updatePreview(e, 'animation-preview')
          changeAnimation(e)
        }} />
        <img className='preview-img hidden' id='animation-preview' src='' alt="Please select a file"/>
      </div>

      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>UV Map</h3>
        <input type='file' className='file-select' id='animation' name='animation' onChange={(e) => {
          updatePreview(e, 'uv-preview')
          changeColorScheme(e)
        }} />
        <img className='preview-img hidden' id='uv-preview' src='' alt="Please select a file"/>
      </div>

      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>Current Animation</h3>
        <select>
          {
            animations.map((animation, index) => {
              return <option key={index} value={animation.name}>{animation.name}</option>
            })
          }
        </select>
      </div>

      <div className='flex flex-col mb-2'>
        <h3 className='text-white mb-2'>Animations</h3>
        <div>
          {
            animations.map((animation, index) => {
              return (
                <div key={index} className='flex flex-row px-2 border-b border-gray-400'>
                  <p className='text-white flex flex-1'>{animation.name}</p>

                  <p className='text-white flex flex-1'>start: {animation.start}</p>
                  <p className='text-white flex flex-1'>end: {animation.end}</p>
                  <p className='text-white mr-4'>fr: {animation.frameRate}</p>

                  <div className='cursor-pointer' onClick={() => setAnimations(animations.filter(a => a.name !== animation.name))}>
                    <p className='text-red-600'>Delete</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className='bg-green-500 cursor-pointer' onClick={createAnimation}>
          <p>Download animation</p>
      </div>
    </div>
  )
}

export default Preview;