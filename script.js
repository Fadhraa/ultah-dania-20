const canvas = document.getElementById("skyCanvas");
const ctx = canvas.getContext("2d");

let width, height;

// UI Elements
const instructionPanel = document.getElementById("instructionPanel");
const startBtn = document.getElementById("startBtn");
const memoryModal = document.getElementById("memoryModal");
const memoryYear = document.getElementById("memoryYear");
const memoryText = document.getElementById("memoryText");
const closeMemoryBtn = document.getElementById("closeMemoryBtn");
const finalMessage = document.getElementById("finalMessage");

// State
let isGameActive = false;
let foundStarsCount = 0;
let clickedStars = [];

// Memories Data
const memories = [
  {
    year: "2019 (Awal Mula)",
    text: "Masa SMP. Pertama kali kita bertemu, masa dimana fadhra masi labil dan ga dewasa dengan perasaan. tahun ini juga menjadi tahun pertama kita ngobrol walaupun lewat wa, dan nga di sangka dengan awal yang seperti itu kita bisa sampai titik ini.",
  },
  {
    year: "2020",
    text: "Ini tahun dimana kita bertengkar hebat. kita lost contact selama beberapa waktu. jika disuruh ingat fadhra tidak ingin mengigat kita bertengkar karena saat itu fadhra merasa benar benar labil. tapi dari moment itu fadhra bisa jadi dirinya fadhra yang sekarang fadhra yang lebih dewasa dan lebih baik lagi.",
  },
  {
    year: "2021",
    text: "Tahun ini tahun fadhra memutuskan untuk fokus dengan dania dan menutup hati untuk orang lain. tahun ini juga menjadi tahun dimana fadhra mulai belajar untuk lebih dewasa dan lebih baik lagi. kita mulai mengobrol kembali walau melalui chat dan hampir tidak pernah ngobrol langsung. dan di tahun ini juga kita melakukan foto berdua pertama kali ya kan walau masi malu malu.",
  },
  {
    year: "2022",
    text: "Masa SMA kelas 10. pada saat pertama masuk sma kita masi canggung namun meski begitu kita berusaha tetep ngobrol mulai dari yang fadhra anuin hp nya dania, fadhra buatin dania bekal, fadhra minta sampulin buku dan yang lain nya. di tahun pertama masuk juga fadhra berharap bisa berkelas dengan dania. namun sistem tidak memberikan kesempatan itu huhu, jadi fadhra berharap di kelas 11 bisa sekelas sama dania",
  },
  {
    year: "2023",
    text: "Di tahun ini fadhra sedih karena fadhra gagal bisa sekelas sama dania, fadhra nangis pas mau berangkat ke sekolah karena harus berada di kelas yang berbeda dengan dania. fadhra mau putus asa, karena di kelas itu juga fadhra tidak terlalu banyak mengenal isinya. namun fadhra juga seneng di tahun ini meski kita beda kelas kita sudah mulai menghilangkan rasa canggung itu kita mulai terbiasa bertemu dan berbicara secara langsung. meski hanya sebatas moment fadhra bantu dania keluarin motor",
  },
  {
    year: "2024 -2025",
    text: "Ini adalah tahun dimana hubungan kita lagi berbunga bunga hehe karena ketika kelas 12 kita banyak menghabiskan waktu bareng main ke cfd, ke rumahnya fadhra / dania, pokok nya fadhra bener bener seneng di tahun ini walau ketika mendekati ujian kuliah fadhra takut kita ldr fadhra takut kita tidak bisa bertemu lagi. tapi ternyata ketakutan itu tidak terjadi hehe. dan di tahun ini juga fadhra mulai belajar untuk lebih dewasa dan lebih baik lagi.",
  },
  {
    year: "2025 - 2026",
    text: "Ini tahun Kuliah pertama kita dan ya benar saja yang fadhra takutin terjadi kita ldr, fadhra di surabaya dan dania di jember. memang fadhra takut kita lost contact tpi dari ldr ini fadhra belajar kalau mencintai seseorang tidak harus selalu bertemu. kita bangun komitmen kita mau nikah itu yang selalu fadhra inget ketika fadhra merasa takut kembali. jadi fadhra berusaha untuk terus menjaga hubungan ini",
  },
];

// Resize canvas
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resize);
resize();

// Star fields
const bgStars = [];
const numBgStars = 200;

for (let i = 0; i < numBgStars; i++) {
  bgStars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5,
    alpha: Math.random(),
  });
}

