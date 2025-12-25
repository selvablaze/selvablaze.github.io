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
    <h3>Kirby – Industrial Indoor Air Quality Sensor</h3>
    <img src="assets/Kirby-0.png" alt="Kirby IAQ Sensor">

    <p><strong>nRF52840 • Zephyr RTOS • BLE + LoRaWAN • FUOTA</strong></p>
    <p><strong>Problem:</strong> Continuous, low-power IAQ monitoring with long-range connectivity.</p>

    <ul>
      <li>Led full firmware lifecycle from prototype to pre-production</li>
      <li>Designed modular RTOS architecture with unit-testable components</li>
      <li>Implemented dual-radio BLE + LoRaWAN communication</li>
      <li>Enabled secure FUOTA via BLE and LoRa</li>
      <li>Performed board bring-up, RF validation, and power profiling</li>
      <li>Mentored 3-member firmware team and supported certification</li>
    </ul>`,

  ultra: `
    <h3>Ultra Paws – Pet Health Monitoring Wearable</h3>
    <img src="assets/Ultrapaws-0.png" alt="Ultra Paws">

    <p><strong>nRF52833 • Ultra-Low Power • Custom BLE GATT</strong></p>
    <p><strong>Problem:</strong> Real-time pet paw pressure tracking with long battery life.</p>

    <ul>
      <li>Sole firmware developer owning full BLE device behavior</li>
      <li>Designed custom GATT services for pressure mapping</li>
      <li>Optimized power via aggressive sleep and event-driven design</li>
      <li>Conducted board bring-up, validation, and field trials</li>
      <li>Ensured seamless iOS & Android compatibility</li>
    </ul>`,

  rail: `
    <h3>Automatic Railway Coupling & Decoupling Controller</h3>
    <img src="assets/rail-1.png" alt="Railway Coupling">

    <p><strong>S32K144 • Bare-Metal C • Safety-Critical</strong></p>
    <p><strong>Problem:</strong> Fail-safe automation of railway gangway coupling.</p>

    <ul>
      <li>Developed deterministic bare-metal firmware</li>
      <li>Designed fail-safe state machine with fault recovery</li>
      <li>Implemented diagnostics logging for compliance</li>
      <li>Executed on-coach integration and live field testing</li>
    </ul>`,

  heater: `
    <h3>Precision Heater & Peltier Temperature Controller</h3>
    <img src="assets/heater-0.png" alt="Heater Controller">

    <p><strong>Closed-Loop PID • ±0.2°C Accuracy</strong></p>
    <p><strong>Problem:</strong> High-precision thermal stability for test chambers.</p>

    <ul>
      <li>Designed PID controller achieving ±0.2°C accuracy</li>
      <li>Implemented heating/cooling with fault protection</li>
      <li>Optimized ADC + PWM for &lt;10ms response</li>
      <li>Enabled multi-zone expansion via I2C</li>
    </ul>`,

  test: `
    <h3>Automated Production Test Fixture</h3>
    <img src="assets/test-0.png" alt="Production Test Fixture">

    <p><strong>STM32 • PyQt GUI • Manufacturing Automation</strong></p>
    <p><strong>Problem:</strong> Manual testing bottlenecks in DC-DC production.</p>

    <ul>
      <li>Built end-to-end automated test system</li>
      <li>Developed PyQt desktop GUI for operators</li>
      <li>Integrated Tektronix DMMs & programmable loads</li>
      <li>Reduced test cycle time by <strong>80%</strong></li>
      <li>Automated reporting, calibration & pass/fail logic</li>
    </ul>`,

  ev: `
    <h3>EV Charging Station Controller</h3>
    <img src="assets/ev-0.png" alt="EV Charger">

    <p><strong>Quectel LTE-M • OCPP • Cellular IoT</strong></p>
    <p><strong>Problem:</strong> Reliable energy data transmission over cellular networks.</p>

    <ul>
      <li>Configured LTE-M modules across Indian carriers</li>
      <li>Validated throughput and signal resilience</li>
      <li>Implemented reconnection & fallback logic</li>
      <li>Integrated with backend OCPP platform</li>
    </ul>`,

  tracker: `
    <h3>Tracker Control Unit – Board Bring-Up</h3>
    <img src="assets/tracker-0.png" alt="Tracker Control Unit">

    <p><strong>STM32U585 • Hardware Bring-Up</strong></p>
    <p><strong>Problem:</strong> Enable validation of new controller hardware.</p>

    <ul>
      <li>Sole developer from schematic review to test firmware</li>
      <li>Integrated FRAM, sensors, and motor control</li>
      <li>Validated hardware through firmware-driven tests</li>
      <li>Supported smooth production transition</li>
    </ul>`,

  ulp: `
    <h3>Ultra-Low Power Wireless Pressure Sensor</h3>
    <img src="assets/ulp-0.png" alt="ULP Sensor">

    <p><strong>ESP32 • MQTT • Multi-Year Battery Life</strong></p>
    <p><strong>Problem:</strong> Long-life wireless pressure monitoring with cloud visibility.</p>

    <ul>
      <li>Achieved &gt;3-year battery life using deep-sleep strategies</li>
      <li>Integrated MQTT with Ubidots dashboard</li>
      <li>Implemented real-time pressure visualization</li>
      <li>Performed validation and deployment support</li>
    </ul>`
};

function focusableWithin(root){
  return root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
}

function openModal(key){
  if(!projectData[key]) return;
  lastFocused = document.activeElement;
  modalBody.innerHTML = projectData[key];
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
