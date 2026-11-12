# Gebedstijden

Webversie van de gebedstijden-app (Hanefi, tijden volgens de rekenregels van Diyanet).
Open https://ckr015.github.io/gebedstijden/ en zet de pagina op je beginscherm.

Dit is een onafhankelijke app, niet van of namens Diyanet.

- `calc.js` rekent de tijden uit, `i18n.js` bevat de teksten (NL, TR, EN), `app.js` de schermen.
- `sw.js` en `manifest.webmanifest` zorgen dat de app ook zonder internet opent.
- Test de berekening tegen de Diyanet-tabel voor Diemen: `node tests/diyanet.test.js`

De Arabische tekst in `sure.js` komt uit het pakket quran-json (Uthmani-tekst van quranenc.com, gegevens onder CC BY-SA 4.0).
