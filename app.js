
// Enhanced Arabic Eco Hero logic: tips list, points, plastic counter, badge, random tip on visit
const tips = [
  'استخدم أكياس قماشية عند التسوق.',
  'احمل زجاجة ماء قابلة لإعادة التعبئة.',
  'قلل استخدام الشفاطات البلاستيكية.',
  'استخدم أدوات أكل قابلة لإعادة الاستخدام.',
  'اشترِ بكميات لتقليل التغليف.',
  'عدّل عادات الشراء لتقليل الفضلات.',
  'استخدم حاويات قابلة لإعادة الاستخدام لحفظ الطعام.',
  'ادعم المنتجات ذات التغليف القابل لإعادة التدوير.',
  'تأكد من فرز النفايات وإعادة التدوير بشكل صحيح.',
  'شارك النصائح مع الأسرة والأصدقاء.'
];

const challenges = [
  'يوم كامل بدون أكياس بلاستيكية',
  'استخدام زجاجة قابلة لإعادة التعبئة اليوم',
  'رفض الشفاطات البلاستيكية خلال اليوم',
  'جمع 5 قطع بلاستيكية للتدوير',
  'استخدام أدوات أكل قابلة لإعادة الاستخدام عند الوجبة'
];

// DOM elements
const tipsGrid = document.getElementById('tipsGrid');
const challengeList = document.getElementById('challengeList');
const countEl = document.getElementById('count');
const addBtn = document.getElementById('addBtn');
const resetBtn = document.getElementById('resetBtn');
const plasticSavedEl = document.getElementById('plasticSaved');
const pointsEl = document.getElementById('points');
const badgeArea = document.getElementById('badgeArea');
const localCountEl = document.getElementById('localCount');
const completedCountEl = document.getElementById('completedCount');
const gotoChallenge = document.getElementById('gotoChallenge');
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

// Load saved state
let count = parseInt(localStorage.getItem('eco_count') || '0', 10);
let plasticSaved = parseInt(localStorage.getItem('eco_plastic') || '0', 10);
let points = parseInt(localStorage.getItem('eco_points') || '0', 10);
let completed = parseInt(localStorage.getItem('eco_completed') || '0', 10);

// Render tips
function renderTips(){
  tipsGrid.innerHTML = '';
  tips.forEach(t => {
    const div = document.createElement('div');
    div.className = 'p-6 rounded-xl bg-white/5 hover:scale-105 transform transition card';
    div.innerHTML = `<h3 class="font-bold text-right">${t}</h3><p class="mt-2 text-gray-300 text-right">تطبيق عملي بسيط لتقليل البلاستيك.</p>`;
    tipsGrid.appendChild(div);
  });
}
renderTips();

// Render challenges list
function renderChallenges(){
  challengeList.innerHTML = '';
  challenges.forEach((c,i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-black/40 p-3 rounded-md';
    li.innerHTML = `<span class="ml-2">${c}</span><div class="flex gap-2"><button data-i="${i}" class="px-3 py-1 rounded bg-green-700 actionBtn">انجزت</button><button data-i="${i}" class="px-3 py-1 rounded border border-white/10 reportBtn">أضف قطعة بلاستيك</button></div>`;
    challengeList.appendChild(li);
  });
}
renderChallenges();

// update UI
function updateUI(){
  countEl.textContent = count;
  plasticSavedEl.textContent = plasticSaved;
  pointsEl.textContent = points;
  localCountEl.textContent = localStorage.getItem('eco_local') || '0';
  completedCountEl.textContent = completed;
  // badge logic
  if(points >= 20){
    badgeArea.innerHTML = '<div class="badge">🎖️ بطل البيئة</div>';
  } else if(points >= 10){
    badgeArea.innerHTML = '<div class="badge">🏅 صديق البيئة</div>';
  } else {
    badgeArea.innerHTML = '';
  }
}

updateUI();

// handle clicks on challenge list (delegate)
challengeList.addEventListener('click', (e) => {
  if(e.target.classList.contains('actionBtn')){
    // completed a challenge
    completed++;
    points += 5; // reward points
    count++;
    localStorage.setItem('eco_completed', completed);
    localStorage.setItem('eco_points', points);
    localStorage.setItem('eco_count', count);
    // also increment plasticSaved? not necessarily; user can add plastic pieces separately
    updateUI();
    e.target.textContent = '✓ تم';
    e.target.disabled = true;
  } else if(e.target.classList.contains('reportBtn')){
    // user reports adding a plastic piece to recycling
    plasticSaved++;
    points += 2;
    localStorage.setItem('eco_plastic', plasticSaved);
    localStorage.setItem('eco_points', points);
    updateUI();
    e.target.textContent = '✓ سجلت';
    e.target.disabled = true;
  }
});

// addBtn for general "I completed a challenge"
addBtn.addEventListener('click', () => {
  count++;
  points += 3;
  localStorage.setItem('eco_count', count);
  localStorage.setItem('eco_points', points);
  updateUI();
});

resetBtn.addEventListener('click', () => {
  if(confirm('هل تريد إعادة ضبط العداد؟')){
    count = 0;
    localStorage.setItem('eco_count', count);
    updateUI();
  }
});

gotoChallenge.addEventListener('click', ()=> location.href='#challenge');

// contact form - store locally
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!name || !email){ formResult.textContent = 'من فضلك أدخل الاسم والبريد الإلكتروني'; return; }
  const messages = JSON.parse(localStorage.getItem('eco_messages') || '[]');
  messages.push({name,email,message,date:new Date().toISOString()});
  localStorage.setItem('eco_messages', JSON.stringify(messages));
  formResult.textContent = 'شكرًا! تم حفظ رسالتك محليًا.';
  contactForm.reset();
});

// VanillaTilt on cards
setTimeout(()=> {
  document.querySelectorAll('.card').forEach(el => {
    VanillaTilt.init(el, {max:12, speed:300, glare:true, "max-glare":0.12});
  });
}, 400);

// Three.js leaf canvas
(function(){
  const canvas = document.getElementById('leafCanvas');
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 3;
  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(5,5,5);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambient);
  const geometry = new THREE.PlaneGeometry(1.6,1, 16, 8);
  for (let i=0;i<geometry.attributes.position.count;i++){
    const x = geometry.attributes.position.getX(i);
    geometry.attributes.position.setZ(i, 0.12 * Math.sin(x*3.0));
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({color:0x1e7a3b, metalness:0.2, roughness:0.5, side:THREE.DoubleSide});
  const leaf = new THREE.Mesh(geometry, material);
  leaf.rotation.x = Math.PI*0.08;
  scene.add(leaf);
  function resize(){ const w=canvas.clientWidth; const h=canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  function animate(){ resize(); leaf.rotation.y += 0.009; leaf.rotation.z = 0.06 * Math.sin(Date.now()*0.001); renderer.render(scene,camera); requestAnimationFrame(animate); }
  animate();
})();

// random tip on visit
(function(){
  const idx = Math.floor(Math.random()*tips.length);
  const tip = tips[idx];
  const top = document.createElement('div');
  top.className = 'fixed left-4 top-4 bg-black/60 border border-white/5 p-3 rounded-md text-sm';
  top.innerHTML = '<strong class="gold">نصيحة اليوم:</strong> ' + tip;
  document.body.appendChild(top);
  setTimeout(()=> top.remove(), 9000);
})();
