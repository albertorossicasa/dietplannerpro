const comuni = {
  'Milano': 'F205', 'Roma': 'H501', 'Napoli': 'F839', 'Torino': 'L219', 'Palermo': 'G273',
  'Genova': 'D969', 'Bologna': 'A944', 'Firenze': 'D612', 'Bari': 'A662', 'Catania': 'C351'
};

export function calcolaCodiceFiscale(nome, cognome, sesso, dataNascita, comune) {
  nome = nome.toUpperCase().replace(/[^A-Z]/g, '');
  cognome = cognome.toUpperCase().replace(/[^A-Z]/g, '');
  
  let cognomeCons = cognome.replace(/[AEIOU]/g, '');
  let cognomeVoc = cognome.replace(/[^AEIOU]/g, '');
  let cognomeCF = (cognomeCons + cognomeVoc + 'XXX').substring(0, 3);
  
  let nomeCons = nome.replace(/[AEIOU]/g, '');
  let nomeVoc = nome.replace(/[^AEIOU]/g, '');
  let nomeCF;
  if (nomeCons.length >= 3) {
    nomeCF = nomeCons[0] + nomeCons[2] + (nomeCons[3] || 'X');
  } else {
    nomeCF = (nomeCons + nomeVoc + 'XXX').substring(0, 3);
  }
  
  let [day, month, year] = dataNascita.split('/');
  let anno = year.slice(-2);
  let mesi = { '01':'A', '02':'B', '03':'C', '04':'D', '05':'E', '06':'H',
               '07':'L', '08':'M', '09':'P', '10':'R', '11':'S', '12':'T' };
  let meseLettera = mesi[month];
  let giorno = sesso === 'M' ? String(parseInt(day)).padStart(2, '0') : String(parseInt(day) + 40);
  
  let codiceComune = comuni[comune] || 'H501';
  let cfParziale = cognomeCF + nomeCF + anno + meseLettera + giorno + codiceComune;
  
  let pari = 0, dispari = 0;
  let mappaDispari = { '0':1, '1':0, '2':5, '3':7, '4':9, '5':13, '6':15, '7':17, '8':19, '9':21,
                       'A':1, 'B':0, 'C':5, 'D':7, 'E':9, 'F':13, 'G':15, 'H':17, 'I':19, 'J':21,
                       'K':2, 'L':4, 'M':18, 'N':20, 'O':11, 'P':3, 'Q':6, 'R':8, 'S':12, 'T':14,
                       'U':16, 'V':10, 'W':22, 'X':25, 'Y':24, 'Z':23 };
  
  for (let i = 0; i < cfParziale.length; i++) {
    let char = cfParziale[i];
    if (i % 2 === 0) dispari += mappaDispari[char];
    else pari += parseInt(char, 36);
  }
  let resto = (pari + dispari) % 26;
  let letteraControllo = String.fromCharCode(65 + resto);
  
  return cfParziale + letteraControllo;
}

export function validazioneCF(cf) {
  if (!cf || cf.length !== 16) return false;
  const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  return regex.test(cf.toUpperCase());
}