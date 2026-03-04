var TLE_DATA = [
    { name: "ISS (ZARYA)", type: "station", tle1: "1 25544U 98067A   24063.48612269  .00013000  00000-0  23611-3 0  9997", tle2: "2 25544  51.6405 174.5208 0005232  94.2541 123.0034 15.49479414442220" },
    { name: "HUBBLE", type: "station", tle1: "1 20580U 90037B   24063.51388889  .00001000  00000-0  10000-3 0  9990", tle2: "2 20580  28.4690 274.5208 0002832  94.2541 123.0034 15.10000000000000" },
    { name: "NOAA 19", type: "weather", tle1: "1 33591U 09005A   24063.50000000  .00000100  00000-0  10000-3 0  9997", tle2: "2 33591  99.0000 174.5208 0010000  94.2541 123.0034 14.10000000000000" },
    { name: "GOES 16", type: "weather", tle1: "1 41866U 16071A   24063.50000000  .00000000  00000-0  00000-0 0  9997", tle2: "2 41866   0.0000 174.5208 0000000  94.2541 123.0034  1.00270000000000" },
    { name: "STARLINK-1007", type: "comm", tle1: "1 44713U 19074A   24063.50000000  .00001000  00000-0  10000-3 0  9990", tle2: "2 44713  53.0500 174.5208 0001000  94.2541 123.0034 15.10000000000000" },
    { name: "IRIDIUM 100", type: "comm", tle1: "1 41923U 17003A   24063.50000000  .00001000  00000-0  10000-3 0  9990", tle2: "2 41923  86.4000 174.5208 0001000  94.2541 123.0034 14.30000000000000" },
    { name: "GPS BIIF-1", type: "nav", tle1: "1 36585U 10022A   24063.50000000  .00000000  00000-0  00000-0 0  9990", tle2: "2 36585  55.0000 174.5208 0001000  94.2541 123.0034  2.00500000000000" },
    { name: "GALILEO 1", type: "nav", tle1: "1 37846U 11060A   24063.50000000  .00000000  00000-0  00000-0 0  9990", tle2: "2 37846  56.0000 174.5208 0001000  94.2541 123.0034  1.70000000000000" },
    { name: "TIANGONG", type: "station", tle1: "1 48274U 21035A   24063.50000000  .00013000  00000-0  23611-3 0  9990", tle2: "2 48274  41.5000 174.5208 0005232  94.2541 123.0034 15.60000000000000" },
    { name: "NAVSTAR 73", type: "nav", tle1: "1 40534U 15013A   24064.49354167  .00000007  00000+0  00000+0 0  9997", tle2: "2 40534  55.2936 295.4266 0122179   2.7562 357.5458  2.00566838 65860" }
];

for (var i = 0; i < 15; i++) {
    var tp = ['comm', 'weather', 'nav'][i % 3];
    var ra = (360 * Math.random()).toFixed(4);
    var ic = (100 * Math.random()).toFixed(4);
    var mn = (13 + Math.random() * 2).toFixed(8);
    if (tp === 'nav') mn = (2.0 + Math.random() * 0.1).toFixed(8);
    TLE_DATA.push({
        name: 'MOCK SAT-' + (Math.floor(Math.random() * 9000) + 1000),
        type: tp,
        tle1: '1 99999U 99999A   24063.50000000  .00001000  00000-0  10000-3 0  9990',
        tle2: '2 99999 ' + ic.padStart(8, ' ') + ' ' + ra.padStart(8, ' ') + ' 0001000  94.2541 123.0034 ' + mn.padStart(15, ' ')
    });
}

var sats = [], geo = null, cvs, cx2d, fcvs, fcx;
var W, H, dpr = window.devicePixelRatio || 1;
var flt = 'all', picked = null, hover = null;
var cachedPath = null, cachedFor = null;

