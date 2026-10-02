/* ================================
   STAGGERED REVEAL SYSTEM
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const groups = document.querySelectorAll(".reveal-group, .container");

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const items = entry.target.querySelectorAll(".reveal-item, .reveal");
          items.forEach((item, idx) => {
            item.style.transitionDelay = `${idx * 0.08}s`;
            item.classList.add("show");
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    groups.forEach(g => obs.observe(g));
  } else {
    document.querySelectorAll(".reveal-item, .reveal").forEach(i => i.classList.add("show"));
  }
});

/* ================================
   PROFILE PHOTO FALLBACK (SVG)
================================ */
const profile = document.getElementById("profilePhoto");
if (profile) {
  profile.onerror = () => {
    const svg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
        <rect width='100%' height='100%' fill='#F5E7C6'/>
        <circle cx='256' cy='256' r='200' fill='white'/>
        <text x='256' y='295' font-size='120' font-family='Inter' font-weight='800' text-anchor='middle' fill='#222'>
          SS
        </text>
      </svg>
    `);
    profile.src = `data:image/svg+xml;utf8,${svg}`;
  };
}

/* ================================
   PROJECT MODAL SYSTEM
================================ */
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
let lastFocused = null;

const projectData = {
  kirby: `
    <h3>Kirby – Industrial IoT Indoor Air Quality Sensor</h3>
    <img src="assets/Kirby-0.png" alt="Kirby IAQ Sensor">
    <p style="text-align: center;"><strong>nRF52840 • Zephyr RTOS • BLE + LoRaWAN • FUOTA</strong></p>
    <p><em>Delivered a production-ready multi-radio IoT device for continuous, ultra-low-power indoor air quality monitoring.</em></p>
    <ul>
      <li>Led end-to-end firmware development from prototype to pre-production for a battery-powered sensing platform</li>
      <li>Architected modular Zephyr RTOS-based firmware separating sensing, communication, and power subsystems</li>
      <li>Implemented dual-radio communication (BLE + LoRaWAN) for flexible short- and long-range connectivity</li>
      <li>Developed secure FUOTA mechanisms over BLE and LoRaWAN</li>
      <li>Integrated multi-sensor stack with radar-based presence detection</li>
      <li>Performed board bring-up, RF validation, and power optimization for low-power operation</li>
    </ul>`,

  ultra: `
    <h3>Ultra Paws – Low-Power Pet Health Monitoring Wearable</h3>
    <img src="assets/Ultrapaws-0.png" alt="Ultra Paws">
    <p style="text-align: center;"><strong>nRF52833 • BLE • Ultra-Low Power Design</strong></p>
    <p><em>Developed a wearable system for real-time paw pressure monitoring with optimized battery performance.</em></p>
    <ul>
      <li>Owned complete firmware development and BLE device architecture</li>
      <li>Designed custom BLE GATT services for high-resolution sensor data transmission</li>
      <li>Engineered ultra-low power operation using event-driven design and sleep optimization</li>
      <li>Performed board bring-up, validation, and real-world field testing</li>
      <li>Ensured reliable interoperability across mobile platforms</li>
    </ul>`,

  smartmeter: `
    <h3>DLMS/COSEM Smart Energy Meter Firmware (Utility-Grade System)</h3>
    <img src="assets/smartmeter.png" alt="Smart Energy Meter">
    <p style="text-align: center;"><strong>nRF52840 • Zephyr RTOS • DLMS/COSEM • BLE • SPI</strong></p>
    <p><em>Developed a standards-compliant smart metering firmware for utility-grade energy measurement and communication.</em></p>
    <ul>
      <li>Designed and developed firmware targeting DLMS/COSEM (IEC 62056) compliance</li>
      <li>Architected layered system separating protocol, metering, and storage domains</li>
      <li>Implemented DLMS protocol features including association handling and OBIS-based data modeling</li>
      <li>Developed BLE-based DLMS transport using GATT for wireless communication</li>
      <li>Integrated ADE9153A metering IC over SPI for real-time energy measurement</li>
      <li>Designed secure framework aligned with AES-GCM (DLMS Security Suite 1)</li>
      <li>Implemented persistent storage using NVS for key and state management</li>
    </ul>`,

  rail: `
    <h3>Automatic Railway Coupling Controller (Safety-Critical System)</h3>
    <img src="assets/rail-1.png" alt="Railway Coupling">
    <p style="text-align: center;"><strong>NXP S32K144 • Bare-Metal C • Deterministic Control</strong></p>
    <p><em>Engineered a safety-critical embedded control system for automated railway coupling operations.</em></p>
    <ul>
      <li>Developed deterministic bare-metal firmware with strict real-time timing constraints</li>
      <li>Designed fault-tolerant state machine with safe recovery mechanisms</li>
      <li>Implemented diagnostics and fault logging aligned with safety requirements</li>
      <li>Performed on-system integration and validation in real operating environments</li>
      <li>Ensured reliable operation under field conditions through robust control logic</li>
    </ul>`,

  heater: `
    <h3>Precision Heater & Peltier Temperature Controller</h3>
    <img src="assets/heater-0.png" alt="Heater Controller">
    <p style="text-align: center;"><strong>Closed-Loop PID • High-Accuracy Control</strong></p>
    <p><em>Designed a high-precision thermal control system for stable and responsive temperature regulation.</em></p>
    <ul>
      <li>Implemented closed-loop PID control for precise temperature stability (±0.2°C)</li>
      <li>Engineered coordinated heating and cooling using Peltier modules</li>
      <li>Optimized ADC sampling and PWM control loop for fast response</li>
      <li>Designed scalable architecture supporting multi-zone expansion</li>
      <li>Integrated safety mechanisms for thermal protection</li>
    </ul>`,

  test: `
    <h3>Automated Production Test System for Power Modules</h3>
    <img src="assets/test-0.png" alt="Production Test Fixture">
    <p style="text-align: center;"><strong>STM32 • Python • PyQt • Instrument Control</strong></p>
    <p><em>Developed an automated validation system to improve manufacturing efficiency and test reliability.</em></p>
    <ul>
      <li>Designed end-to-end automated test framework for DC-DC converter validation</li>
      <li>Developed STM32 firmware and Python-based PyQt GUI for operator workflows</li>
      <li>Integrated external instruments (DMMs, programmable loads) for automated measurements</li>
      <li>Implemented calibration, data acquisition, and pass/fail evaluation logic</li>
      <li>Reduced test cycle time by ~80%, significantly improving production throughput</li>
    </ul>`,

  ev: `
    <h3>EV Charging Station Controller (Cellular IoT)</h3>
    <img src="assets/ev-0.png" alt="EV Charger">
    <p style="text-align: center;"><strong>LTE-M • Embedded Networking</strong></p>
    <p><em>Enabled reliable cellular communication for EV charging infrastructure in real-world network conditions.</em></p>
    <ul>
      <li>Configured and validated LTE-M connectivity across multiple carriers</li>
      <li>Analyzed network performance and optimized signal reliability</li>
      <li>Implemented reconnection and fallback mechanisms for robust field operation</li>
    </ul>`,

  tracker: `
    <h3>Tracker Control Unit – Hardware Bring-Up & Validation</h3>
    <img src="assets/tracker-0.png" alt="Tracker Control Unit">
    <p style="text-align: center;"><strong>STM32U585 • Embedded Validation</strong></p>
    <p><em>Delivered firmware-driven bring-up and validation for a new embedded control platform.</em></p>
    <ul>
      <li>Owned bring-up process from schematic review to firmware validation</li>
      <li>Integrated peripherals including FRAM, sensors, and motor interfaces</li>
      <li>Developed firmware-based validation tests for hardware verification</li>
      <li>Enabled smooth transition from development to production readiness</li>
    </ul>`,

  ulp: `
    <h3>Ultra-Low Power Wireless Pressure Sensor</h3>
    <img src="assets/ulp-0.png" alt="ULP Sensor">
    <p style="text-align: center;"><strong>ESP32 • MQTT • Cloud Integration</strong></p>
    <p><em>Developed a long-life wireless sensing system with real-time cloud monitoring capabilities.</em></p>
    <ul>
      <li>Engineered low-power firmware achieving multi-year battery operation</li>
      <li>Implemented MQTT-based communication with cloud integration</li>
      <li>Enabled real-time data visualization and remote monitoring</li>
      <li>Supported deployment, validation, and field reliability improvements</li>
    </ul>`,

  aiDatasheet: `
    <h3>AI-Powered Datasheet Assistant (RAG for Embedded Systems)</h3>
    <img src="assets/ai-datasheet.png" alt="AI Datasheet Assistant">
    <p style="text-align: center;"><strong>Python • n8n • LLM • Pinecone • RAG</strong></p>
    <p><em>Built an AI-driven assistant to improve efficiency in firmware development by enabling accurate datasheet querying.</em></p>
    <ul>
      <li>Designed Retrieval-Augmented Generation (RAG) pipeline for context-aware responses</li>
      <li>Implemented automated ingestion workflows for technical documentation</li>
      <li>Developed semantic search for register-level and specification retrieval</li>
      <li>Engineered prompt strategies to reduce hallucinations in hardware queries</li>
      <li>Enabled citation-backed responses for reliable engineering decisions</li>
    </ul>`
};

/* ================================
   MODAL FUNCTIONS
================================ */
function focusableWithin(root){
  return root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
}

function openModal(key){
  if(!projectData[key]) return;
  lastFocused = document.activeElement;
  modalBody.innerHTML = projectData[key];
  modalBody.scrolltop = 0;
  modal.setAttribute('aria-hidden','false');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(()=> {
    const f = focusableWithin(modal);
    if(f.length) f[0].focus();
  }, 40);
  modal.addEventListener('keydown', trapTab);
}

function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', trapTab);
  if(lastFocused && lastFocused.focus) lastFocused.focus();
}

function trapTab(e){
  if(e.key !== 'Tab') return;
  const nodes = Array.from(focusableWithin(modal));
  if(nodes.length === 0) { e.preventDefault(); return; }
  const first = nodes[0], last = nodes[nodes.length-1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.modal));
  card.addEventListener("keydown", e => {
    if(e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card.dataset.modal);
    }
  });
});

const closeBtn = document.querySelector(".modal .close");
if (closeBtn) closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => { if(e.target===modal) closeModal(); });
window.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });

/* ============================================
   PROJECTS — VERTICAL SCROLL → HORIZONTAL MOVE
============================================ */
(() => {
  const scrollSection = document.querySelector(".projects-scroll");
  const track = document.querySelector(".projects-track");

  if (!scrollSection || !track) return;

  function updateScroll() {
    const rect = scrollSection.getBoundingClientRect();
    const scrollable = track.scrollWidth - window.innerWidth;

    if (scrollable <= 0) return;

    const progress = Math.min(
      Math.max(-rect.top / (scrollSection.offsetHeight - window.innerHeight), 0),
      1
    );

    track.style.transform = `translateX(${-scrollable * progress}px)`;
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  // window.addEventListener("resize", updateScroll);
  window.addEventListener("resize", () => {
    cardWidthValue = cardWidth(); // recalc each time
    moveTo(index, false); // adjust scroll position
  });
})();

/* ============================================
   PROJECTS — ROBUST AUTO + MANUAL CAROUSEL
============================================ */
(() => {
  const section = document.getElementById("projects");
  const viewport = section.querySelector(".projects-viewport");
  const track = section.querySelector(".projects-track");
  const btnLeft = section.querySelector(".carousel-btn.left");
  const btnRight = section.querySelector(".carousel-btn.right");

  if (!viewport || !track) return;

  let autoTimer = null;
  const originalCards = Array.from(track.children);
  const gap = 24;

  // Clone for infinite loop
  originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
    track.insertBefore(card.cloneNode(true), track.firstChild);
  });

  const cards = Array.from(track.children);

  function cardWidth() {
    return cards[0].getBoundingClientRect().width + gap;
  }

  // Start at first real card
  let index = originalCards.length;
  viewport.scrollLeft = index * cardWidth();

  // function moveTo(i, smooth = true) {
  //   viewport.scrollTo({
  //     left: i * cardWidth(),
  //     behavior: smooth ? "smooth" : "auto"
  //   });
  //   index = i;
  // }

  function moveTo(i, smooth = true) {
    viewport.scrollTo({
      left: i * cardWidth(),
      behavior: smooth ? "smooth" : "auto"
    });
    index = i;

    if (smooth) {
      // Wait until the scroll finishes (~transition time)
      setTimeout(() => normalizeIndex(), 400);
    } else {
      normalizeIndex();
    }
  }

  function normalizeIndex() {
    if (index >= cards.length - originalCards.length) {
      moveTo(originalCards.length, false);
    }
    if (index < originalCards.length) {
      moveTo(cards.length - originalCards.length * 2, false);
    }
  }

  function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      moveTo(index + 1);
      setTimeout(normalizeIndex, 400);
    }, 1000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  // Hover pause
  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);
  viewport.addEventListener("scroll", stopAuto);

  // Buttons
  btnRight.addEventListener("click", () => {
    stopAuto();
    moveTo(index + 1);
    setTimeout(normalizeIndex, 400);
  });

  btnLeft.addEventListener("click", () => {
    stopAuto();
    moveTo(index - 1);
    setTimeout(normalizeIndex, 400);
  });

  // Keyboard
  viewport.tabIndex = 0;
  viewport.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") btnRight.click();
    if (e.key === "ArrowLeft") btnLeft.click();
  });

  // Start auto-scroll only when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAuto();
      else stopAuto();
    });
  }, { threshold: 0.3 });

  observer.observe(section);
})();

/* ================================
   TYPEWRITER EFFECT — HERO ABOUT
================================ */
(() => {
  const textEl = document.getElementById("typewriter-text");
  if (!textEl) return;

  const text = `Senior Embedded Firmware Engineer with 4+ years of experience building production-grade, low-power IoT and industrial systems from concept to deployment. I specialize in architecting reliable firmware using Zephyr RTOS and bare-metal C, with hands-on expertise in wireless connectivity (BLE, LoRaWAN, LTE), board bring-up, and system-level debugging.
I have delivered end-to-end solutions across sensing, communication, and cloud integration—working closely with hardware, QA, and clients to turn complex requirements into robust products. My work includes multi-radio systems, ultra-low-power designs, and safety-critical control applications.
I also build engineering productivity tools, including Python-based automation and RAG-powered systems for intelligent datasheet analysis, enabling faster development and debugging workflows.`;

  let i = 0;
  const speed = 20; // milliseconds per character

  function typeWriter() {
    if (i < text.length) {
      textEl.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
})();