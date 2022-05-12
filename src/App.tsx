import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import './App.css'

import PreviewScene from './scenes/preview'
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



let createdCanvas = false
function App() {
  const [createOpen, setCreateOpen] = useState(true)

  const [file1Selected, setFile1Selected] = useState(false)
  const [file2Selected, setFile2Selected] = useState(false)

  useEffect(() => {
    if (createdCanvas) return

    new Phaser.Game({
      type: Phaser.WEBGL,
      title: 'AnimationSystem',
      pixelArt: true,
      scale: {
        parent: 'phaserContainer',
        // mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH,
        height: '100%',
        width: '100%',
      },
      
      backgroundColor: '#000',
      scene: [PreviewScene],
    })

    createdCanvas = true
  }, [])

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

  function clearInputFiles() {
    const inputs = document.querySelectorAll(".file-select")
  
    inputs.forEach((i: any) => {
      i.value = null
    })
  
    setFile1Selected(false)
    setFile2Selected(false)  
  
    //clear the image previews
    const previews = document.querySelectorAll(".preview-img")
  
    previews.forEach((p: any) => {
      p.classList.add('hidden')
    })
  
  }

  const toggleApp = () => {
    setCreateOpen(!createOpen)
    clearInputFiles()
  }

  return (
    <div className="App">
      <h1>Phaser 3 - UV Mapping Tool</h1>
      <section id="App-body">
        <div id='phaserContainer' />
        <div className='assetContainer'>
          <div className='app-toggle'>
            <button className='button-switch' id='create' disabled={createOpen}
              onClick={toggleApp}
            >create</button>
            <button className='button-switch' id='preview' disabled={!createOpen}
              onClick={toggleApp}
            >preview</button>

          </div>
          <section id='files'>
            <div className='file'>
              <h3>{createOpen ? "UV animation base:" : "Animation Data:"}</h3>
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
              <h3>{createOpen ? "UV unwrap map:" : "Texture map:"}</h3>
              <input type='file' className='file-select' id='colorscheme' name='colorscheme' onChange={(e) => {
                updatePreview(e, 'file-2')
                changeAnimation(e)}
               } />
              <div className='preview'>
                <img className='preview-img hidden' id='file-2' src='' alt="Please select a file"/>
                {!file2Selected? "Please select a file" : <></>}
              </div>
            </div>
          </section>
          <div className='button' onClick={convertAnimation}>Convert to animation data</div>
        </div>
      </section>
    </div>
  )
}

export default App