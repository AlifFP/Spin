const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const wheelRadius = canvas.width / 2;
const segments = [
  { color: '#FF5733', label: 'Prize 1' },
  { color: '#33C1FF', label: 'Prize 2' },
  { color: '#33FF8A', label: 'Prize 3' },
  { color: '#FF33A6', label: 'Prize 4' },
  { color: '#FFC133', label: 'Prize 5' },
  { color: '#8E33FF', label: 'Prize 6' },
  { color: '#33FFD1', label: 'Prize 7' },
  { color: '#FF8C33', label: 'Prize 8' }
];
const segmentCount = segments.length;
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');
let currentAngle = 0;
let isSpinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const anglePerSegment = (2 * Math.PI) / segmentCount;
  ctx.lineWidth = 2;
  ctx.font = 'bold 16px Poppins';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';

  for(let i=0; i<segmentCount; i++) {
    const segment = segments[i];
    const startAngle = currentAngle + i * anglePerSegment;
    const endAngle = startAngle + anglePerSegment;
    // Draw segment
    ctx.beginPath();
    ctx.moveTo(wheelRadius, wheelRadius);
    ctx.arc(wheelRadius, wheelRadius, wheelRadius - 5, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(wheelRadius, wheelRadius);
    ctx.rotate(startAngle + anglePerSegment/2);
    ctx.fillStyle = '#fff';
    ctx.fillText(segment.label, wheelRadius - 25, 0);
    ctx.restore();
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spin() {
  if(isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = '';
  const spins = Math.floor(Math.random() * 4) + 4; // between 4 and 7 spins
  const randomSegment = Math.floor(Math.random() * segmentCount);
  // Calculate target angle so segment aligns with pointer at top (pointer is at 90 degrees)
  let targetAngle = (2*Math.PI * spins) + (3*Math.PI/2) - (randomSegment * 2*Math.PI / segmentCount) - ((2*Math.PI)/segmentCount)/2;
  const duration = 5000; // 5 seconds
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progress);
    currentAngle = targetAngle * easedProgress;
    drawWheel();
    if(progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      resultDiv.textContent = `You got: ${segments[randomSegment].label}!`;
    }
  }
  requestAnimationFrame(animate);
}

spinBtn.addEventListener('click', spin);
drawWheel();
