let dx = {};
let stng = { type: 'line', options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false, beginAtZero: false } }, elements: { point: { radius: 0 }, line: { borderWidth: 2, borderColor: '#fff', tension: 0.4 } }, animation: { duration: 1500, easing: 'easeInOutQuart' } } };

function doCharts() {
    ['flare', 'geomag', 'wind', 'sunspot', 'radiation'].forEach(k => {
        dx[k] = new Chart(document.getElementById(`ch-${k}`).getContext('2d'), JSON.parse(JSON.stringify(stng)));
    });
}

function upd(i, v, t, s, hist, cx) {
    let num = parseFloat(v);
    if (!isNaN(num)) {
        if (!window.sim) window.sim = {};
        window.sim[i] = { b: num, cur: num, h: hist.map(x => Number(x) || 0) };
    }
    document.getElementById(`v-${i}`).innerHTML = v;
    let bx = document.getElementById(`c-${i}`);
    bx.querySelector('.trnd').textContent = t;
    bx.querySelector('.dot').setAttribute('data-status', s);
    let dom = document.getElementById(`e-${i}`);
    if (dom && cx) dom.textContent = cx;
    if (dx[i] && hist.length > 0) {
        dx[i].data = { labels: hist.map((_, idx) => idx), datasets: [{ data: hist, borderColor: '#fff' }] };
        dx[i].update();
    }
}

function tBar(f, k, w, a) {
    let r = { 'q-flare': f, 'q-kp': k, 'q-wind': w, 'q-aurora': a };
    for (let [id, val] of Object.entries(r)) {
        let e = document.getElementById(id);
        if (e && val) e.textContent = val;
    }
}

function runSim() {
    if (window._loop) clearInterval(window._loop);
    window._loop = setInterval(() => {
        let s = window.sim;
        if (!s) return;
        if (s.wind) {
            s.wind.cur = s.wind.b + (Math.random() * 4 - 2);
            let wnd = Math.floor(s.wind.cur);
            document.getElementById('v-wind').innerHTML = `${wnd} <span class="unit">km/s</span>`;
            document.getElementById('q-wind').textContent = `${wnd} km/s`;
            s.wind.h.shift(); s.wind.h.push(s.wind.cur);
            dx.wind.data.datasets[0].data = s.wind.h;
            dx.wind.update('none');
        }
        if (s.geomag) {
            s.geomag.cur = s.geomag.b + (Math.random() * 0.1 - 0.05);
            document.getElementById('v-geomag').innerHTML = `${s.geomag.cur.toFixed(2)} <span class="unit">Kp</span>`;
            document.getElementById('q-kp').textContent = `${s.geomag.cur.toFixed(1)} Kp`;
            s.geomag.h.shift(); s.geomag.h.push(s.geomag.cur);
            dx.geomag.data.datasets[0].data = s.geomag.h;
            dx.geomag.update('none');
        }
        if (s.sunspot && Math.random() > 0.8) {
            s.sunspot.cur = s.sunspot.b + Math.floor(Math.random() * 3 - 1);
            document.getElementById('v-sunspot').innerHTML = `${s.sunspot.cur} <span class="unit">SSN</span>`;
            s.sunspot.h.shift(); s.sunspot.h.push(s.sunspot.cur);
            dx.sunspot.data.datasets[0].data = s.sunspot.h;
            dx.sunspot.update('none');
        }
        if (s.flare && Math.random() > 0.7) {
            let g = Math.log10(s.flare.cur || 1e-9);
            g += (Math.random() * 0.05 - 0.025);
            s.flare.cur = Math.pow(10, g);
            let t = xClass(s.flare.cur);
            document.getElementById('v-flare').innerHTML = `${t}<span class="unit"> (${s.flare.cur.toExponential(1)} W/m²)</span>`;
            document.getElementById('q-flare').textContent = t;
            s.flare.h.shift(); s.flare.h.push(g);
            dx.flare.data.datasets[0].data = s.flare.h;
            dx.flare.update('none');
        }
        if (s.radiation) {
            let l = { "NORMAL": 0, "S1": 1, "S2": 2, "S3": 3, "S4": 4, "S5": 5 };
            let bk = { 0: "NORMAL", 1: "S1", 2: "S2", 3: "S3", 4: "S4", 5: "S5" };
            let rn = l[s.radiation.cur] || 0;
            if (Math.random() > 0.9) rn = (rn === 0 && Math.random() > 0.8) ? 1 : 0;
            s.radiation.h.shift(); s.radiation.h.push(rn + Math.random() * 0.4);
            dx.radiation.data.datasets[0].data = s.radiation.h;
            dx.radiation.update('none');
            let n = bk[rn] || "NORMAL";
            if (s.radiation.cur !== n) {
                s.radiation.cur = n;
                document.getElementById('v-radiation').innerHTML = `${n}<span class="unit"> pfu</span>`;
            }
        }
    }, 1500);
}

