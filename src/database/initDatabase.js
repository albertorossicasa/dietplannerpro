export const initDemoData = async (db) => {
  // Inserisci professionista demo
  await db.runAsync(`
    INSERT INTO professionista (id, username, password_hash, nome, cognome, codice_fiscale, telefono, email, specializzazione, created_at)
    VALUES (1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mario', 'Bianchi', 'BNCMRA80A01H501U', '3331234567', 'mario@nutrizionista.it', 'Nutrizionista', datetime('now'))
  `);

  // Clienti demo
  const clienti = [
    { nome: 'Laura', cognome: 'Verdi', cf: 'VRDLRA85B01H501U', email: 'laura@email.it', telefono: '3331111111', peso: 65, altezza: 165, nascita: '15/03/1985', sesso: 'F', obiettivo: 'Mantenimento', patologia: '' },
    { nome: 'Marco', cognome: 'Rossi', cf: 'RSSMRC90C01H501U', email: 'marco@email.it', telefono: '3332222222', peso: 80, altezza: 175, nascita: '20/07/1990', sesso: 'M', obiettivo: 'Perdere peso', patologia: 'Ipercolesterolemia' }
  ];
  for (const c of clienti) {
    await db.runAsync(`
      INSERT INTO clienti (nome, cognome, codice_fiscale, email, telefono, peso_kg, altezza_cm, data_nascita, sesso, patologia, data_creazione)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, c.nome, c.cognome, c.cf, c.email, c.telefono, c.peso, c.altezza, c.nascita, c.sesso, c.patologia);
  }

  // Alimenti demo
  const alimenti = [
    { nome: 'Pollo petto', kcal: 165, proteine: 31, carbo: 0, grassi: 3.6, categoria: 'Carne' },
    { nome: 'Merluzzo', kcal: 82, proteine: 18, carbo: 0, grassi: 0.7, categoria: 'Pesce' },
    { nome: 'Riso integrale', kcal: 111, proteine: 2.6, carbo: 23, grassi: 0.9, categoria: 'Cereali' }
  ];
  for (const a of alimenti) {
    await db.runAsync(`
      INSERT INTO alimenti (nome, kcal, proteine, carbo, grassi, categoria)
      VALUES (?, ?, ?, ?, ?, ?)
    `, a.nome, a.kcal, a.proteine, a.carbo, a.grassi, a.categoria);
  }
};