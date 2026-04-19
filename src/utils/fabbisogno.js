export function calcolaFabbisogno(cliente) {
  const { sesso, peso_kg, altezza_cm, eta, livelloAttivita = 'moderato', obiettivo = 'mantenimento' } = cliente;
  
  if (!peso_kg || !altezza_cm || !eta) return null;
  
  let bmr;
  if (sesso === 'M') {
    bmr = 66.47 + (13.75 * peso_kg) + (5.003 * altezza_cm) - (6.755 * eta);
  } else {
    bmr = 655.1 + (9.563 * peso_kg) + (1.85 * altezza_cm) - (4.676 * eta);
  }
  
  const fattori = { 'sedentario': 1.2, 'leggero': 1.375, 'moderato': 1.55, 'attivo': 1.725, 'molto attivo': 1.9 };
  let tdee = bmr * (fattori[livelloAttivita] || 1.55);
  
  if (obiettivo === 'perdere peso') tdee *= 0.85;
  else if (obiettivo === 'aumentare peso') tdee *= 1.15;
  
  const carbo = (tdee * 0.45) / 4;
  const proteine = (tdee * 0.30) / 4;
  const grassi = (tdee * 0.25) / 9;
  
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), carbo: Math.round(carbo), proteine: Math.round(proteine), grassi: Math.round(grassi) };
}