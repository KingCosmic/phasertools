import Phaser from 'phaser'

interface Config {
  lookupKey:string
  spriteSheet: {
    key:string
    frameWidth:number
    frameHeight:number
  }
  animations: {
    key:string
    frameRate:number
    startFrame:number
    endFrame:number
    repeat?:number
  }[]
}

export function convertAnimation(game:Phaser.Game, config:Config) {
  // Create color lookup from palette image.
  var colorLookup: { [key:string]:{ x:number, y:number } } = {}
  var createdAnims:string[] = []

  const lookupWidth = game.textures.get(config.lookupKey).getSourceImage().width

  var canvasTexture, canvas, context, imageData, pixelArray;

  var sheet = game.textures.get(config.lookupKey).getSourceImage()

  // Create a canvas to draw new image data onto.
  canvasTexture = game.textures.createCanvas(config.lookupKey + '-temp', sheet.width, sheet.height);
  // @ts-ignore
  canvas = canvasTexture.getSourceImage();
  // @ts-ignore
  context = canvas.getContext('2d');

  // Copy the sheet.
  context.drawImage(sheet, 0, 0);

  // Get image data from the new sheet.
  imageData = context.getImageData(0, 0, sheet.width, sheet.height);
  pixelArray = imageData.data;

  let x = 0;
  let y = 0;

  for (var p = 0; p < pixelArray.length / 4; p++) {
    var index = 4 * p;

    var r = pixelArray[index];
    var g = pixelArray[++index];
    var b = pixelArray[++index];
    var alpha = pixelArray[++index];

    // increment our x value
    x = (p % lookupWidth) + 1
    y = (Math.floor(p / lookupWidth)) + 1

    // If this is a transparent pixel, ignore, move on.
    if (alpha === 0) {
      continue
    }

    // grab our position in the color texture based off it's color
    colorLookup[`${r}-${g}-${b}`] = { x, y }
  }

  // Create sheets and animations from base sheet.
  sheet = game.textures.get(config.spriteSheet.key).getSourceImage()
  var atlasKey, anim, animKey;

  // Iterate over each palette.
  atlasKey = config.spriteSheet.key + '-' + 'converted';

  // Create a canvas to draw new image data onto.
  canvasTexture = game.textures.createCanvas(config.spriteSheet.key + '-temp', sheet.width, sheet.height);
  // @ts-ignore
  canvas = canvasTexture.getSourceImage();
  // @ts-ignore
  context = canvas.getContext('2d');

  // Copy the sheet.
  context.drawImage(sheet, 0, 0);

  // Get image data from the new sheet.
  imageData = context.getImageData(0, 0, sheet.width, sheet.height);
  pixelArray = imageData.data;

  // Iterate through every pixel in the image.
  for (var p = 0; p < pixelArray.length / 4; p++) {
    var index = 4 * p;

    var r = pixelArray[index];
    var g = pixelArray[++index];
    var b = pixelArray[++index];
    var alpha = pixelArray[++index];

    // If this is a transparent pixel, ignore, move on.
    if (alpha === 0) {
      continue
    }

    // console.log(r, g, b, 'lookup', colorLookup)

    // grab our position in the color texture based off it's color
    const pos = colorLookup[`${r}-${g}-${b}`]

    // if this color doesn't exist in the lookup texture just error out.
    if (!pos) {
      console.error('couldnt find color in lookup texture')
      console.log(`${r}-${g}-${b}`, 'vs', colorLookup)
      continue
    }

    pixelArray[--index] = b;

    // replace green with y value
    pixelArray[--index] = pos.y;

    // replace red with x value
    pixelArray[--index] = pos.x;
  }

  // Put our modified pixel data back into the context.
  context.putImageData(imageData, 0, 0);

  // Add the canvas as a sprite sheet to the game.
  // @ts-expect-error
  game.textures.addSpriteSheet(atlasKey, canvasTexture.getSourceImage(), {
    frameWidth: config.spriteSheet.frameWidth,
    frameHeight: config.spriteSheet.frameHeight,
  });

  // Iterate over each animation.
  for (var a = 0; a < config.animations.length; a++) {
    anim = config.animations[a];
    animKey = atlasKey + '-' + anim.key;

    // Add the animation to the game.
    game.anims.create({
      key: animKey,
      frames: game.anims.generateFrameNumbers(atlasKey, { start: anim.startFrame, end: anim.endFrame }),
      frameRate: anim.frameRate,
      repeat: anim.repeat === undefined ? -1 : anim.repeat
    });

    createdAnims.push(animKey)
  }

  // download the converted image before deleting temp textures.

  // @ts-ignore
  var image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

  // create temporary link  
  var tmpLink = document.createElement( 'a' );
  tmpLink.download = 'converted-animation.png';
  tmpLink.href = image;

  // temporarily add link to body and initiate the download
  document.body.appendChild( tmpLink );
  tmpLink.click();
  document.body.removeChild( tmpLink );

  // destroy temp texture.
  game.textures.get(config.spriteSheet.key + '-temp').destroy();
  game.textures.get(config.lookupKey + '-temp').destroy();

  return createdAnims
}






