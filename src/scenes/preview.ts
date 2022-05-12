import Phaser, { GameObjects } from 'phaser'

import UVPipeline from 'phaser3-uv-mapping'

import events from '../systems/events'

import animUrl from '../assets/default-anim.png'
import colorUrl from '../assets/default-color.png'
import { convertAnimation } from '../systems/colorswap'

class Preview extends Phaser.Scene {

  sprite!:GameObjects.Sprite
  pipeline!:UVPipeline

  internalAnimKey = 0
  internalColorKey = 0

  constructor() {
    super('preview')
  }

  preload() {
    this.load.spritesheet('default-anim', animUrl, { frameWidth: 15, frameHeight: 15 })
    this.load.image('default-color', colorUrl)
  }

  create() {
    // grab our camera for easy centering.
    const cam = this.cameras.main

    cam.setBackgroundColor('rgba(255, 255, 255)')

    cam.setZoom(10)

    // create the visual sprite we plan to show color changes on.
    this.sprite = this.add.sprite(cam.centerX, cam.centerY, 'default-anim')

    // generate our default anim.
    this.anims.create({
      key: 'rotate',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('default-anim', { start: 0, end: 5 }),
      repeat: -1
    })

    // start playing the animation on our sprite.
    this.sprite.play('rotate')

    // @ts-ignore
    this.pipeline = this.renderer.pipelines.add('ColorMapFX', new UVPipeline(this.game, 'default-color'))

    this.sprite.setPipeline(this.pipeline)

    events.on('changedAnimation', (animUrl:string) => {
      console.log('changing animation')
      this.internalAnimKey++;
      this.load.image(`${this.internalAnimKey}-anim`, animUrl)
      this.load.once('complete', () => {
        console.log('loaded animation')
        // TODO: build animation then change it.
      })
      this.load.start()
    })

    events.on('changedColorScheme', (colorUrl:string) => {
      console.log('changing color')
      this.internalColorKey++;
      this.load.image(`${this.internalColorKey}-color`, colorUrl)
      this.load.once('complete', () => {
        console.log('loaded color')

        this.pipeline.changeDefaultUVTexture(`${this.internalColorKey}-color`)
      })
      this.load.start()
    })

    events.on('convertAnimation', () => {
      const lookupKey = (this.internalColorKey > 0) ? `${this.internalColorKey}-color` : 'default-color'
      const animKey = (this.internalAnimKey > 0) ? `${this.internalAnimKey}-anim` : 'default-anim'

      const anims = convertAnimation(this.game, {
        lookupKey,
        spriteSheet: {
          key: animKey,
          frameWidth: 15,
          frameHeight: 15
        },
        animations: [{
          key: 'rotate',
          frameRate: 7,
          startFrame: 0,
          endFrame: 5,
          repeat: -1
        }]
      })

      this.sprite.play(anims[0])
    })
  }

  update() {}
}

export default Preview