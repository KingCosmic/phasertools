import { useEffect } from 'react'
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

  return (
    <div className="App">
      <h1>Phaser 3 - UV Mapping Tool</h1>
      <section id="App-body">
        <div id='phaserContainer' />
        <div className='assetContainer'>
          <div className='app-toggle'>
            <button className='button-switch' id='create' disabled={true}>create</button>
            <button className='button-switch' id='preview'>preview</button>

          </div>
          <section id='files'>
            <div className='file'>
              <h3>UV animation base:</h3>
              <input type='file' className='file-select' id='animation' name='animation' onChange={changeAnimation} />
              <div className='preview'>
                Please select a file
              </div>
            </div>
            
            <div className='file'>
              <h3>UV unwrap map:</h3>
              <input type='file' className='file-select' id='colorscheme' name='colorscheme' onChange={changeColorScheme} />
              <div className='preview'>
                Please select a file
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