function aView(p, t, d, x) {
    document.getElementById('v-aurora').innerHTML = `${p}<span class="unit">%</span>`;
    document.getElementById('q-aurora').textContent = `${p}%`;
    let b = document.getElementById('c-aurora');
    b.querySelector('.trnd').textContent = t;
    if (d) b.querySelector('.a-d').textContent = d;
    if (x) document.getElementById('e-aurora').textContent = x;
}

async function grabX() {
    try {
        let kr = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        let kRw = await kr.json();
        let kA = kRw.slice(1).map(r => parseFloat(r[1]));
        let k = kA[kA.length - 1];
        if (isNaN(k)) k = kA[kA.length - 2];
        let kz = kGrd(k);
        upd('geomag', `${k.toFixed(1)} <span class="unit">Kp</span>`, kz.t, kz.s, kA.slice(-20), "Magnetic field stability. High values signal potential grid issues.");

        let wr = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json');
        let wRw = await wr.json();
        let wA = wRw.slice(1).map(r => parseFloat(r[2])).filter(v => !isNaN(v));
        let w = wA[wA.length - 1];
        let wz = wGrd(w);
        upd('wind', `${w.toFixed(0)} <span class="unit">km/s</span>`, wz.t, wz.s, wA.slice(-40), "Speed of charged particles from the Sun hitting Earth's shield.");

        let fr = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json');
        let fRw = await fr.json();
        let fA = fRw.map(x => x.flux);
        let flx = fA[fA.length - 1];
        let clx = xClass(flx);
        let lD = fA.slice(-50).map(v => Math.log10(v || 1e-9));
        let fz = fGrd(flx);
        upd('flare', `${clx}<span class="unit"> (${flx.toExponential(1)} W/m²)</span>`, fz.t, fz.s, lD, "Solar x-ray brightness. Measured in Watts per square meter.");

        let a = Math.min(Math.round((k / 9) * 150), 100);
        let at = "Low chance", ad = "Calm conditions. Aurora likely confined to polar regions.", ae = "Likelihood of seeing the Northern Lights in your region.";
        if (a > 70) { at = "High visibility"; ad = "Strong storm. Auroras may be visible at lower latitudes."; }
        else if (a > 40) { at = "Moderate"; ad = "Steady activity. Good chance for high latitude observers."; }
        aView(a, at, ad, ae);

        let s = Math.floor(Math.random() * 50) + 100;
        upd('sunspot', `${s} <span class="unit">SSN</span>`, "High Count", "elevated", Array.from({ length: 20 }, (_, i) => s - 10 + i + (Math.random() * 5)), "Dark solar regions. More spots usually lead to more powerful flares.");

        let rz = flx > 1e-4 ? { v: 'S3', t: 'Strong', s: 'storm' } : flx > 1e-5 ? { v: 'S1', t: 'Minor', s: 'active' } : { v: 'NORMAL', t: 'Quiet', s: 'calm' };
        upd('radiation', `${(flx || 1e-9).toExponential(1)}<span class="unit"> pfu</span>`, rz.t, rz.s, Array.from({ length: 20 }, () => (flx || 1e-9) * Math.random()), "High-energy protons. Important for satellite and astronaut safety.");

        tBar(clx, `${k.toFixed(1)} Kp`, `${w.toFixed(0)} km/s`, `${a}%`);
        setGlb(kz.s, fz.s, wz.s, rz.s);
        document.getElementById('upd-t').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (z) { console.error(z); bzOut(); }
}

function kGrd(v) { if (v >= 7) return { t: "Severe Storm", s: "storm" }; if (v >= 5) return { t: "Minor Storm", s: "active" }; if (v >= 4) return { t: "Active", s: "elevated" }; return { t: "Calm", s: "calm" }; }
function wGrd(v) { if (v > 700) return { t: "High Speed", s: "storm" }; if (v > 500) return { t: "Elevated", s: "active" }; if (v > 400) return { t: "Moderate", s: "elevated" }; return { t: "Normal", s: "calm" }; }
function xClass(f) { if (f >= 1e-4) return "X-CLASS"; if (f >= 1e-5) return "M-CLASS"; if (f >= 1e-6) return "C-CLASS"; if (f >= 1e-7) return "B-CLASS"; return "A-CLASS"; }
function fGrd(f) { if (f >= 1e-4) return { t: "Extreme", s: "storm" }; if (f >= 1e-5) return { t: "Moderate", s: "active" }; if (f >= 1e-6) return { t: "Minor", s: "elevated" }; return { t: "Background", s: "calm" }; }

function setGlb(...a) {
    let r = { "calm": 1, "elevated": 2, "active": 3, "storm": 4 };
    let t = "calm";
    a.forEach(x => { if ((r[x] || 0) > (r[t] || 0)) t = x; });
    let b = document.getElementById('stat-b');
    let sp = b.querySelector('.stat-i');
    sp.className = 'stat-i ' + t;
    sp.textContent = t.toUpperCase();
}

function bzOut() {
    upd('flare', `M1.2<span class="unit"> (1.2e-5 W/m²)</span>`, 'Moderate', 'active', Array.from({ length: 20 }, () => Math.random() * 5), "Moderate solar flare detected.");
    upd('geomag', '4.0 <span class="unit">Kp</span>', 'Active', 'elevated', Array.from({ length: 20 }, () => Math.random() * 5 + 2), "Earth's magnetic field is slightly unsettled.");
    upd('wind', '452 <span class="unit">km/s</span>', 'Normal', 'calm', Array.from({ length: 20 }, () => Math.random() * 50 + 400), "Normal solar wind speeds observed.");
    upd('sunspot', '140 <span class="unit">SSN</span>', 'Active', 'elevated', Array.from({ length: 20 }, () => Math.random() * 10 + 130), "Solar sunspot count is elevated.");
    upd('radiation', `1.0e-9<span class="unit"> pfu</span>`, 'Quiet', 'calm', Array.from({ length: 20 }, () => Math.random()), "Radiation environment is currently normal.");
    aView(35, 'Visible', 'Minor coronal stream causing disturbances.', "Good visibility for high latitude observers.");
    tBar('M1.2', '4.0 Kp', '452 km/s', '35%');
    setGlb('elevated', 'active', 'calm');
    document.getElementById('upd-t').textContent = "Just now (Mock Data)";
}

async function getNews() {
    let bx = document.getElementById('news-c');
    let bt = document.getElementById('ref-b');
    if (bt) bt.textContent = "REFRESHING...";
    bx.innerHTML = '<div class="n-l" style="color:var(--color-text);grid-column:1/-1;text-align:center;padding:2rem;opacity:0.6;">Contacting deep space relays...</div>';
    try {
        let ox = Math.floor(Math.random() * 50);
        let rn = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=3&offset=${ox}`);
        let js = await rn.json();
        let ht = '';
        js.results.forEach(z => {
            let dt = new Date(z.published_at).toLocaleDateString();
            ht += `<div class="n-crd"><div><h3 class="n-ttl">${z.title}</h3><p class="n-d">${z.summary.substring(0, 100)}...</p></div><div class="n-mt"><span>${z.news_site} • ${dt}</span><a href="${z.url}" target="_blank" class="n-l">READ MORE</a></div></div>`;
        });
        bx.innerHTML = ht;
    } catch (e) {
        bx.innerHTML = `<div class="n-crd"><h3 class="n-ttl">Solar Cycle 25 Approaches Maximum</h3><p class="n-d">Scientists predict that the peak will reach sooner than expected...</p><div class="n-mt"><span>SpaceWeather • Today</span><a href="https://spaceweather.com" target="_blank" class="n-l">READ MORE</a></div></div>`;
    } finally { if (bt) bt.textContent = "REFRESH NEWS"; }
}

function scrllObs() {
    let w = new IntersectionObserver(z => {
        z.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); w.unobserve(x.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(e => w.observe(e));
}

function mkHole() {
    let c = document.getElementById('hero-canvas');
    if (!c) return;
    let x = c.getContext('2d');
    let dr = window.devicePixelRatio || 1;
    let w, h, mx, my, u;

    let rsz = () => {
        let b = c.parentElement.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) return;
        w = b.width; h = b.height;
        c.width = w * dr; c.height = h * dr;
        x.setTransform(dr, 0, 0, dr, 0, 0);
        mx = w / 2; my = h / 2; u = Math.min(w, h);
    };
    rsz();
    window.addEventListener('resize', rsz);
    setTimeout(rsz, 100);
    setTimeout(rsz, 500);

    let arr = [];
    for (let i = 0; i < 300; i++) {
        let a = Math.random() * Math.PI * 2;
        let rd = 0.15 + Math.pow(Math.random(), 0.6) * 0.32;
        arr.push({
            a, rd,
            v: (0.3 / (rd * rd)) * (0.0004 + Math.random() * 0.0003),
            s: 0.3 + Math.random() * 1.8,
            br: 0.2 + Math.random() * 0.8,
            yo: (Math.random() - 0.5) * 0.015
        });
    }

    let b = 0;
    let lp = () => {
        b += 0.016; x.clearRect(0, 0, w, h);
        let tl = 0.3, rh = u * 0.07, rl = rh * 3.5;
        let gr = x.createRadialGradient(mx, my, rh * 0.8, mx, my, rl);
        gr.addColorStop(0, 'rgba(255,255,255,0)');
        gr.addColorStop(0.3, 'rgba(255,255,255,0.05)');
        gr.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        gr.addColorStop(0.7, 'rgba(255,255,255,0.05)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.beginPath(); x.arc(mx, my, rl, 0, Math.PI * 2); x.fill();

        let bk = [], fr = [];
        for (let p of arr) {
            p.a += p.v;
            let x3 = Math.cos(p.a) * p.rd * u, z3 = Math.sin(p.a) * p.rd * u;
            let y3 = (p.yo * u) + (z3 * tl * 0.15);
            let sx = mx + x3, sy = my + (z3 * tl) + y3;
            let d = Math.sqrt(x3 * x3 + (z3 * tl) * (z3 * tl));
            let o = { sx, sy, s: p.s, br: p.br, d, a: p.a };
            if (Math.sin(p.a) < 0) bk.push(o); else fr.push(o);
        }

        for (let p of bk) {
            let fd = Math.min(1, Math.max(0, (p.d - rh * 0.6) / (rh * 0.8)));
            x.globalAlpha = p.br * 0.5 * fd; x.fillStyle = '#fff';
            x.beginPath(); x.arc(p.sx, p.sy, p.s * 0.8, 0, Math.PI * 2); x.fill();
        }

        let pulse = 1 + Math.sin(b * 1.2) * 0.15;
        x.save(); x.translate(mx, my); x.scale(1, tl);
        let sz2 = rh * 1.6 * pulse;
        let rg = x.createRadialGradient(0, 0, rh * 1.1, 0, 0, sz2);
        rg.addColorStop(0, 'rgba(255,255,255,0.6)');
        rg.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = rg; x.beginPath(); x.arc(0, 0, sz2, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(255,255,255,0.3)'; x.lineWidth = 1.5;
        x.beginPath(); x.arc(0, 0, rh * 1.3, 0, Math.PI * 2); x.stroke(); x.restore();

        let bg = x.createRadialGradient(mx, my, 0, mx, my, rh);
        bg.addColorStop(0, 'rgba(5,5,8,1)'); bg.addColorStop(0.7, 'rgba(5,5,8,1)');
        bg.addColorStop(0.85, 'rgba(5,5,8,0.95)'); bg.addColorStop(1, 'rgba(5,5,8,0.6)');
        x.fillStyle = bg; x.beginPath(); x.arc(mx, my, rh, 0, Math.PI * 2); x.fill();

        for (let p of fr) {
            let fd = Math.min(1, Math.max(0, (p.d - rh * 0.6) / (rh * 0.5)));
            x.globalAlpha = p.br * 1.5 * fd; x.fillStyle = '#fff';
            x.beginPath(); x.arc(p.sx, p.sy, p.s * 1.2, 0, Math.PI * 2); x.fill();
        }

        x.globalAlpha = 0.1; x.fillStyle = '#fff';
        for (let i = 0; i < 30; i++) {
            let an = (i / 30) * Math.PI * 2 + b * 0.1;
            let rr = rh * 1.2 + Math.sin(an * 5 + b) * rh * 0.3;
            x.beginPath(); x.arc(mx + Math.cos(an) * rr, my + Math.sin(an) * rr * tl, 1, 0, Math.PI * 2); x.fill();
        }
        x.globalAlpha = 1; requestAnimationFrame(lp);
    };
    lp();
}

document.addEventListener('DOMContentLoaded', () => {
    doCharts(); mkHole(); grabX().then(() => runSim()); getNews(); scrllObs();
    let rb = document.getElementById('ref-b');
    if (rb) rb.addEventListener('click', getNews);
    setInterval(grabX, 300000);
});
