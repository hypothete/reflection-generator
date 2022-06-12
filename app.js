const ampSrc = document.querySelector('#amplitude');
const waveSrc = document.querySelector('#wavespeed');
const freqSrc = document.querySelector('#frequency');
const debugSrc = document.querySelector('#showdebug');
const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
const imgUrl = './ppanic.png';
let img;
let ts = 0;
let animFrame;
let imgWidth;
let imgHeight;

can.addEventListener('dragover', evt => {
  evt.preventDefault();
});

can.addEventListener('drop', handleDrop);

loadImage();

async function loadImage(src) {
  img = new Image();
  img.src = src || imgUrl;
  await img.decode();
  imgHeight = Math.min(img.height, 200);
  imgWidth = Math.floor(imgHeight * (img.width / img.height));
  can.width = imgWidth;
  can.height = imgHeight * 2;
  if(!animFrame) {
    animate(ts);
  }
}

function drawReflection() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,can.width, can.height);
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  for (let i=0; i <= imgHeight; i++) {
    // determine y to sample
    const offset = (imgHeight - i - 1);
    const ratio = i / imgHeight;
    const amplitude = Number(ampSrc.value) * ratio;
    const waveSpeed = Number(waveSrc.value) / 10000;
    const frequency =  Math.sin(Number(freqSrc.value) / (ratio) + (ts * waveSpeed));
    const reflection = amplitude * frequency;
    let y = Math.floor(offset + reflection); // int sampling points only
    y = Math.min(Math.max(y, 0), imgHeight); // clamp Y

    if (debugSrc.checked) {
      // debug code for viewing wave offsets
      ctx.fillStyle = `rgb(${reflection + 128},${reflection + 128},${reflection + 128})`;
      ctx.fillRect(0, imgHeight + i, imgWidth, 1);
    } else {
      ctx.drawImage(can, 0, y, imgWidth, 1, 0, imgHeight - 1 + i, imgWidth, 1);
    }
  }
}

function animate(timestamp) {
  animFrame = requestAnimationFrame(animate);
  drawReflection();
  ts = timestamp;
}

function handleDrop(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  const { files } = evt.dataTransfer;
  const file = files[0];
  if (file) {
    const fileUrl = URL.createObjectURL(file);
    loadImage(fileUrl);
  }
  return false;
}
