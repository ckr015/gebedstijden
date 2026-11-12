// Controleert de berekening tegen de officiële Diyanet-tabel voor Diemen (2027).
// Draaien: node tests/diyanet.test.js   — slaagt als geen tijd meer dan 3 minuten afwijkt.
var PT = require('../calc.js'), fs = require('fs'), path = require('path');
var lat = 52.3380, lng = 4.9597, keys = ['fajr', 'rise', 'noon', 'asr', 'set', 'isha'];
function offset(m, d) { return ((m > 3 && m < 10) || (m === 3 && d >= 28) || (m === 10 && d < 31)) ? 2 : 1; }
var worst = 0, total = 0, n = 0;
fs.readFileSync(path.join(__dirname, 'diemen-2027.txt'), 'utf8').trim().split('\n').forEach(function (line) {
  var a = line.split(/\s+/), dt = a[0].split('.').map(Number), tz = offset(dt[1], dt[0]);
  var r = PT.compute(dt[2], dt[1], dt[0], lat, lng);
  keys.forEach(function (k, i) {
    var q = a[i + 1].split(':'), exp = Date.UTC(dt[2], dt[1] - 1, dt[0], +q[0] - tz, +q[1]);
    var e = Math.abs(Math.round((r[k] - exp) / 60000));
    if (e > 3) console.log('AFWIJKING', a[0], k, e, 'min');
    worst = Math.max(worst, e); total += e; n++;
  });
});
console.log(n + ' tijden vergeleken, grootste afwijking ' + worst + ' min, gemiddeld ' + (total / n).toFixed(2) + ' min');
process.exit(worst > 3 ? 1 : 0);
