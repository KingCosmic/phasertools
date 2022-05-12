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
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      parent: 'phaserContainer',
      backgroundColor: '#000',
      scene: [PreviewScene],
    })

    createdCanvas = true
  }, [])

  return (
    <div className="App">
      <div id='phaserContainer' />
      <div className='assetContainer'>
        <input type='file' id='animation' name='animation' onChange={changeAnimation} />

        <input type='file' id='colorscheme' name='colorscheme' onChange={changeColorScheme} />

        <div className='button' onClick={convertAnimation}>Convert to animation data</div>
      </div>
    </div>
  )
}

export default App