function boot() {
    cvs = document.getElementById('mapCvs');
    fcvs = document.getElementById('feedCvs');
    if (!cvs || !fcvs) return;
    cx2d = cvs.getContext('2d');
    fcx = fcvs.getContext('2d');

    sats = TLE_DATA.map(function (d) {
        var rec = satellite.twoline2satrec(d.tle1, d.tle2);
        return { name: d.name, type: d.type, satrec: rec, x: 0, y: 0, lat: 0, lng: 0, alt: 0, vel: 0 };
    });

    document.getElementById('satNum').textContent = sats.length + ' SATS';

    document.getElementById('resetBtn').addEventListener('click', function () {
        picked = null;
        cachedPath = null; cachedFor = null;
        document.getElementById('infoBox').style.display = 'none';
        flt = 'all';
        document.getElementById('trkFilter').value = 'all';
        cntUp();
        fitCvs();
    });

    document.getElementById('trkFilter').addEventListener('change', function (e) {
        flt = e.target.value;
        if (picked && flt !== 'all' && picked.type !== flt) {
            picked = null;
            document.getElementById('infoBox').style.display = 'none';
        }
        cntUp();
    });

    cvs.addEventListener('mousemove', function (e) {
        var b = cvs.getBoundingClientRect();
        var mx = e.clientX - b.left, my = e.clientY - b.top;
        hover = null;
        var vis = sats.filter(function (s) { return flt === 'all' || s.type === flt; });
        for (var k = 0; k < vis.length; k++) {
            var dx = vis[k].x - mx, dy = vis[k].y - my;
            if (dx * dx + dy * dy < 625) { hover = vis[k]; break; }
        }
        cvs.style.cursor = hover ? 'pointer' : 'crosshair';
    });

    cvs.addEventListener('click', function (e) {
        var b = cvs.getBoundingClientRect();
        var mx = e.clientX - b.left, my = e.clientY - b.top;
        var hit = null;
        var vis = sats.filter(function (s) { return flt === 'all' || s.type === flt; });
        for (var k = 0; k < vis.length; k++) {
            var dx = vis[k].x - mx, dy = vis[k].y - my;
            if (dx * dx + dy * dy < 900) { hit = vis[k]; break; }
        }
        if (hit) {
            picked = hit;
            document.getElementById('infoBox').style.display = 'flex';
        } else {
            picked = null;
            document.getElementById('infoBox').style.display = 'none';
        }
    });

    window.addEventListener('keydown', function (e) {
        if (!picked) return;
        var vis = sats.filter(function (s) { return flt === 'all' || s.type === flt; });
        var idx = vis.indexOf(picked);
        if (e.key === 'ArrowRight') picked = vis[(idx + 1) % vis.length];
        else if (e.key === 'ArrowLeft') picked = vis[(idx - 1 + vis.length) % vis.length];
    });

    window.addEventListener('resize', fitCvs);
    fitCvs();

    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(function (r) { return r.json(); })
        .then(function (d) { geo = d; fitCvs(); })
        .catch(function (e) { console.error("Map load failed", e); });

    requestAnimationFrame(frame);
}

function cntUp() {
    var c = sats.filter(function (s) { return flt === 'all' || s.type === flt; }).length;
    document.getElementById('satNum').textContent = c + ' SATS';
}

