const ampSrc = document.querySelector('#amplitude');
const waveSrc = document.querySelector('#wavespeed');
const freqSrc = document.querySelector('#frequency');
const debugSrc = document.querySelector('#showdebug');
const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
const imgUrl = './ppanic.png';
let img;
let ts = 0;

loadImage();

async function loadImage() {
  img = new Image();
  img.src = imgUrl;
  await img.decode();
  can.width = img.width;
  can.height = img.height * 2;
  animate(ts);
}

function drawReflection() {
  ctx.drawImage(img, 0, 0);
  for (let i=0; i <= img.height; i++) {
    // determine y to sample
    const offset = (img.height - i - 1);
    const ratio = i / img.height;
    const amplitude = Number(ampSrc.value) * ratio;
    const waveSpeed = Number(waveSrc.value) / 10000;
    const frequency =  Math.sin(Number(freqSrc.value) / (ratio) + (ts * waveSpeed));
    const reflection = amplitude * frequency;
    let y = Math.floor(offset + reflection); // int sampling points only
    y = Math.min(Math.max(y, 0), img.height); // clamp to source image

    if (debugSrc.checked) {
      // debug code for viewing wave offsets
      ctx.fillStyle = `rgb(${reflection + 128},${reflection + 128},${reflection + 128})`;
      ctx.fillRect(0, img.height + i, can.width, 1);
    } else {
      ctx.drawImage(can, 0, y, can.width, 1, 0, img.height - 1 + i, can.width, 1);
    }
  }
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  drawReflection();
  ts = timestamp;
}