// Planets Setup
const planets = [
  { rx: 0.8, ry: 0.2, r: 40, colors: ["#ff9a9e", "#fecfef"], hasRing: true, tilt: Math.PI / 6 },
  { rx: 0.15, ry: 0.7, r: 25, colors: ["#a18cd1", "#fbc2eb"], hasRing: false, tilt: 0 },
  { rx: 0.6, ry: 0.85, r: 15, colors: ["#84fab0", "#8fd3f4"], hasRing: false, tilt: 0 },
  { rx: 0.85, ry: 0.75, r: 45, colors: ["#2b5876", "#4facfe"], hasRing: false, tilt: 0, isEarth: true }
];

// Shooting Stars Setup
let shootingStars = [];
function spawnShootingStar() {
  if (Math.random() < 0.02) { // 2% chance per frame
    shootingStars.push({
      x: Math.random() * width,
      y: 0,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 8 + 4,
      opacity: 1
    });
  }
}

// Milky Way Dust
const mwDust = [];
const numDust = 600;
for (let i = 0; i < numDust; i++) {
  let len = (Math.random() - 0.5) * 2;
  let spread = (Math.random() - 0.5) * (Math.random() * 0.2);
  mwDust.push({
    rx: len + spread,
    ry: len - spread,
    r: Math.random() * 1.5,
    alpha: Math.random() * 0.4
  });
}

// 7 special memory stars
let memoryStars = [];

function initMemoryStars() {
  memoryStars = [];
  const padding = 100; // Keep away from edges
  for (let i = 0; i < 7; i++) {
    memoryStars.push({
      id: i,
      // Try to space them out randomly but keeping somewhat readable constraints is tricky without a grid.
      // Using simple random for now but ensuring some padding.
      x: padding + Math.random() * (width - 2 * padding),
      y: padding + Math.random() * (height - 2 * padding),
      r: 4,
      alpha: 1,
      pulse: 0,
      found: false,
    });
  }
}
initMemoryStars();

