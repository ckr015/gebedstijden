// Gebedstijden volgens de Diyanet-methode (imsak 18°, yatsı 17°, temkin)
var PT = (function(){
  var R = Math.PI/180, KF = 0.67, KI = 0.62, FIXT = 0;
  function fix(a,b){ a = a - b*Math.floor(a/b); return a<0 ? a+b : a; }
  function jul(y,m,d){ if(m<=2){y-=1;m+=12;} var A=Math.floor(y/100), B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5; }
  function sun(jd){ var D=jd-2451545.0, g=fix(357.529+0.98560028*D,360), q=fix(280.459+0.98564736*D,360),
    L=fix(q+1.915*Math.sin(g*R)+0.020*Math.sin(2*g*R),360), e=23.439-0.00000036*D,
    RA=Math.atan2(Math.cos(e*R)*Math.sin(L*R),Math.cos(L*R))/R/15;
    return { eqt: q/15-fix(RA,24), decl: Math.asin(Math.sin(e*R)*Math.sin(L*R))/R }; }
  // geeft UTC-milliseconden voor de zes tijden van de kalenderdag y-m-d op (lat,lng)
  function compute(y,m,d,lat,lng,opt){
    opt = opt||{};
    var jd0 = jul(y,m,d) - lng/360;
    var FX = (opt.fix===undefined) ? FIXT : opt.fix;
    function S(t){ return sun(jd0 + (FX===null ? t : FX)); }
    function mid(t){ return fix(12 - sun(jd0+t).eqt, 24); }
    function ang(a,t,dir){ var dc=S(t).decl, n=mid(t),
      x=(-Math.sin(a*R)-Math.sin(dc*R)*Math.sin(lat*R))/(Math.cos(dc*R)*Math.cos(lat*R));
      if(x>1||x<-1) return NaN;
      return n + dir*Math.acos(x)/R/15; }
    function asr(f,t){ var dc=S(t).decl, a=-Math.atan(1/(f+Math.tan(Math.abs(lat-dc)*R)))/R; return ang(a,t,1); }
    // Boven 45° breedte volgt dit de Diyanet-tabellen: yatsı op 16°, en in de zomer,
    // als de zon 's nachts niet diep genoeg zakt, een evenredig kleinere hoek.
    var hi = Math.abs(lat) >= 45, FA = 18, IA = hi ? 16 : 17;
    function depth(t){ return 90 - Math.abs(lat + sun(jd0+t).decl); }
    if(hi){ FA = Math.min(FA, (opt.kf||KF)*depth(opt.df===undefined?0:opt.df)); IA = Math.min(IA, (opt.ki||KI)*depth(opt.di===undefined?0.25:opt.di)); }
    var t={fajr:5/24,rise:6/24,noon:12/24,asr:13/24,set:18/24,isha:18/24};
    for(var i=0;i<3;i++){ t={ fajr:ang(FA,t.fajr,-1)/24, rise:ang(0.833,t.rise,-1)/24, noon:mid(t.noon)/24,
      asr:asr(1,t.asr)/24, set:ang(0.833,t.set,1)/24, isha:ang(IA,t.isha,1)/24 }; }
    var h={ fajr:t.fajr*24, rise:t.rise*24, noon:t.noon*24, asr:t.asr*24, set:t.set*24, isha:t.isha*24 };
    if(isNaN(h.fajr)||isNaN(h.isha)){ var part=Math.max((24-(h.set-h.rise))/3, 80/60);
      if(isNaN(h.isha)) h.isha=h.set+part; if(isNaN(h.fajr)) h.fajr=h.rise-part; }
    var adj = opt.raw ? {fajr:0,rise:0,noon:0,asr:0,set:0,isha:0} : {fajr:0,rise:-7,noon:5,asr:4,set:7,isha:0};
    var base = Date.UTC(y,m-1,d), out={};
    ['fajr','rise','noon','asr','set','isha'].forEach(function(k){
      var mins = (h[k]-lng/15)*60 + adj[k];
      out[k] = base + Math.round(mins)*60000; });
    return out;
  }
  return { compute: compute };
})();
if (typeof module!=='undefined') module.exports = PT;