function fitCvs() {
    var p = cvs.parentElement.getBoundingClientRect();
    var nw = p.width, nh = p.height || 500;
    if (nw !== W || nh !== H) {
        W = nw; H = nh;
        cvs.width = W * dpr; cvs.height = H * dpr;
        cx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
}

function frame() {
    fitCvs();
    var now = new Date();
    var ts = Date.now();
    cx2d.clearRect(0, 0, W, H);

    cx2d.strokeStyle = 'rgba(255,255,255,0.05)';
    cx2d.lineWidth = 1;
    cx2d.beginPath();
    cx2d.moveTo(0, H / 2); cx2d.lineTo(W, H / 2);
    cx2d.moveTo(W / 2, 0); cx2d.lineTo(W / 2, H);
    cx2d.stroke();

    if (geo) {
        cx2d.strokeStyle = 'rgba(255,255,255,0.15)';
        cx2d.lineWidth = 1;
        cx2d.beginPath();
        geo.features.forEach(function (ft) {
            if (ft.geometry.type === 'Polygon') {
                ft.geometry.coordinates.forEach(function (ring) { traceRing(ring); });
            } else if (ft.geometry.type === 'MultiPolygon') {
                ft.geometry.coordinates.forEach(function (poly) {
                    poly.forEach(function (ring) { traceRing(ring); });
                });
            }
        });
        cx2d.stroke();
    }

    var gmst = satellite.gstime(now);
    for (var i = 0; i < sats.length; i++) {
        var s = sats[i];
        var pv = satellite.propagate(s.satrec, now);
        if (pv.position && pv.velocity) {
            var gd = satellite.eciToGeodetic(pv.position, gmst);
            s.lng = satellite.degreesLong(gd.longitude);
            s.lat = satellite.degreesLat(gd.latitude);
            s.alt = gd.height;
            s.vel = Math.sqrt(pv.velocity.x * pv.velocity.x + pv.velocity.y * pv.velocity.y + pv.velocity.z * pv.velocity.z);
            s.x = ((s.lng + 180) / 360) * W;
            s.y = ((90 - s.lat) / 180) * H;
        }
    }

    if (picked) {
        if (cachedFor !== picked) {
            cachedPath = [];
            cachedFor = picked;
            var per = (2 * Math.PI) / picked.satrec.no * 60000;
            if (per > 10800000) per = 10800000;
            for (var j = 0; j <= 120; j++) {
                var tt = new Date(now.getTime() - per / 2 + (per * j / 120));
                var pp = satellite.propagate(picked.satrec, tt);
                if (pp.position) {
                    var gg = satellite.eciToGeodetic(pp.position, satellite.gstime(tt));
                    cachedPath.push({
                        ln: satellite.degreesLong(gg.longitude),
                        lt: satellite.degreesLat(gg.latitude)
                    });
                }
            }
        }
        cx2d.beginPath();
        cx2d.strokeStyle = 'rgba(255,255,255,0.35)';
        cx2d.lineWidth = 1;
        var prevX;
        for (var j = 0; j < cachedPath.length; j++) {
            var ox = ((cachedPath[j].ln + 180) / 360) * W;
            var oy = ((90 - cachedPath[j].lt) / 180) * H;
            if (j === 0 || Math.abs(ox - prevX) > W / 2) cx2d.moveTo(ox, oy);
            else cx2d.lineTo(ox, oy);
            prevX = ox;
        }
        cx2d.stroke();

        document.getElementById('sName').textContent = picked.name;
        document.getElementById('sType').textContent = picked.type.toUpperCase() + ' ORBIT';
        document.getElementById('sAlt').textContent = picked.alt.toFixed(1);
        document.getElementById('sVel').textContent = picked.vel.toFixed(2);
        document.getElementById('sCoord').textContent =
            Math.abs(picked.lat).toFixed(2) + '\u00b0' + (picked.lat >= 0 ? 'N' : 'S') + ', ' +
            Math.abs(picked.lng).toFixed(2) + '\u00b0' + (picked.lng >= 0 ? 'E' : 'W');
    }

    for (var i = 0; i < sats.length; i++) {
        var s = sats[i];
        if (flt !== 'all' && s.type !== flt) continue;

        var isHov = (s === hover);
        var isSel = (s === picked);
        var pulse = 1 + Math.sin(ts / 200 + s.x) * 0.5;
        var rad = (isHov || isSel) ? 4 : 2.5 + pulse;

        cx2d.beginPath();
        cx2d.arc(s.x, s.y, rad, 0, Math.PI * 2);

        if (isSel) {
            cx2d.fillStyle = '#fff';
            cx2d.shadowColor = '#fff';
            cx2d.shadowBlur = 20;
        } else if (isHov) {
            cx2d.fillStyle = '#fff';
            cx2d.shadowColor = '#fff';
            cx2d.shadowBlur = 15;
        } else {
            cx2d.fillStyle = 'rgba(255,255,255,' + (0.6 + pulse * 0.2) + ')';
            cx2d.shadowColor = 'rgba(255,255,255,0.3)';
            cx2d.shadowBlur = 5;
        }
        cx2d.fill();
        cx2d.shadowBlur = 0;

        if (!isSel) {
            var ba = isHov ? 8 : 6, bl = 3;
            cx2d.strokeStyle = 'rgba(255,255,255,' + (isHov ? 0.8 : 0.3) + ')';
            cx2d.lineWidth = 1;
            cx2d.beginPath(); cx2d.moveTo(s.x - ba, s.y - ba + bl); cx2d.lineTo(s.x - ba, s.y - ba); cx2d.lineTo(s.x - ba + bl, s.y - ba); cx2d.stroke();
            cx2d.beginPath(); cx2d.moveTo(s.x + ba - bl, s.y - ba); cx2d.lineTo(s.x + ba, s.y - ba); cx2d.lineTo(s.x + ba, s.y - ba + bl); cx2d.stroke();
            cx2d.beginPath(); cx2d.moveTo(s.x - ba, s.y + ba - bl); cx2d.lineTo(s.x - ba, s.y + ba); cx2d.lineTo(s.x - ba + bl, s.y + ba); cx2d.stroke();
            cx2d.beginPath(); cx2d.moveTo(s.x + ba - bl, s.y + ba); cx2d.lineTo(s.x + ba, s.y + ba); cx2d.lineTo(s.x + ba, s.y + ba - bl); cx2d.stroke();
        }

        if (isSel) {
            var sr = 12 + Math.sin(ts / 150) * 4;
            cx2d.beginPath();
            cx2d.arc(s.x, s.y, sr, 0, Math.PI * 2);
            cx2d.strokeStyle = 'rgba(255,255,255,0.8)';
            cx2d.lineWidth = 1.5;
            if (Math.sin(ts / 50) > 0) cx2d.setLineDash([4, 4]);
            cx2d.stroke();
            cx2d.setLineDash([]);
            cx2d.beginPath();
            cx2d.moveTo(s.x - sr - 10, s.y); cx2d.lineTo(s.x - sr - 2, s.y);
            cx2d.moveTo(s.x + sr + 2, s.y); cx2d.lineTo(s.x + sr + 10, s.y);
            cx2d.moveTo(s.x, s.y - sr - 10); cx2d.lineTo(s.x, s.y - sr - 2);
            cx2d.moveTo(s.x, s.y + sr + 2); cx2d.lineTo(s.x, s.y + sr + 10);
            cx2d.strokeStyle = 'rgba(255,255,255,0.5)';
            cx2d.stroke();
        }
    }

    drawFeed(ts);
    requestAnimationFrame(frame);
}

function drawFeed(time) {
    if (!fcx) return;
    var box = fcvs.parentElement.getBoundingClientRect();
    var fw = box.width, fh = 130;
    fcvs.width = fw * dpr; fcvs.height = fh * dpr;
    fcx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fcx.clearRect(0, 0, fw, fh);

    for (var i = 0; i < 100; i++) {
        fcx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.05) + ')';
        fcx.fillRect(Math.random() * fw, Math.random() * fh, 2, 2);
    }

    if (!picked) {
        fcx.fillStyle = 'rgba(255,255,255,0.2)';
        fcx.font = "14px var(--f-h)";
        fcx.fillText("AWAITING TARGET", fw / 2 - 40, fh / 2 + 5);
        return;
    }

    var mx = fw / 2, my = fh / 2;
    fcx.strokeStyle = 'rgba(255,255,255,0.1)';
    fcx.lineWidth = 1;
    fcx.beginPath();
    fcx.moveTo(0, my); fcx.lineTo(fw, my);
    fcx.moveTo(mx, 0); fcx.lineTo(mx, fh);
    fcx.stroke();

    fcx.strokeStyle = 'rgba(255,255,255,0.6)';
    var bz = 25 + Math.sin(time / 200) * 2;
    fcx.beginPath();
    fcx.moveTo(mx - bz, my - bz + 5); fcx.lineTo(mx - bz, my - bz); fcx.lineTo(mx - bz + 5, my - bz);
    fcx.moveTo(mx + bz, my - bz + 5); fcx.lineTo(mx + bz, my - bz); fcx.lineTo(mx + bz - 5, my - bz);
    fcx.moveTo(mx - bz, my + bz - 5); fcx.lineTo(mx - bz, my + bz); fcx.lineTo(mx - bz + 5, my + bz);
    fcx.moveTo(mx + bz, my + bz - 5); fcx.lineTo(mx + bz, my + bz); fcx.lineTo(mx + bz - 5, my + bz);
    fcx.stroke();

    var rl = time / 1000 + picked.vel, pt = time / 1500;
    var verts = [[-10, -10, -5], [10, -10, -5], [10, 10, -5], [-10, 10, -5], [-10, -10, 5], [10, -10, 5], [10, 10, 5], [-10, 10, 5]];
    var proj = verts.map(function (v) {
        var y1 = v[1] * Math.cos(pt) - v[2] * Math.sin(pt);
        var x2 = v[0] * Math.cos(rl) - y1 * Math.sin(rl);
        var y2 = v[0] * Math.sin(rl) + y1 * Math.cos(rl);
        return [x2 + mx, y2 + my];
    });
    var edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    fcx.strokeStyle = 'rgba(255,255,255,0.9)';
    fcx.lineWidth = 1.5;
    fcx.shadowColor = '#fff'; fcx.shadowBlur = 5;
    fcx.beginPath();
    edges.forEach(function (e) {
        fcx.moveTo(proj[e[0]][0], proj[e[0]][1]);
        fcx.lineTo(proj[e[1]][0], proj[e[1]][1]);
    });
    fcx.stroke();
    fcx.shadowBlur = 0;

    fcx.fillStyle = 'rgba(255,255,255,0.4)';
    fcx.font = "10px var(--f-b)";
    fcx.fillText('TRK: ' + picked.name, 10, 15);
    fcx.fillText('V: ' + picked.vel.toFixed(3) + ' km/s', 10, 30);
    fcx.fillText('Z: +' + picked.alt.toFixed(0) + 'm', fw - 60, fh - 10);
}

function traceRing(ring) {
    if (!ring || ring.length === 0) return;
    var px = ((ring[0][0] + 180) / 360) * W;
    var py = ((90 - ring[0][1]) / 180) * H;
    cx2d.moveTo(px, py);
    for (var i = 1; i < ring.length; i++) {
        var nx = ((ring[i][0] + 180) / 360) * W;
        var ny = ((90 - ring[i][1]) / 180) * H;
        if (Math.abs(nx - px) > W / 2) cx2d.moveTo(nx, ny);
        else cx2d.lineTo(nx, ny);
        px = nx;
    }
}

document.addEventListener('DOMContentLoaded', boot);
