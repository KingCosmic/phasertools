import { useEffect, useState } from 'react'
import Phaser from 'phaser'
import './App.css'

import PreviewScene from './scenes/preview'
import Preview from './Preview'


let createdCanvas = false
function App() {
  const [createOpen, setCreateOpen] = useState(true)

  useEffect(() => {
    if (createdCanvas) return

    new Phaser.Game({
      type: Phaser.WEBGL,
      title: 'AnimationSystem',
      pixelArt: true,
      scale: {
        parent: 'phaserContainer',
        // mode: Phaser.Scale.RESIZE, 
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        height: '100%',
        width: '100%',
      },
      
      backgroundColor: '#000',
      scene: [PreviewScene],
    })

    createdCanvas = true
  }, [])

  const toggleApp = () => {
    setCreateOpen(!createOpen)
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <h1 className="text-center font-bold text-white bg-gray-900 p-4" style={{'height': '10%'}}>Phaser 3 - UV Mapping Tool</h1>
      <section className="flex flex-1 flex-row" style={{'height': '90%'}}>
        <div id="phaserContainer" className="w-3/4" />
        <div className='flex w-1/4 flex-col justify-between bg-purple-600 overflow-y-auto'>
          <div className='flex p-3 bg-blue-600 justify-center gap-3'>
            <button className='button-switch' id='create' disabled={createOpen}
              onClick={toggleApp}
            >create</button>
            <button className='button-switch' id='preview' disabled={!createOpen}
              onClick={toggleApp}
            >preview</button>
          </div>

          <Preview />
        </div>
      </section>
    </div>
  )
}

export default App