// Render Loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Draw Sun
  ctx.save();
  let sunX = width * 0.1; // Upper left
  let sunY = height * 0.1;
  let sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150);
  sunGrad.addColorStop(0, "rgba(255, 255, 230, 1)");
  sunGrad.addColorStop(0.1, "rgba(255, 255, 200, 0.8)");
  sunGrad.addColorStop(0.4, "rgba(255, 200, 100, 0.2)");
  sunGrad.addColorStop(1, "rgba(255, 100, 50, 0)");
  
  ctx.fillStyle = sunGrad;
  ctx.globalCompositeOperation = "screen";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw Milky Way
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6);
  let hw = Math.max(width, height);
  mwDust.forEach(d => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
    ctx.arc(d.rx * hw, d.ry * hw * 0.5, d.r, 0, Math.PI * 2);
    ctx.fill();
  });
  
  let mwBand = ctx.createLinearGradient(0, -100, 0, 100);
  mwBand.addColorStop(0, "rgba(255,255,255,0)");
  mwBand.addColorStop(0.5, "rgba(130, 80, 200, 0.08)");
  mwBand.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = mwBand;
  ctx.globalCompositeOperation = "screen";
  ctx.fillRect(-hw, -100, hw * 2, 200);
  ctx.restore();

  // Draw Planets
  planets.forEach(p => {
    let px = width * p.rx;
    let py = height * p.ry;
    
    // Draw Ring (behind)
    if (p.hasRing) {
      ctx.beginPath();
      ctx.ellipse(px, py, p.r * 2.5, p.r * 0.5, p.tilt, 0, Math.PI);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    
    // Draw Planet Body
    let grad = ctx.createLinearGradient(px - p.r, py - p.r, px + p.r, py + p.r);
    grad.addColorStop(0, p.colors[0]);
    grad.addColorStop(1, p.colors[1]);
    
    ctx.beginPath();
    ctx.arc(px, py, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    // Add subtle glow
    ctx.shadowBlur = p.isEarth ? 25 : 15;
    ctx.shadowColor = p.colors[0];
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Draw Earth Continents if it's earth
    if (p.isEarth) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.clip(); // Ensure continents don't bleed outside the planet
        
        ctx.fillStyle = "rgba(132, 250, 176, 0.8)"; // Green continents
        ctx.beginPath();
        ctx.arc(px - p.r*0.2, py - p.r*0.2, p.r*0.6, 0, Math.PI * 2);
        ctx.arc(px + p.r*0.4, py + p.r*0.3, p.r*0.5, 0, Math.PI * 2);
        ctx.arc(px - p.r*0.1, py + p.r*0.6, p.r*0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Atmosphere
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw Ring (front)
    if (p.hasRing) {
      ctx.beginPath();
      ctx.ellipse(px, py, p.r * 2.5, p.r * 0.5, p.tilt, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  });

  // Spawn and Draw Shooting Stars
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let ss = shootingStars[i];
    ss.x -= ss.speed;
    ss.y += ss.speed;
    ss.opacity -= 0.01;
    
    if (ss.opacity <= 0) {
      shootingStars.splice(i, 1);
      continue;
    }

    let grad = ctx.createLinearGradient(ss.x, ss.y, ss.x + ss.length, ss.y - ss.length);
    grad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, ss.opacity)})`);
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x + ss.length, ss.y - ss.length);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw lines between clicked stars
  if (clickedStars.length > 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(216, 164, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.moveTo(clickedStars[0].x, clickedStars[0].y);
    for (let i = 1; i < clickedStars.length; i++) {
      ctx.lineTo(clickedStars[i].x, clickedStars[i].y);
    }
    ctx.stroke();
  }

  // Draw background stars
  bgStars.forEach((s) => {
    s.alpha += s.vAlpha;
    if (s.alpha <= 0 || s.alpha >= 1) s.vAlpha *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw memory stars
  if (isGameActive || foundStarsCount === 7) {
    memoryStars.forEach((s) => {
      s.pulse += 0.05;
      let currentR = s.r + Math.sin(s.pulse) * 1.5;

      ctx.beginPath();
      if (s.found) {
        // Dim down memory stars once found, they become part of the constellation
        ctx.fillStyle = "rgba(216, 164, 255, 1)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(216, 164, 255, 0.8)";
      } else {
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 255, 255, 1)";
      }

      ctx.arc(s.x, s.y, currentR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    });
  }

  requestAnimationFrame(animate);
}

animate();

// Audio element
const bgMusic = document.getElementById("bgMusic");

if (bgMusic) {
  bgMusic.volume = 0.5; // Set volume to 50%
  
  // Try to play immediately (this handles the autoplay attribute)
  let playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise.catch(_ => {
      // Browser blocked autoplay (User hasn't interacted with document yet)
      // Fallback: Wait for the user's VERY FIRST tap or click ANYWHERE on the screen
      console.log("Autoplay blocked: Waiting for first user interaction.");
      
      const playOnFirstInteraction = () => {
        bgMusic.play().catch(e => console.log("Final audio play error:", e));
        document.removeEventListener("click", playOnFirstInteraction);
        document.removeEventListener("touchstart", playOnFirstInteraction);
      };

      document.addEventListener("click", playOnFirstInteraction, { once: true });
      document.addEventListener("touchstart", playOnFirstInteraction, { once: true });
    });
  }
}

// Events
startBtn.addEventListener("click", () => {
  instructionPanel.classList.add("hidden");
  isGameActive = true;
});

// Click detection for canvas
canvas.addEventListener("click", (e) => {
  if (!isGameActive) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Check hit on memory stars
  for (let i = 0; i < memoryStars.length; i++) {
    let s = memoryStars[i];
    if (!s.found) {
      // Hit area has generous radius for ease (e.g., 20px)
      const dist = Math.hypot(mouseX - s.x, mouseY - s.y);
      if (dist < 25) {
        // Hit!
        s.found = true;
        clickedStars.push(s);
        foundStarsCount++;

        showMemory(i);
        break;
      }
    }
  }
});

function showMemory(index) {
  isGameActive = false; // pause clicking
  const memData = memories[index];
  memoryYear.textContent = memData.year;
  memoryText.textContent = memData.text;

  // Change button text for the final memory
  if (foundStarsCount === 7) {
    closeMemoryBtn.textContent = "Selesaikan Perjalanan";
  }

  memoryModal.classList.remove("hidden");
}

closeMemoryBtn.addEventListener("click", () => {
  memoryModal.classList.add("hidden");

  if (foundStarsCount === 7) {
    // Trigger climax
    triggerFinale();
  } else {
    isGameActive = true;
  }
});

function triggerFinale() {
  isGameActive = false; // no more clicking needed

  // Confetti!
  var duration = 15 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);

  // Fade out canvas stars to focus on message? (Optional)
  canvas.style.transition = "opacity 3s";
  canvas.style.opacity = "0.3";

  // Show big message
  setTimeout(() => {
    finalMessage.classList.remove("hidden");
  }, 1000);
}
