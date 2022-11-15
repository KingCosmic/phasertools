import React, { useState } from 'react';

import events from './systems/events'

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

function convertAnimation(event:any) {
  events.emit('convertAnimation')
}


function CreateBase() {
  const [file1Selected, setFile1Selected] = useState(false)
  const [file2Selected, setFile2Selected] = useState(false)

  const updatePreview = (event: any, id: string) => {
    const imgElem = document.getElementById(id)
    imgElem?.classList.remove("hidden")


    if(id === 'file-1') setFile1Selected(true)
    else setFile2Selected(true)


    const [file] = event.target.files
    if(file) {

      /* @ts-ignore eslint-disable-next-line no-undef */
      imgElem.src = URL.createObjectURL(file)

    }
  }

  return (
    <section id='files'>
      <div className='file'>
        <h3>UV Base Anim:</h3>
        <input type='file' className='file-select' id='animation' name='animation' onChange={(e) => {
          updatePreview(e, 'file-1')
          changeAnimation(e)
          }} />
        <div className='preview'>
          <img className='preview-img hidden' id='file-1' src='' alt="Please select a file"/>
          {!file1Selected? "Please select a file" : <></>}
        </div>
      </div>
      
      <div className='file'>
        <h3>UV Base Unwrap:</h3>
        <input type='file' className='file-select' id='colorscheme' name='colorscheme' onChange={(e) => {
          updatePreview(e, 'file-2')
          changeColorScheme(e)}
        } />
        <div className='preview'>
          <img className='preview-img hidden' id='file-2' src='' alt="Please select a file"/>
          {!file2Selected? "Please select a file" : <></>}
        </div>
      </div>
      <div className='button' onClick={convertAnimation}>Save Base Anim</div>
    </section>
  );
}

export default CreateBase;