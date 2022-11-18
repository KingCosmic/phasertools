import Phaser, { GameObjects } from 'phaser'

import events from '../systems/events'

import { convertAnimation, convertAnimationToSpriteSheet } from '../systems/colorswap'

let frameWidth = 32
let frameHeight = 64

class Preview extends Phaser.Scene {

  sprite!:GameObjects.Sprite

  internalAnimKey = 0
  internalColorKey = 0

  constructor() {
    super('preview')
  }

  preload() {
    this.load.spritesheet('default-anim', '/assets/head-anim.png', { frameWidth, frameHeight })
    this.load.image('default-color', '/assets/head-test-uv.png')
    this.load.spritesheet('default', '/assets/head-test.png', { frameWidth, frameHeight })
  }

  create() {
    // grab our camera for easy centering.
    const cam = this.cameras.main

    cam.setZoom(10)

    // create the visual sprite we plan to show color changes on.
    this.sprite = this.add.sprite(cam.centerX, cam.centerY, '')

    // generate our default anim.
    this.anims.create({
      key: 'rotate',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('default', { start: 0, end: 3 }),
      repeat: -1
    })
 

    events.on('changedAnimation', (animUrl:string) => {
      console.log('changing animation')
      this.internalAnimKey++;
      this.load.image(`${this.internalAnimKey}-anim`, animUrl)
      this.load.once('complete', () => {
        console.log('loaded animation')
        // TODO: build animation then change it.

        const lookupKey = (this.internalColorKey > 0) ? `${this.internalColorKey}-color` : 'default-color'
        const animKey = (this.internalAnimKey > 0) ? `${this.internalAnimKey}-anim` : 'default-anim'

        const { key, anims } = convertAnimationToSpriteSheet(this.game, {
          lookupKey,
          spriteSheet: {
            key: animKey,
            frameWidth,
            frameHeight
          },
          animations: [{
            key: 'rotate',
            frameRate: 7,
            startFrame: 0,
            endFrame: 3,
            repeat: -1
          }]
        })

        this.sprite.play(anims[0])
      })
      this.load.start()
    })


    events.on('changedColorScheme', (colorUrl:string) => {
      console.log('changing color')
      this.internalColorKey++;
      this.load.image(`${this.internalColorKey}-color`, colorUrl)
      this.load.once('complete', () => {
        console.log('loaded color')

        const lookupKey = (this.internalColorKey > 0) ? `${this.internalColorKey}-color` : 'default-color'
        const animKey = (this.internalAnimKey > 0) ? `${this.internalAnimKey}-anim` : 'default-anim'

        const { key, anims } = convertAnimationToSpriteSheet(this.game, {
          lookupKey,
          spriteSheet: {
            key: animKey,
            frameWidth,
            frameHeight
          },
          animations: [{
            key: 'rotate',
            frameRate: 7,
            startFrame: 0,
            endFrame: 3,
            repeat: -1
          }]
        })

        this.sprite.play(anims[0])
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
          frameWidth,
          frameHeight
        },
        animations: [{
          key: 'rotate',
          frameRate: 7,
          startFrame: 0,
          endFrame: 3,
          repeat: -1
        }]
      })

      console.log(anims)
      this.sprite.play(anims[0])
    })

    events.on('createAnimation', () => {
      const lookupKey = (this.internalColorKey > 0) ? `${this.internalColorKey}-color` : 'default-color'
      const animKey = (this.internalAnimKey > 0) ? `${this.internalAnimKey}-anim` : 'default-anim'

      const { key, anims } = convertAnimationToSpriteSheet(this.game, {
        lookupKey,
        spriteSheet: {
          key: animKey,
          frameWidth,
          frameHeight
        },
        animations: [{
          key: 'rotate',
          frameRate: 7,
          startFrame: 0,
          endFrame: 3,
          repeat: -1
        }]
      })

      this.sprite.play(anims[0])
    })

    events.on('change-frameheight', (height:number) => {
      frameHeight = height
    })

    events.on('change-framewidth', (width:number) => {
      frameWidth = width
    })
  }

  update() {}
}

export default Preview