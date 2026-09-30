/* =============================================================================
   GOMI LIGHT - app.js
   Router hash, tema, movimiento, carrito, calculadora, formularios
   automatizados (Pedido + B2B) y asistente Dulcita.
   ============================================================================= */
'use strict';
document.addEventListener('DOMContentLoaded', function () {
var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var WA='51910147552';
var GB='imagenes/hero-gomitas.jpg';

/* ================= DATOS ================= */
var FLAVORS=[
 {name:'Fresa Andina',color:'#ff4d88',desc:'Fresa real con toque de pitahaya, rica en vitamina C.',kcal:42,extra:'Vit C',img:'imagenes/fresa-andina.jpg',wa:'Fresa%20Andina',gd:'#7a1233'},
 {name:'Mango Jengibre',color:'#ffb020',desc:'Mango maduro con jengibre fresco. Energía digestiva para la tarde.',kcal:45,extra:'Energía',img:'imagenes/mango-jin-gere.jpg',wa:'Mango%20Jengibre',gd:'#7a4a00'},
 {name:'Arándano Nocturno',color:'#7c5cff',desc:'Antioxidantes + colágeno hidrolizado. Ideal después del deporte.',kcal:40,extra:'Colágeno',img:'imagenes/arandano-nocturno.jpg',wa:'Ar%C3%A1ndano%20Nocturno',gd:'#2a1466'},
 {name:'Limón Menta',color:'#38d9a9',desc:'Cítrico helado con menta y electrolitos. Refresca sin cafeína.',kcal:38,extra:'Frescura',img:'imagenes/limon-menta.jpg',wa:'Lim%C3%B3n%20Menta',gd:'#0a3f30'}
];
var PACKS={
 recreo:{name:'Pack Recreo · 1 pouch',unit:12,color:'#ff2e55'},
 familiar:{name:'Pack Familiar · 3 pouches',unit:33,color:'#e6266f'},
 escolar:{name:'Pack Escolar · 5 pouches',unit:50,color:'#7c5cff'},
 mix:{name:'Pouch surtido',unit:12,color:'#ffb020'}
};
var TITLES={
 inicio:'GOMI LIGHT · Gomitas saludables sin azúcar añadida · Pachacutec',
 sabores:'Sabores · GOMI LIGHT',
 nutricion:'Nutrición · GOMI LIGHT',
 historia:'Nuestra historia · GOMI LIGHT',
 tienda:'Tienda y packs · GOMI LIGHT',
 faq:'Preguntas frecuentes · GOMI LIGHT',
 contacto:'Contacto · GOMI LIGHT'
};

/* ================= ROUTER ================= */
function route(){
  var h=(location.hash||'#/').replace(/^#\/?/,'').split('?')[0]||'inicio';
  if(!TITLES[h])h='inicio';
  $$('.page').forEach(function(p){p.classList.toggle('is-active',p.dataset.page===h)});
  $$('a[data-route]').forEach(function(a){a.classList.toggle('on',a.dataset.route===h)});
  document.title=TITLES[h];
  closeMenu();closeSheet();closeCart();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);

/* ================= MENÚ MÓVIL ================= */
var burger=$('#burger'),mnav=$('#menu-principal');
function closeMenu(){mnav.classList.remove('open');mnav.setAttribute('aria-hidden','true');burger.classList.remove('open');burger.setAttribute('aria-expanded','false')}
burger.addEventListener('click',function(){
  var open=mnav.classList.toggle('open');
  burger.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',String(open));
  mnav.setAttribute('aria-hidden',String(!open));
});

/* ================= TEMA (rosa-amarillo ↔ rojo-azul) ================= */
var root=document.documentElement,themeBtn=$('#themeBtn');
function setTheme(t){
  root.setAttribute('data-theme',t);
  try{localStorage.setItem('gomi-theme',t)}catch(e){}
  themeBtn.querySelector('use').setAttribute('href',t==='dark'?'#i-sun':'#i-moon');
  var mc=document.querySelector('meta[name=theme-color]');
  if(mc)mc.setAttribute('content',t==='dark'?'#0b0f2a':'#e6266f');
}
try{
  var st=localStorage.getItem('gomi-theme');
  setTheme(st||(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
}catch(e){setTheme('light')}
themeBtn.addEventListener('click',function(){
  setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
});

/* ================= MOVIMIENTO + FONDO DE CARAMELO (canvas) ================= */
var motionBtn=$('#motionBtn');
var bgC=document.createElement('canvas');
bgC.id='bgfx';bgC.setAttribute('aria-hidden','true');
document.body.insertBefore(bgC,document.body.firstChild);
var bgRAF=null,bgW=0,bgH=0,bgT=0,bgItems=[];
function motionOn(){return root.getAttribute('data-motion')!=='off'}
function bgColors(){
  return root.getAttribute('data-theme')==='dark'
    ?['77,163,255','255,77,109','255,209,102']
    :['214,32,92','194,88,20','157,92,255'];
}
function bgSize(){
  var dpr=Math.min(2,window.devicePixelRatio||1),ctx=bgC.getContext('2d');
  bgW=window.innerWidth;bgH=window.innerHeight;
  bgC.width=bgW*dpr;bgC.height=bgH*dpr;
  bgC.style.width=bgW+'px';bgC.style.height=bgH+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  bgItems=[];
  var nb=Math.max(6,Math.min(13,Math.floor(bgW/110)));
  for(var i=0;i<nb;i++)bgItems.push({t:'b',x:Math.random()*bgW,y:Math.random()*bgH,r:18+Math.random()*46,vx:(Math.random()-.5)*.24,vy:-(.05+Math.random()*.14),c:Math.floor(Math.random()*3),p:Math.random()*6.28});
  var ng=Math.max(5,Math.min(11,Math.floor(bgW/120)));
  for(var i=0;i<ng;i++)bgItems.push({t:'g',x:Math.random()*bgW,y:Math.random()*bgH,r:7+Math.random()*9,vx:(Math.random()-.5)*.2,vy:-(.14+Math.random()*.22),rot:Math.random()*6.28,vr:(Math.random()-.5)*.014,c:Math.floor(Math.random()*3),p:Math.random()*6.28});
  for(var i=0;i<12;i++)bgItems.push({t:'s',x:Math.random()*bgW,y:Math.random()*bgH,r:1.4+Math.random()*1.8,p:Math.random()*6.28,s:.6+Math.random()*1.6,c:Math.floor(Math.random()*3)});
}
function bgBear(ctx,it,col){
  var R=it.r;
  ctx.save();ctx.translate(it.x,it.y);ctx.rotate(it.rot);
  ctx.fillStyle=col;
  ctx.beginPath();ctx.arc(-R*.75,-R*1.55,R*.34,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(R*.75,-R*1.55,R*.34,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(0,-R*.85,R*.8,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(0,0,R,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(-R*1.05,-R*.1,R*.36,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(R*1.05,-R*.1,R*.36,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(-R*.55,R*.85,R*.4,0,6.283);ctx.fill();
  ctx.beginPath();ctx.arc(R*.55,R*.85,R*.4,0,6.283);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.beginPath();ctx.arc(-R*.35,-R*1.15,R*.22,0,6.283);ctx.fill();
  ctx.restore();
}
function bgStep(){
  bgT+=.016;
  var ctx=bgC.getContext('2d'),cols=bgColors(),dark=root.getAttribute('data-theme')==='dark';
  ctx.clearRect(0,0,bgW,bgH);
  for(var i=0;i<bgItems.length;i++){
    var it=bgItems[i],col=cols[it.c];
    if(it.t==='b'){
      it.x+=it.vx+Math.sin(bgT*.5+it.p)*.12;it.y+=it.vy;
      if(it.y<-it.r*2)it.y=bgH+it.r*2;
      if(it.x<-it.r*2)it.x=bgW+it.r*2;if(it.x>bgW+it.r*2)it.x=-it.r*2;
      var g=ctx.createRadialGradient(it.x,it.y,0,it.x,it.y,it.r);
      g.addColorStop(0,'rgba('+col+','+(dark?.14:.10)+')');
      g.addColorStop(1,'rgba('+col+',0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(it.x,it.y,it.r,0,6.283);ctx.fill();
    }else if(it.t==='g'){
      it.x+=it.vx+Math.sin(bgT*.6+it.p)*.18;it.y+=it.vy;it.rot+=it.vr;
      if(it.y<-it.r*3){it.y=bgH+it.r*3;it.x=Math.random()*bgW}
      if(it.x<-it.r*3)it.x=bgW+it.r*3;if(it.x>bgW+it.r*3)it.x=-it.r*3;
      bgBear(ctx,it,'rgba('+col+','+(dark?.22:.16)+')');
    }else{
      var a=.25+.22*Math.sin(bgT*it.s*2+it.p);
      if(a>.07){
        ctx.save();ctx.translate(it.x,it.y);ctx.rotate(bgT*.4+it.p);
        ctx.fillStyle='rgba('+col+','+a.toFixed(3)+')';
        ctx.beginPath();ctx.moveTo(0,-it.r*1.6);ctx.lineTo(it.r*.5,0);ctx.lineTo(0,it.r*1.6);ctx.lineTo(-it.r*.5,0);ctx.closePath();ctx.fill();
        ctx.restore();
      }
    }
  }
  bgRAF=requestAnimationFrame(bgStep);
}
function bgStop(){
  if(bgRAF){cancelAnimationFrame(bgRAF);bgRAF=null}
  if(bgC.getContext)bgC.getContext('2d').clearRect(0,0,bgC.width,bgC.height);
}
function bgToggle(){if(motionOn()){if(!bgRAF){bgSize();bgStep()}}else{bgStop()}}
function setMotion(on,save){
  root.setAttribute('data-motion',on?'on':'off');
  motionBtn.classList.toggle('is-off',!on);
  motionBtn.setAttribute('aria-pressed',String(on));
  if(save){try{localStorage.setItem('gomi-motion',on?'on':'off')}catch(e){}}
  bgToggle();
}
(function(){
  var m=null;try{m=localStorage.getItem('gomi-motion')}catch(e){}
  var osReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(m==='on'||m==='off'){setMotion(m==='on',false)}
  else{
    setMotion(!osReduced,false);
    if(osReduced)setTimeout(function(){toast('Tu equipo pide menos movimiento. Toca el boton del rayo para ver las animaciones.')},1400);
  }
})();
motionBtn.addEventListener('click',function(){
  setMotion(!motionOn(),true);
  toast(motionOn()?'Animaciones activadas':'Animaciones pausadas');
});
window.addEventListener('resize',function(){if(bgRAF)bgSize()},{passive:true});
document.addEventListener('visibilitychange',function(){
  if(document.hidden){bgStop()}else if(motionOn()){bgToggle()}
});

/* ================= TOAST + CONFETTI ================= */
var toastTimer;
function toast(msg){
  var t=$('#toast');
  t.innerHTML='<svg aria-hidden="true"><use href="#i-check"/></svg>'+msg;
  t.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove('show')},2300);
}
/* Auditoria Tecnica 4: API global de notificaciones */
window.mostrarToast=function(msg){toast(msg)};
function confetti(){
  var cols=['#ff2e55','#ff8a3d','#ffd166','#ff4d88','#7c5cff'];
  for(var i=0;i<16;i++){
    var c=document.createElement('i');c.className='conf';
    c.style.left=(45+Math.random()*10)+'vw';c.style.top='58%';
    c.style.background=cols[i%cols.length];
    c.style.setProperty('--dx',(Math.random()*280-140)+'px');
    c.style.setProperty('--dy',(-130-Math.random()*200)+'px');
    document.body.appendChild(c);
    setTimeout(function(el){return function(){el.remove()}}(c),1000);
  }
}

/* ================= SKELETON + VUELO AL CARRITO ================= */
function initSkeletons(){
  $$('.photo,.fph,.lab-photo,.hero-photo,.hero-chip').forEach(function(c){
    var img=c.querySelector('img');if(!img)return;
    if(img.complete&&img.naturalWidth>0)return;
    c.classList.add('sk');
    var clear=function(){c.classList.remove('sk')};
    img.addEventListener('load',clear,{once:true});
    img.addEventListener('error',clear,{once:true});
  });
}
function flyToCart(fromEl,color,imgUrl){
  var cart=$('#cartBtn');if(!cart||!fromEl)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  try{
    var r=fromEl.getBoundingClientRect(),tr=cart.getBoundingClientRect();
    var f=document.createElement(imgUrl?'img':'span');
    f.className='fly';
    if(imgUrl){f.src=imgUrl;f.alt=''}else{f.style.background='linear-gradient(135deg,'+(color||'#ff4d88')+' 20%,#ffd166)'}
    f.style.left=(r.left+r.width/2-22)+'px';
    f.style.top=(r.top+r.height/2-22)+'px';
    document.body.appendChild(f);
    var dx=(tr.left+tr.width/2)-(r.left+r.width/2);
    var dy=(tr.top+tr.height/2)-(r.top+r.height/2);
    var anim=f.animate([
      {transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1},
      {transform:'translate('+(dx*.5)+'px,'+(dy*.35-120)+'px) scale(.8) rotate(200deg)',opacity:1,offset:.55},
      {transform:'translate('+dx+'px,'+dy+'px) scale(.15) rotate(390deg)',opacity:.3}
    ],{duration:760,easing:'cubic-bezier(.5,.05,.6,1)'});
    anim.onfinish=function(){f.remove()};
  }catch(e){}
}

/* ================= CARRITO ================= */
var cart={},emptyHTML;
try{cart=JSON.parse(localStorage.getItem('gomi-cart'))||{}}catch(e){cart={}}
function saveCart(){try{localStorage.setItem('gomi-cart',JSON.stringify(cart))}catch(e){}}
function addItem(key,def){
  if(cart[key]){cart[key].qty++}else{cart[key]={name:def.name,unit:def.unit,list:def.list||def.unit,color:def.color,qty:1,img:def.img||null,kind:def.kind||null}}
  saveCart();renderCart();badgePop();
}
function badgePop(){
  var b=$('#cartCount');b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');
}
function cartCount(){return Object.keys(cart).reduce(function(s,k){return s+cart[k].qty},0)}
/* Cálculo del carrito. Los pouches surtidos armados a mano (kind:'sur') se
   agrupan: cada 3 reciben el precio del Pack Familiar (S/33 vs S/36), que es
   el mismo descuento que aplica la calculadora. Así el ahorro sale exacto
   aunque el pedido sea de 4, 5 o 6 pouches surtidos.                       */
function cartRows(){
  var total=0,list=0,surN=0;
  Object.keys(cart).forEach(function(k){
    var it=cart[k],q=it.qty,u=it.unit,lp=it.list==null?it.unit:it.list;
    if(it.kind==='sur'){surN+=q;return}
    total+=q*u;list+=q*lp;
  });
  if(surN){
    var pa=Math.floor(surN/3),ex=surN%3;
    total+=pa*33+ex*12;
    list+=surN*12;
  }
  return {total:total,list:list,save:Math.max(0,list-total)};
}
function cartTotal(){return cartRows().total}
function cartList(){return cartRows().list}
function cartSave(){return cartRows().save}
function renderCart(){
  var n=cartCount(),lines=$('#cartLines'),foot=$('#cartFoot'),badge=$('#cartCount');
  badge.textContent=n;badge.style.display=n?'grid':'none';
  $('#cartBtn').classList.toggle('has',n>0);
  /* Total y ahorro se actualizan siempre, incluso con el carrito vacío:
     si no, el subtotal queda con el valor viejo tras borrar todo. */
  $('#cartTotal').textContent='S/'+cartTotal();
  var sv=cartSave(),svBox=$('#cartSave');
  if(svBox){
    if(sv>0){
      svBox.classList.add('on');
      $('#cartSaveTxt').textContent='Ahorro aplicado (Pack Familiar / Escolar)';
      $('#cartSaveAmt').textContent='-'+fmt(sv);
    }else{svBox.classList.remove('on')}
  }
  if(!n){lines.innerHTML=emptyHTML;foot.style.display='none';return}
  foot.style.display='grid';
  lines.innerHTML='';
  Object.keys(cart).forEach(function(k){
    var it=cart[k],d=document.createElement('div');d.className='cline';
    var vis=it.img
      ?'<span class="cdot"><img src="'+it.img+'" alt=""></span>'
      :'<span class="cdot" style="background:var(--grad-sun)"><img src="imagenes/hero-gomitas.jpg" alt="" onerror="this.remove()"><svg style="--g:#e6266f;--gd:#7a1233" aria-hidden="true"><use href="#bear"/></svg></span>';
    d.innerHTML=vis+
      '<span class="cinfo"><b>'+it.name+'</b><small>S/'+it.unit+' c/u</small></span>'+
      '<span class="qty"><button type="button" data-q="-" data-k="'+k+'" aria-label="Quitar uno"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round"><use href="#i-minus"/></svg></button><span>'+it.qty+'</span><button type="button" data-q="+" data-k="'+k+'" aria-label="Agregar uno"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round"><use href="#i-plus"/></svg></button></span>';
    lines.appendChild(d);
  });
  $('#cartTotal').textContent='S/'+cartTotal();
  /* Mensaje de WhatsApp con emojis como anclas visuales. */
  var lines=Object.keys(cart).map(function(k){
    var i=cart[k];
    return '  🍬 '+i.qty+' × '+i.name+' — S/'+fmt(i.qty*i.unit);
  }).join('\n');
  var msg='🍬 *PEDIDO GOMI LIGHT*\n'+
          '━━━━━━━━━━━━━━━━━━━\n'+
          '🛍️ *Productos:*\n'+
          (lines||'  (carrito vacío)')+'\n'+
          '━━━━━━━━━━━━━━━━━━━\n'+
          '💰 *Total:* S/'+fmt(cartTotal())+'\n'+
          (sv>0?'🎯 *Ahorro:* -S/'+fmt(sv)+'\n':'')+
          '━━━━━━━━━━━━━━━━━━━\n'+
          '📍 Entrega en Pachacútec, Mi Perú o Ventanilla.\n'+
          '¡Gracias por apoyar el emprendimiento de la I.E. 5130! 🙌';
  $('#cartWa').href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
}
/* Formatea enteros como S/12 (sin decimales). */
function fmt(n){return String(Math.round(n*100)/100)}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-q]');
  if(!b)return;
  var k=b.dataset.k;
  if(b.dataset.q==='+'){cart[k].qty++}else{cart[k].qty--;if(cart[k].qty<=0)delete cart[k]}
  saveCart();renderCart();badgePop();
});
function openCart(){$('#drawer').classList.add('open');$('#overlay').classList.add('show');$('#drawer').setAttribute('aria-hidden','false')}
function closeCart(){$('#drawer').classList.remove('open');$('#overlay').classList.remove('show');$('#drawer').setAttribute('aria-hidden','true')}
$('#cartBtn').addEventListener('click',openCart);
$('#closeCart').addEventListener('click',closeCart);
$('#overlay').addEventListener('click',closeCart);
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-add]');
  if(b){
    var f=FLAVORS[+b.dataset.add];
    var card=b.closest('.fcard'),ph=card?card.querySelector('.fph img'):null;
    flyToCart(b,f.color,ph?ph.src:null);
    addItem('f'+b.dataset.add,{name:'Pouch '+f.name,unit:12,color:f.color,img:f.img});
    toast(f.name+' agregado');confetti();return;
  }
  b=e.target.closest('[data-packadd]');
  if(b){var p=PACKS[b.dataset.packadd];flyToCart(b,p.color,GB);addItem(b.dataset.packadd,p);toast(p.name+' agregado');confetti()}
});

/* ================= LAB DE SABORES ================= */
var labF=0,lab=$('.lab'),labImg=$('#labImg'),labBear=$('#labBear');
function setLab(i){
  labF=i;var f=FLAVORS[i];
  $$('.ftab').forEach(function(t,j){t.classList.toggle('on',j===i);t.setAttribute('aria-selected',j===i)});
  lab.style.setProperty('--fc',f.color);
  labImg.src=f.img.replace('w=200','w=500');
  labImg.alt=f.name;
  var lp=labImg.closest('.lab-photo');
  if(!(labImg.complete&&labImg.naturalWidth>0)){
    lp.classList.add('sk');
    labImg.addEventListener('load',function(){lp.classList.remove('sk')},{once:true});
    labImg.addEventListener('error',function(){lp.classList.remove('sk')},{once:true});
  }else{lp.classList.remove('sk')}
  /* El osito del laboratorio se elimino para que se vea la foto; el JS lo
     busca por si acaso vuelve a estar en el HTML. */
  if(labBear){
    labBear.style.setProperty('--g',f.color);
    labBear.style.setProperty('--gd',f.gd);
  }
  $('#labName').textContent=f.name;
  $('#labDesc').textContent=f.desc;
  $('#labKcal').textContent=f.kcal;
  $('#labExtra').textContent=f.extra;
  $('#labWa').href='https://wa.me/'+WA+'?text=Hola%2C%20quiero%20el%20pouch%20de%20'+f.wa;
}
$$('.ftab').forEach(function(t,i){t.addEventListener('click',function(){setLab(i)})});
$('#labAdd').addEventListener('click',function(){
  var f=FLAVORS[labF];
  flyToCart(this,f.color,labImg.src);
  addItem('f'+labF,{name:'Pouch '+f.name,unit:12,color:f.color,img:f.img});
  toast(f.name+' agregado');confetti();
});

/* ================= CALCULADORA CON DESCUENTO AUTOMÁTICO =================
   Requisito 1.b: al elegir 3 pouches se aplica solo el precio del Pack
   Familiar (S/33 en lugar de S/36) y se muestra el ahorro en vivo.
   La misma función la usa el formulario de pedido.                    */
var range=$('#calcRange');
var UNIT_POUCH=12;
var PACK_DEAL={3:{pack:'familiar',price:33,label:'Pack Familiar'},5:{pack:'escolar',price:50,label:'Pack Escolar'}};
/* Mejor precio para n pouches: aplica el pack si n coincide exacto. */
function bestPrice(n){
  var list=UNIT_POUCH*n,deal=PACK_DEAL[n];
  return deal
    ?{total:deal.price,list:list,save:list-deal.price,label:deal.label,pack:deal.pack}
    :{total:list,list:list,save:0,label:null,pack:null};
}
function calc(){
  var n=+range.value,info=bestPrice(n),hint;
  if(n===1){hint='Perfecto para probar. El <b>Recreo</b> es el primer paso.'}
  else if(info.save>0){hint='🎉 Se aplicó el precio <b>'+info.label+': S/'+info.total+'</b> en vez de S/'+info.list+' (ahorras S/'+info.save+').'}
  else if(n>5){hint='Para '+n+' pouches o más escríbenos por WhatsApp: tenemos <b>precio mayorista</b>.'}
  else{hint='Envío local <b>gratis</b> en Pachacútec, Mi Perú y Ventanilla.'}
  $('#calcQty').textContent=n;
  $('#calcTotal').textContent='S/'+info.total;
  $('#calcHint').innerHTML=hint;
  /* Bloque de ahorro: sólo visible cuando hay descuento real. */
  var box=$('#calcSave');
  if(info.save>0){
    box.classList.add('on');
    $('#calcSaveTxt').textContent='Descuento '+info.label+' aplicado automáticamente';
    $('#calcSaveOld').textContent='S/'+info.list;
    $('#calcSaveAmt').textContent='ahorras S/'+info.save;
  }else{box.classList.remove('on')}
  $('#calcAdd').innerHTML='<svg class="stroke" aria-hidden="true"><use href="#i-cart"/></svg>Agregar '+n+' pouch'+(n>1?'es surtidos':' surtido')+(info.save>0?' · S/'+info.total:'');
}
range.addEventListener('input',calc);
$('#calcAdd').addEventListener('click',function(){
  var n=+range.value,info=bestPrice(n);
  flyToCart(this,'#ffb020',GB);
  if(cart['mix']){cart['mix'].qty+=n}
  else{cart['mix']={name:'Pouch surtido ×'+n,unit:info.total,list:info.list,color:'#ffb020',qty:1}}
  saveCart();renderCart();badgePop();
  toast(info.save>0?n+' pouches agregados · ahorraste S/'+info.save:n+' pouch surtido agregado');
  confetti();
});

/* ================= CONSTRUCTOR DE POUCH SURTIDO =================
   Requisito 1.a: casillas + selectores de cantidad por sabor, con tope
   de 30 gomitas por pouch y resumen antes de agregar al carrito.     */
var POUCH_CAP=30,bQty=[0,0,0,0],builder=$('#builder');
function bTotal(){return bQty.reduce(function(s,n){return s+n},0)}
function bRender(){
  var tot=bTotal(),left=POUCH_CAP-tot;
  for(var i=0;i<4;i++){
    $('#bq'+i).textContent=bQty[i];
    var chk=$('#bchk'+i),sel=$('#bs'+i),row=$('.brow[data-bf="'+i+'"]',builder);
    chk.checked=bQty[i]>0;
    row.classList.toggle('on',bQty[i]>0);
    if(+sel.value!==bQty[i])sel.value=String(bQty[i]);
  }
  /* barra de progreso */
  $('#bMeter').style.width=Math.min(100,(tot/POUCH_CAP)*100)+'%';
  /* aviso de estado */
  var w=$('#bWarn');
  if(tot===0){w.classList.remove('on');$('#bWarnTxt').textContent='Elige al menos un sabor.'}
  else if(left>0){w.classList.add('on');$('#bWarnTxt').textContent='Te faltan '+left+' gomita'+(left===1?'':'s')+' para completar el pouch de 30. Puedes agregarlo igual.'}
  else if(left<0){w.classList.add('on');$('#bWarnTxt').textContent='Te pasaste por '+(-left)+'. El pouch más grande es de 30 gomitas.'}
  else{w.classList.add('on');$('#bWarnTxt').textContent='¡Listo! Tu pouch quedó completo con 30 gomitas.'}
  /* resumen */
  var parts=[];
  for(var j=0;j<4;j++){if(bQty[j]>0)parts.push(bQty[j]+'× '+FLAVORS[j].name)}
  $('#bSummary').textContent=tot+' de '+POUCH_CAP+' gomitas'+(parts.length?' · '+parts.join(', '):'');
  $('#bPrice').textContent='S/'+UNIT_POUCH;
  $('#bAdd').disabled=tot===0||tot>POUCH_CAP;
}
function bSet(i,n){
  n=Math.max(0,Math.min(POUCH_CAP,n));
  /* no dejar que la suma supere el tope del pouch */
  var others=bTotal()-bQty[i];
  if(others+n>POUCH_CAP)n=Math.max(0,POUCH_CAP-others);
  bQty[i]=n;bRender();
}
if(builder){
  $$('.bstep button',builder).forEach(function(btn){
    btn.addEventListener('click',function(){
      var i=+btn.dataset.bf,d=+btn.dataset.bd;
      bSet(i,bQty[i]+d);
    });
  });
  $$('.bchk',builder).forEach(function(chk){
    chk.addEventListener('change',function(){
      var i=+chk.id.replace('bchk','');
      if(chk.checked){if(bQty[i]===0)bSet(i,Math.min(10,POUCH_CAP-bTotal()));else bRender()}
      else{bQty[i]=0;bRender()}
    });
  });
  $$('select[data-bs]',builder).forEach(function(sel){
    sel.addEventListener('change',function(){bSet(+sel.dataset.bs,+sel.value)});
  });
  $('#bAdd').addEventListener('click',function(){
    var tot=bTotal();
    if(!tot||tot>POUCH_CAP)return;
    var parts=[];
    for(var j=0;j<4;j++){if(bQty[j]>0)parts.push(bQty[j]+'× '+FLAVORS[j].name)}
    flyToCart(this,'#ffb020',GB);
    var key='sur';
    if(cart[key])cart[key].qty++;
    else cart[key]={name:'Pouch surtido ('+parts.join(' + ')+')',unit:UNIT_POUCH,list:UNIT_POUCH,color:'#ffb020',qty:1,kind:'sur'};
    saveCart();renderCart();badgePop();
    var sv=cartSave();
    toast(sv>0?'Pouch surtido agregado · ahorraste S/'+sv:'Pouch surtido agregado · '+parts.join(' + '));confetti();
  });
  bRender();
}

/* ================= FAQ ================= */
$$('.qa').forEach(function(qa){
  qa.querySelector('button').addEventListener('click',function(){
    var open=qa.classList.contains('on');
    $$('.qa').forEach(function(q){q.classList.remove('on');q.querySelector('.ans').style.maxHeight=0});
    if(!open){qa.classList.add('on');var a=qa.querySelector('.ans');a.style.maxHeight=a.scrollHeight+'px'}
  });
});

/* ================= DULCITA =================
   Asistente conversacional. Respuestas contextualizadas con links en azul.
*/
var botFab=$('#botFab'),botPanel=$('#botPanel'),botMsgs=$('#botMsgs'),botClose=$('#botClose');
var botForm=$('#botForm'),botInput=$('#botInput');
var greeted=false,lastAnswer=null;

function fold(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s$]/g,' ').replace(/\s+/g,' ').trim();
}

var TOPICS=[
  {k:['envio','enviar','entrega','llega','delivery','gratis'], a:'Envío <b>gratis</b> en Pachacútec, Mi Perú y Ventanilla. Lima/Callao: S/8 en 24-48 h.', c:[['Ver tienda','tienda']]},
  {k:['precio','precia','cuesta','vale','tarifa','costo'], a:'Un pouch de <b>30 gomitas cuesta S/12</b>. Pack Familiar: 3× S/33, Escolar: 5× S/50.', c:[['Ver packs','tienda']]},
  {k:['sabor','sabores','fresa','mango','arandano','limon'], a:'Fresa Andina, Mango Jengibre, Arándano Nocturno y Limón Menta. <b>Fresa, Mango y Limón Menta son veganos</b>; el Arándano lleva colágeno.', c:[['Ver sabores','sabores']]},
  {k:['vegano','vegana','pectina','gelatina','animal'], a:'<b>Pectina de cítricos</b>, sin gelatina animal. Solo Arándano tiene colágeno.', c:[['Ver sabores','sabores']]},
  {k:['caloria','calorias','nutricion'], a:'<b>42 kcal</b> por cada 5 gomitas (el pouch trae 30). Sabor vegano = pectina natural.', c:[['Ver nutrición','nutricion']]},
  {k:['pedir','comprar','orden','carrito','cómo pedir'], a:'En <b>3 pasos</b>: eliges, agregas y pides por WhatsApp.', c:[['Ver tienda','tienda']]},
   {k:['mayorista','bodega','quiosco','distribucion'], a:'Desde <b>10 pouches</b> con <b>precio mayorista</b>. Muestras gratis.', c:[['Escribirme','contacto']]},
   {k:['azucar','endulzante','stevia','eritritol'], a:'<b>0% azúcar añadida</b>: endulzamos con stevia y eritritol. El poco azúcar (≈3 g) viene de la fruta real.', c:[['Ver nutrición','nutricion']]},
   {k:['cafeina','gluten','alergia','sin gluten'], a:'<b>Sin cafeína</b> y sin gluten. Si tienes una alergia específica, confirma el lote por WhatsApp antes de comprar.', c:[['Escribirme','contacto']]},
   {k:['whatsapp','numero','telefono','contacto','llamar'], a:'El WhatsApp es <b>519 101 47552</b>. Respondemos en menos de 1 hora.', c:[['Abrir contacto','contacto']]},
   {k:['hola','buenas','hey','buenos dias','buenas tardes','buenas noches','saludos','buen dia','oli','alo'],
    v:['¡Holaaa! 🥰 Qué gusto verte por acá. ¿Te cuento los sabores, el precio o cómo pedir?',
       '¡Hola! Bienvenida/o a GOMI LIGHT 🥰 ¿En qué te ayudo hoy: precios, envíos o los sabores?',
       '¡Qué alegría saludarte 😋 Pregúntame lo que quieras, soy Dulcita.'],
    c:[['Ver packs','tienda']]},
   {k:['como estas','como estan','que tal','que fue','todo bien','como va'],
    v:['¡Pura fruta y pectina, gracias por preguntar 😋 ¿Y tú, qué se te antoja hoy?',
       '¡Muy bien, lista para seguir endulzando Pachacútec 🍬 ¿Y tú? ¿Una gomita?',
       '¡De lo mejor! Aquí revolviendo el alambique de pectina 😊 ¿Te cuento algo de las gomitas?'],
    c:[['Ver sabores','sabores']]},
   {k:['gracias','muchas gracias','thank','genial','perfecto','excelente','buenisimo'],
    v:['¡Con mucho gusto! 😊 Si te queda otra duda, aquí estoy.',
       '¡Un placer! ¿Te muestro los packs para que animes tu pedido?'],
    c:[['Ver packs','tienda']]},
   {k:['chao','adios','nos vemos','hasta luego','bye','me voy'],
    v:['¡Nos vemos! 🍬 Cuando quieras, aquí te espero con gomitas.',
       '¡Cuídate! Y si se te antoja algo dulce, ya sabes dónde encontrarme 😊'],
    c:[]},
 ];

function matchTopic(q){
  var n=fold(q);
  for(var t of TOPICS){
    for(var k of t.k){
      if(n.includes(k))return t;
    }
  }
  return null;
}

function blue(text,href){
  return '<a href="#/'+href+'" data-route="'+href+'" style="color:#2563eb;font-weight:600;text-decoration:none;">'+text+'</a>';
}

function bubble(cls,html){
  var el=document.createElement('div');
  el.className='bmsg '+cls;
  if(cls==='user'){el.textContent=html}else{el.innerHTML=html}
  botMsgs.appendChild(el);botMsgs.scrollTop=botMsgs.scrollHeight;
  return el;
}

function pickAnswer(t){
  /* Si el tema tiene variantes (v), rotamos entre ellas para que
     nunca repita dos veces seguidas la misma frase. */
  var text=t.v?t.v[(t._i=(t._i||0))%t.v.length]:t.a;
  if(t.v)t._i++;
  var link=t.c&&t.c[0]?'<a href="#/'+t.c[0][1]+'" data-route="'+t.c[0][1]+'" style="color:#2563eb;font-weight:600;text-decoration:none;">'+t.c[0][0]+'</a>':'';
  return text+(link?' '+link:'');
}

/* ============ DULCITA IA ============
   Orden de los motores: NVIDIA (principal) y Pollinations (segunda opción).
   NVIDIA gpt-oss-20b no se puede llamar directo desde el navegador: exige la
   cabecera Authorization y su preflight de CORS no se aprueba. Por eso se
   antepone si hay un proxy propio (worker-nvidia.js) en NV_PROXY; si no, el
   mismo modelo se pide por el transporte de Pollinations.
   El prompt base solo lleva: quién es, tono y CONTEXTO del producto.
   No lleva respuestas predefinidas: las genera la IA.
   Si la red falla, cae al modo local (TOPICS) sin que el usuario lo note. */
var AI_URL='https://text.pollinations.ai/openai';
/* Modelo principal: gpt-oss-20b, el de NVIDIA. Llega por el Worker de
   Cloudflare, porque el navegador no puede llamar a NVIDIA directo (CORS).
   Si el Worker se cae, el mismo modelo se pide por Pollinations. */
var AI_MODEL='gpt-oss-20b';
var AI_MODEL_ALT='openai-fast';   /* segunda opción, más rápida */
var NV_PROXY='https://gomi-ai.gomi-worker.workers.dev';   /* puente a NVIDIA */
var dlxHist=[];     // historial de la conversación
var dlxBusy=false;  // evita dobles envíos

var DULCITA_SYS=
'Eres Dulcita, la gomita mascota de GOMI LIGHT, emprendimiento escolar de la I.E. N.° 5130 Ciudadela Pachacútec (Ventanilla, Callao, Perú). '+
'Hablas en primera persona, con calidez peruana, fresca, juvenil y cortés. Respuestas CORTAS: 1 a 3 frases y sin emojis.\n\n'+
'CONTEXTO DEL PRODUCTO (todo lo que conoces):\n'+
'- Gomitas con fruta real, pectina de cítricos (sin gelatina animal) y 0% azúcar añadida; dulzor de stevia y eritritol.\n'+
'- 4 sabores: Fresa Andina, Mango Jengibre, Arándano Nocturno (único con colágeno, no vegano) y Limón Menta. Los veganos son Fresa, Mango y Limón Menta.\n'+
'- Pouch de 30 gomitas: S/12. Pack Familiar: 3 pouches S/33 (ahorro S/3). Pack Escolar: 5 pouches S/50 (ahorro S/10).\n'+
'- Pouch surtido: el cliente elige cuántas gomitas por sabor hasta 30, en la sección Tienda.\n'+
'- Envío GRATIS en Pachacútec, Mi Perú y Ventanilla (punto de encuentro). Lima y Callao: S/8, 24-48 h.\n'+
'- Pagos: Yape, Plin, transferencia o efectivo contra entrega.\n'+
'- WhatsApp oficial: 519 101 47552. Ubicación: I.E. 5130, Av. 225, Pachacútec.\n'+
'- 42 kcal por cada 5 gomitas (el pouch trae 30). Sin cafeína, sin gluten, sin colorantes artificiales.\n'+
'- Cambio garantizado si el primer pouch no convence.\n'+
'- B2B: precio mayorista desde 10 pouches, muestras gratis en Contacto.\n\n'+
'MANERA DE RESPONDER:\n'+
'- Si te saludan, saluda con dulzura y lleva suave al producto.\n'+
'- Si algo no está en este contexto, invita con naturalidad a confirmar por WhatsApp.\n'+
'- No inventes precios, horarios ni datos. Nunca digas que eres un modelo de IA: eres Dulcita, la mascota.\n'+
'- Cuando el cliente muestre interés en comprar o tu respuesta remita a una sección del sitio, cierra con UN link en este formato: [Texto corto](#/ruta). El texto sale en AZUL y lleva a la sección. Rutas válidas: inicio, sabores, nutricion, historia, tienda, faq, contacto.';

/* Convierte los links [texto](#/ruta) que emite Dulcita en <a> azules. */
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function renderBotText(raw){
  /* 1) links propios [texto](#/ruta) → <a azul>; 2) **negrita** markdown → <b> */
  return raw.split(/(\[[^\]]+\]\(#\/[a-z]+[^)]*\))/g).map(function(p){
    var m=p.match(/\[([^\]]+)\]\(#\/([a-z]+)[^)]*\)/);
    if(m)return '<a href="#/'+m[2]+'" data-route="'+m[2]+'" style="color:#2563eb;font-weight:700">'+esc(m[1])+'</a>';
    return esc(p).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
  }).join('');
}

/* Llama a la IA: NVIDIA primero y Pollinations de segunda.
   Ojo con por qué hace falta el proxy: NVIDIA solo acepta la clave en la
   cabecera "Authorization", y eso obliga al navegador a hacer un preflight que
   su servidor no aprueba, así que la llamada directa se bloquea. Si pegas aquí
   la dirección de tu Cloudflare Worker (worker-nvidia.js) entra NVIDIA de
   verdad; si lo dejas vacío, el mismo gpt-oss-20b se pide por el transporte de
   Pollinations, que sí admite CORS. */
/* La NVIDIA se pide siempre al Worker: la clave vive alli, nunca en el navegador,
   asi que esta funcion no acepta credenciales. */
function postIA(url,model,msgs,maxTok,ctrl){
  return fetch(url,{method:'POST',signal:ctrl.signal,headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:model,messages:msgs,max_tokens:maxTok,temperature:.7})
  }).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
   .then(function(d){
     var m=d&&d.choices&&d.choices[0]&&d.choices[0].message;
     var t=m&&(m.content||m.reasoning_content||m.reasoning);
     if(!t||!String(t).trim())throw new Error('vacio');
     return String(t).trim();
   });
}
var FALLA_CUOTA=/HTTP (402|429|5\d\d)/;
function conReintentos(fn,intentos){
  function intento(n){
    return Promise.resolve().then(fn).catch(function(e){
      if(n>=intentos||!FALLA_CUOTA.test((e&&e.message)||''))throw e;
      return new Promise(function(r){setTimeout(r,1300*n)}).then(function(){return intento(n+1)});
    });
  }
  return intento(1);
}
function askDulcita(q,typingEl){
  /* Cada motor tiene su propio reloj. Antes un unico temporizador de 30 s
     bloqueaba toda la cadena: si NVIDIA se ponia lento, el usuario esperaba
     30 s antes de que el chat pruebe con el siguiente. Ahora el principal
     rinde en 9 s y se pasa al de respaldo. */
  var timeout=setTimeout(function(){},1);clearTimeout(timeout);
  var msgs=[{role:'system',content:DULCITA_SYS}]
    .concat(dlxHist.slice(-10))
    .concat([{role:'user',content:q}]);
  /* Motores en orden: NVIDIA de principal, Pollinations de segunda.
     nv: segundos maxima de espera de ese motor. */
  var motores=[];
  if(NV_PROXY)motores.push({n:'NVIDIA · '+NV_MODEL,nv:9,fn:function(){
    var c=new AbortController(),t=setTimeout(function(){c.abort()},9000);
    return postIA(NV_PROXY+'/chat',NV_MODEL,msgs,600,c).then(function(r){clearTimeout(t);return r},
      function(e){clearTimeout(t);throw e});
  }});
  motores.push({n:AI_MODEL,nv:11,fn:function(){
    var c=new AbortController(),t=setTimeout(function(){c.abort()},11000);
    return postIA(AI_URL,AI_MODEL,msgs,280,c).then(function(r){clearTimeout(t);return r},
      function(e){clearTimeout(t);throw e});
  }});
  motores.push({n:AI_MODEL_ALT,nv:9,fn:function(){
    var c=new AbortController(),t=setTimeout(function(){c.abort()},9000);
    return postIA(AI_URL,AI_MODEL_ALT,msgs,250,c).then(function(r){clearTimeout(t);return r},
      function(e){clearTimeout(t);throw e});
  }});
  function probar(i){
    if(i>=motores.length())return Promise.reject(new Error('sin motores'));
    return conReintentos(motores[i].fn,2).then(function(t){return {t:t,n:motores[i].n}});
  }
  function responde(r){
    typingEl.remove();
    dlxHist.push({role:'user',content:q},{role:'assistant',content:r.t});
    bubble('bot',renderBotText(r.t));
    dlxBusy=false;
  }
  var cadena=Promise.resolve();
  motores.forEach(function(m,i){cadena=cadena.then(function(){return probar(i)})});
  cadena.then(responde).catch(function(){
    typingEl.remove();dlxBusy=false;
    /* Modo local de respaldo si falla la red/API */
    var t=matchTopic(q);
    if(t)bubble('bot',pickAnswer(t));
    else bubble('bot','Uy, mi conexión se trabó un poquito 🙈 inténtalo de nuevo o escríbenos al '+blue('WhatsApp','contacto')+'.');
  });
}

/* Pre-calienta el endpoint al abrir la página: evita el "cold start"
   (~9 s) para que la primera respuesta real salga en ~1 s. */
function warmAI(){
  /* El pre-calentado va contra el modelo de reserva: el principal es de razonamiento
     y gastaría tokens solo en un saludo. */
  fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:AI_MODEL_ALT,messages:[{role:'user',content:'ok'}],max_tokens:1})
  }).then(function(){'caliente'}).catch(function(){});
}
window.addEventListener('load',function(){setTimeout(warmAI,1200)});

