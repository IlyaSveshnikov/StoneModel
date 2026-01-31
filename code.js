// 1s = 16ms
const dt = 0.016;

// variables
let x, y, t, v, vx, vy, ang, max_h, intervalId;
let x_scale, y_scale, g;
const st = document.getElementById('stone');
ground_level = parseFloat(getComputedStyle(st).top)


// get data
document.getElementById('start').addEventListener('click', (e) => {
  e.preventDefault();
  v = document.getElementById('start_velocity').value;
  ang = document.getElementById('start_angle').value * Math.PI / 180;

  // axes setting
  let Ox = Math.round(v*v*Math.sin(2*ang)/9.8 * 1.2);
  let Oy = Math.round(v*v*Math.sin(ang)*Math.sin(ang)/19.6 * 1.2);
  if (Ox > Oy) {
    Oy = Math.round(Ox/2);
  } else {
    Ox = 2 * Oy;
  }
  document.getElementById('x-axis').innerHTML = Ox + 'm'  
  document.getElementById('y-axis').innerHTML = Oy + 'm'
  x_scale = 700 / Ox;
  y_scale = 350 / Oy;

  startSimulation();
})


// SIMULATION 
function startSimulation() {
  // cleaing last values
  x = 0, y = 0, max_h = 0, t = 0;
  document.querySelectorAll('.stone-track').forEach(el => el.remove());
  
  vx = v * Math.cos(ang) * x_scale;
  vy = v * Math.sin(ang) * y_scale;
  g = 9.8 * y_scale;

  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    x += vx * dt;
    vy -= g * dt;
    y += vy * dt;
    t++;
    st.style.left = x + 'px';
    st.style.top = (ground_level - y) + 'px';

    // stone track
    let stone_track = document.createElement('div'); 
    let coords = st.getBoundingClientRect();
    stone_track.classList.add('stone-track'); 
    stone_track.style.left = coords.left + 'px';
    stone_track.style.top = coords.top + 'px';
    document.getElementById('simulator').appendChild(stone_track);

    if (y > max_h) max_h = y;

    if (y <= 0) {
      clearInterval(intervalId);
      y = 0;
    } 

    updateInfo();
  }, dt*1000);
}

// update information 
function updateInfo() {
  v = Math.sqrt(vx*vx + vy*vy)
  const vars = ['x', 'y', 'V', 'Vx', 'Vy', 't', 'max_h', 'time', 'dist']
  const values = [x/x_scale, y/y_scale, v, vx/x_scale, vy/y_scale, t*dt, max_h/y_scale, t*dt, x/x_scale]
  for (let i = 0; i < 9; i++) {
    document.getElementById(vars[i]).innerHTML = values[i].toFixed(2);
  }
}