export function convertAnimationToSpriteSheet(game:Phaser.Game, config:Config, shouldDownload:boolean = true) {
  // Create color lookup from palette image.
  var colorLookup: { [key:string]:{ x:number, y:number } } = {}
  var positionLookup: { [key:string]:{ r:number, g:number, b:number } } = {}
  var createdAnims:string[] = []


  var canvasTexture, canvas, context, imageData, pixelArray;

  // grab our sheet
  var sheet = game.textures.get(config.lookupKey).getSourceImage()

  // grab our width
  const lookupWidth = sheet.width

  // Create a canvas to draw new image data onto.
  canvasTexture = game.textures.createCanvas(config.lookupKey + '-temp', sheet.width, sheet.height);
  // @ts-ignore
  canvas = canvasTexture.getSourceImage();
  // @ts-ignore
  context = canvas.getContext('2d');

  // Copy the sheet.
  context.drawImage(sheet, 0, 0);

  // Get image data from the new sheet.
  imageData = context.getImageData(0, 0, sheet.width, sheet.height);
  pixelArray = imageData.data;

  let x = 0;
  let y = 0;

  for (var p = 0; p < pixelArray.length / 4; p++) {
    var index = 4 * p;

    var r = pixelArray[index];
    var g = pixelArray[++index];
    var b = pixelArray[++index];
    var alpha = pixelArray[++index];

    // increment our x value
    x = (p % lookupWidth) + 1
    y = (Math.floor(p / lookupWidth)) + 1

    // If this is a transparent pixel, ignore, move on.
    if (alpha === 0) {
      continue
    }

    // grab our position in the color texture based off it's color
    colorLookup[`${r}-${g}-${b}`] = { x, y }
    positionLookup[`${x}-${y}`] = { r, g, b }
  }

  // Create sheets and animations from base sheet.
  sheet = game.textures.get(config.spriteSheet.key).getSourceImage()
  var atlasKey, anim, animKey;

  // Iterate over each palette.
  atlasKey = config.spriteSheet.key + '-' + 'converted';

  // Create a canvas to draw new image data onto.
  canvasTexture = game.textures.createCanvas(config.spriteSheet.key + '-temp', sheet.width, sheet.height);
  // @ts-ignore
  canvas = canvasTexture.getSourceImage();
  // @ts-ignore
  context = canvas.getContext('2d');

  // Copy the sheet.
  context.drawImage(sheet, 0, 0);

  // Get image data from the new sheet.
  imageData = context.getImageData(0, 0, sheet.width, sheet.height);
  pixelArray = imageData.data;

  // Iterate through every pixel in the image.
  for (var p = 0; p < pixelArray.length / 4; p++) {
    var index = 4 * p;

    var r = pixelArray[index];
    var g = pixelArray[++index];
    var b = pixelArray[++index];
    var alpha = pixelArray[++index];

    // If this is a transparent pixel, ignore, move on.
    if (alpha === 0) {
      continue
    }

    // grab our position in the color texture based off it's color
    const color = positionLookup[`${r}-${g}`]

    // if this color doesn't exist in the lookup texture just error out.
    if (!color) {
      console.error('couldnt find color in position texture')
      console.log(`${r}-${g}`, 'vs', positionLookup)
      continue
    }

    console.log(color)

    pixelArray[--index] = color.b;

    // replace green with y value
    pixelArray[--index] = color.g;

    // replace red with x value
    pixelArray[--index] = color.r;
  }

  // Put our modified pixel data back into the context.
  context.putImageData(imageData, 0, 0);

  // Add the canvas as a sprite sheet to the game.
  // @ts-expect-error
  game.textures.addSpriteSheet(atlasKey, canvasTexture.getSourceImage(), {
    frameWidth: config.spriteSheet.frameWidth,
    frameHeight: config.spriteSheet.frameHeight,
  });

  // Iterate over each animation.
  for (var a = 0; a < config.animations.length; a++) {
    anim = config.animations[a];
    animKey = atlasKey + '-' + anim.key;

    // Add the animation to the game.
    game.anims.create({
      key: animKey,
      frames: game.anims.generateFrameNumbers(atlasKey, { start: anim.startFrame, end: anim.endFrame }),
      frameRate: anim.frameRate,
      repeat: anim.repeat === undefined ? -1 : anim.repeat
    });

    createdAnims.push(animKey)
  }

  // download the converted image before deleting temp textures.

  // here is the most important part because if you dont replace you will get a DOM 18 exception.
  // @ts-ignore
  var image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

  if (!shouldDownload) {
    // create temporary link
    var tmpLink = document.createElement( 'a' );
    tmpLink.download = `${config.spriteSheet.key}-${config.lookupKey}.png`;
    tmpLink.href = image;

    // temporarily add link to body and initiate the download
    document.body.appendChild( tmpLink );
    tmpLink.click();
    document.body.removeChild( tmpLink );
  }

  // destroy temp texture.
  game.textures.get(config.spriteSheet.key + '-temp').destroy();
  game.textures.get(config.lookupKey + '-temp').destroy();

  return { key: atlasKey, anims: createdAnims }
}



function createUVUnwrap() {
  
}