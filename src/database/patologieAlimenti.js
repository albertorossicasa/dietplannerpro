// Regole patologie - alimenti vietati
export const regolePatologie = {
  'Celiachia': ['Pane di frumento', 'Pasta di semola', 'Crackers', 'Biscotti al grano'],
  'Ipercolesterolemia': ['Burro', 'Strutto', 'Lardo', 'Formaggi grassi', 'Carni rosse grasse'],
  'Diabete tipo 2': ['Zucchero bianco', 'Miele', 'Dolciumi', 'Bevande zuccherate'],
  'Ipertensione': ['Sale da cucina', 'Dadi da brodo', 'Cibi in scatola', 'Insaccati'],
  'Intolleranza al lattosio': ['Latte vaccino', 'Yogurt classico', 'Formaggi freschi', 'Panna'],
  'Gotta': ['Carne rossa', 'Birra', 'Frattaglie', 'Crostacei', 'Legumi secchi']
};

export function getAlimentiVietati(patologie) {
  if (!patologie) return [];
  const patologieLista = patologie.split(',').map(p => p.trim());
  let vietati = [];
  for (let pat of patologieLista) {
    if (regolePatologie[pat]) vietati.push(...regolePatologie[pat]);
  }
  return [...new Set(vietati)];
}

export function isAlimentoVietato(nomeAlimento, patologie) {
  const vietati = getAlimentiVietati(patologie);
  return vietati.some(v => nomeAlimento.toLowerCase().includes(v.toLowerCase()));
}