function botAnswer(q){
  if(dlxBusy)return; /* no procesar otro mensaje hasta que responda */
  dlxBusy=true;
  bubble('user',q);
  var typing=bubble('bot','<span class=\"blink\"><i></i><i></i><i></i></span>');
  askDulcita(q,typing);
}

function greet(){
  if(greeted)return;greeted=true;
  setTimeout(function(){bubble('bot','Hola, soy <b>Dulcita</b> 🙂 Te ayudo con precios, envíos, sabores y pedidos. ¿Qué necesitas?')},200);
  var chips=['¿Precio?','¿Tienen azúcar?','¿Hacen envíos?','¿Son veganas?','¿Cómo pido?'];
  chips.forEach(function(c){
    var b=document.createElement('button');b.type='button';b.className='bchip';b.textContent=c;
    b.onclick=function(){botAnswer(c)};
    $('#botChips').appendChild(b);
  });
}

/* Event handlers - run after DOM ready */
function openBot(){
  botPanel.classList.add('open');
  botFab.setAttribute('aria-expanded','true');
  greet();botInput.focus();kbFix();
}
function closeBot(){
  botPanel.classList.remove('open');
  botFab.setAttribute('aria-expanded','false');
  botPanel.style.bottom='';botPanel.style.maxHeight='';
}
botFab.addEventListener('click',function(){
  if(botPanel.classList.contains('open'))closeBot();else openBot();
});

