const ampSrc = document.querySelector('#amplitude');
const waveSrc = document.querySelector('#wavespeed');
const freqSrc = document.querySelector('#frequency');
const debugSrc = document.querySelector('#showdebug');
const recordBtn = document.querySelector('#recordbtn');
const dlLink = document.querySelector('#dllink');
const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
const canStream = can.captureStream();
const imgUrl = './ppanic.png';
let img;
let ts = 0;
let animFrame;
let imgWidth;
let imgHeight;

let recorder;
let endTime = 0;

can.addEventListener('dragover', evt => {
  evt.preventDefault();
});

can.addEventListener('drop', handleDrop);

recordBtn.addEventListener('click', record);

loadImage();

async function loadImage(src) {
  img = new Image();
  img.src = src || imgUrl;
  await img.decode();
  imgHeight = Math.min(img.height, 200);
  imgWidth = Math.floor(imgHeight * (img.width / img.height));
  can.width = imgWidth;
  can.height = imgHeight * 2;
  if (!animFrame) {
    animate(ts);
  }
}

function drawReflection() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, can.width, can.height);
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  const waveSpeed = Number(waveSrc.value) / 10000;
  const wavePosition = ts * waveSpeed;
  for (let i = 0; i <= imgHeight; i++) {
    // determine y to sample
    const offset = (imgHeight - i - 1);
    const ratio = i / imgHeight;
    const amplitude = Number(ampSrc.value) * ratio;
    const frequency = Math.sin(Number(freqSrc.value) / (ratio) + wavePosition);
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

  if (debugSrc.checked) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(can.width - 20, can.height - 20)
    ctx.arc(can.width - 20, can.height - 20, 10, 0, ((1000 * wavePosition) % (Math.PI * 2000))/1000);
    ctx.lineTo(can.width - 20, can.height - 20)
    ctx.fill();
  }
}

function animate(timestamp) {
  animFrame = requestAnimationFrame(animate);
  drawReflection();
  if (recorder && ts > endTime) {
    recorder.stop();
  }
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

function record() {
  dlLink.setAttribute('href', '');
  dlLink.textContent = '';
  recordBtn.setAttribute('disabled', true);
  recordBtn.textContent = 'Generating WebM video...';
  const chunks = [];
  const waveNum = Number(waveSrc.value);
  endTime = waveNum === 0 ? ts + 1 : ts + (60 * 1000 / waveNum);
  recorder = new MediaRecorder(canStream, {
    mimeType: 'video/webm; codecs="vp8"',
    bitsPerSecond: 1600*1024*1024,
  });

  recorder.onstop = () => {
    var blob = new Blob(chunks, { 'type' : 'video/webm; codecs="vp8"' });
    dlLink.setAttribute('href', URL.createObjectURL(blob));
    dlLink.textContent = 'DOWNLOAD';
    recordBtn.removeAttribute('disabled');
    recordBtn.textContent = 'Get WebM Download Link';
    recorder = null;
  };

  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  recorder.start();
}