/* Subir el panel por encima del teclado cuando éste se abre (móvil).
   visualViewport.height se reduce: el panel se pega justo arriba del teclado. */
function kbFix(){
  if(!window.visualViewport||!botPanel.classList.contains('open'))return;
  var vv=window.visualViewport;
  var gap=window.innerHeight-vv.height-vv.offsetTop;
  if(gap>120){ /* teclado visible */
    botPanel.style.bottom=(gap+8)+'px';
    botPanel.style.maxHeight=(vv.height-90)+'px';
  }else{
    botPanel.style.bottom='';botPanel.style.maxHeight='';
  }
  botMsgs.scrollTop=botMsgs.scrollHeight;
}
if(window.visualViewport){
  window.visualViewport.addEventListener('resize',kbFix);
  window.visualViewport.addEventListener('scroll',kbFix);
}
/* Al tocar el input, damos tiempo al teclado y reajustamos */
botInput.addEventListener('focus',function(){setTimeout(kbFix,300)});

botClose.addEventListener('click',closeBot);

botForm.addEventListener('submit',function(e){
  e.preventDefault();
  var q=botInput.value.trim();
  if(q){botAnswer(q);botInput.value='';setTimeout(kbFix,50);}
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closeBot();
    closeCart();closeMenu();closeSheet();
  }
});


/* ================= SHEET MÓVIL ================= */
var sheet=$('#sheet');
function closeSheet(){sheet.classList.remove('open')}
$('#moreBtn').addEventListener('click',function(){sheet.classList.toggle('open')});
sheet.addEventListener('click',function(){setTimeout(closeSheet,180)});

/* ================= REVEAL / CONTADORES / METERS ================= */
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(!en.isIntersecting)return;
    var el=en.target;
    if(el.classList.contains('rv'))el.classList.add('in');
    if(el.dataset.count)countUp(el,+el.dataset.count);
    if(el.dataset.meter)el.style.width=el.dataset.meter+'%';
    io.unobserve(el);
  });
},{threshold:.18});
$$('.rv,[data-count],[data-meter]').forEach(function(el){io.observe(el)});
function countUp(el,target){
  var t0=null,dur=1200;
  function step(ts){
    if(!t0)t0=ts;
    var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent=Math.round(target*e);
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ================= INIT ================= */
emptyHTML=$('#cartLines').innerHTML;
$('#year').textContent=new Date().getFullYear();
initSkeletons();setLab(0);calc();renderCart();route();

});
