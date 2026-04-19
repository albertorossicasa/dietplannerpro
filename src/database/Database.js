import * as SQLite from 'expo-sqlite';

let db = null;

export const openDatabase = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('dietplanner.db');
  await createTables();
  await checkAndInitDemo();
  return db;
};

const createTables = async () => {
  await db.execAsync(`
    -- PROFESSIONISTA
    CREATE TABLE IF NOT EXISTS professionista (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT, password_hash TEXT, nome TEXT, cognome TEXT,
      codice_fiscale TEXT, telefono TEXT, email TEXT, specializzazione TEXT,
      created_at TEXT
    );

    -- UTENTI MULTIPLI
    CREATE TABLE IF NOT EXISTS utenti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE, password_hash TEXT, ruolo TEXT,
      attivo INTEGER DEFAULT 1, ultimo_accesso TEXT
    );

    -- CLIENTI
    CREATE TABLE IF NOT EXISTS clienti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, cognome TEXT, codice_fiscale TEXT, data_nascita TEXT,
      sesso TEXT, altezza_cm INTEGER, peso_kg REAL, telefono TEXT,
      email TEXT, indirizzo TEXT, citta TEXT, patologia TEXT,
      foto_profilo TEXT, note TEXT, data_creazione TEXT
    );

    -- ALIMENTI
    CREATE TABLE IF NOT EXISTS alimenti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, kcal REAL, proteine REAL, carbo REAL, grassi REAL, categoria TEXT
    );

    -- DIETE
    CREATE TABLE IF NOT EXISTS diete (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, nome TEXT, creato_il TEXT,
      calorie_totali REAL DEFAULT 0, note_personalizzate TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- PASTI
    CREATE TABLE IF NOT EXISTS pasti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dieta_id INTEGER, giorno TEXT, pasto TEXT, descrizione TEXT,
      kcal REAL, proteine REAL, carbo REAL, grassi REAL,
      FOREIGN KEY(dieta_id) REFERENCES diete(id)
    );

    -- MONITORAGGIO PESO
    CREATE TABLE IF NOT EXISTS monitoraggio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, data TEXT, peso REAL, note TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- FOTO PROGRESSO
    CREATE TABLE IF NOT EXISTS foto_progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, data TEXT, percorso_immagine TEXT, note TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- FATTURE
    CREATE TABLE IF NOT EXISTS fatture (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT, cliente_id INTEGER, data TEXT, descrizione TEXT,
      importo REAL, pagato INTEGER DEFAULT 0,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- TRACKING ACQUA
    CREATE TABLE IF NOT EXISTS tracking_acqua (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, data TEXT, quantita_ml INTEGER, orario TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- REGOLE PATOLOGIE
    CREATE TABLE IF NOT EXISTS regole_patologie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patologia TEXT, alimento_sconsigliato TEXT
    );

    -- APPUNTAMENTI
    CREATE TABLE IF NOT EXISTS appuntamenti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, titolo TEXT, data TEXT, ora TEXT,
      descrizione TEXT, completato INTEGER DEFAULT 0,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- CONSENSI GDPR
    CREATE TABLE IF NOT EXISTS consensi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, tipo TEXT, accettato INTEGER DEFAULT 0,
      data_consenso TEXT, firma TEXT, versione TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- CHAT
    CREATE TABLE IF NOT EXISTS chat_messaggi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER, mittente TEXT, messaggio TEXT,
      timestamp TEXT, letto INTEGER DEFAULT 0,
      FOREIGN KEY(cliente_id) REFERENCES clienti(id)
    );

    -- BACKUP LOG
    CREATE TABLE IF NOT EXISTS backup_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_backup TEXT, percorso_file TEXT, esito TEXT
    );
  `);
  
  // Inserisci regole patologie default
  const regoleCount = await db.getAllAsync('SELECT COUNT(*) as count FROM regole_patologie');
  if (regoleCount[0].count === 0) {
    await db.execAsync(`
      INSERT INTO regole_patologie (patologia, alimento_sconsigliato) VALUES
      ('Celiachia', 'Pane di frumento'), ('Celiachia', 'Pasta di semola'),
      ('Ipercolesterolemia', 'Burro'), ('Ipercolesterolemia', 'Strutto'),
      ('Diabete tipo 2', 'Zucchero bianco'), ('Diabete tipo 2', 'Miele'),
      ('Ipertensione', 'Sale da cucina'),
      ('Intolleranza al lattosio', 'Latte vaccino'), ('Intolleranza al lattosio', 'Yogurt classico'),
      ('Gotta', 'Carne rossa'), ('Gotta', 'Birra')
    `);
  }
};

const checkAndInitDemo = async () => {
  const result = await db.getAllAsync('SELECT COUNT(*) as count FROM clienti');
  if (result[0].count === 0) await initDemoData();
};

const initDemoData = async () => {
  await db.runAsync(`
    INSERT INTO professionista (id, username, password_hash, nome, cognome, email, created_at)
    VALUES (1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mario', 'Bianchi', 'mario@nutrizionista.it', datetime('now'))
  `);
  
  await db.runAsync(`INSERT INTO utenti (username, password_hash, ruolo) VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin')`);
  
  await db.runAsync(`
    INSERT INTO clienti (nome, cognome, codice_fiscale, email, telefono, peso_kg, altezza_cm, data_nascita, sesso, patologia, data_creazione) VALUES
    ('Laura', 'Verdi', 'VRDLRA85B01H501U', 'laura@email.it', '3331111111', 65, 165, '15/03/1985', 'F', '', datetime('now')),
    ('Marco', 'Rossi', 'RSSMRC90C01H501U', 'marco@email.it', '3332222222', 80, 175, '20/07/1990', 'M', 'Ipercolesterolemia', datetime('now'))
  `);
  
  await db.runAsync(`
    INSERT INTO alimenti (nome, kcal, proteine, carbo, grassi, categoria) VALUES
    ('Pollo petto', 165, 31, 0, 3.6, 'Carne'),
    ('Merluzzo', 82, 18, 0, 0.7, 'Pesce'),
    ('Riso integrale', 111, 2.6, 23, 0.9, 'Cereali'),
    ('Broccoli', 34, 2.8, 6.6, 0.4, 'Verdura')
  `);
};

export const Database = {
  // PROFESSIONISTA
  getProfessionista: async () => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT * FROM professionista WHERE id = 1');
    return result.length ? result[0] : null;
  },
  saveProfessionista: async (data) => {
    const db = await openDatabase();
    const existing = await Database.getProfessionista();
    if (existing) {
      await db.runAsync(`UPDATE professionista SET nome=?, cognome=?, telefono=?, email=?, specializzazione=? WHERE id=1`,
        data.nome, data.cognome, data.telefono, data.email, data.specializzazione);
    } else {
      await db.runAsync(`INSERT INTO professionista (id, username, password_hash, nome, cognome, telefono, email, specializzazione, created_at)
        VALUES (1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', ?, ?, ?, ?, ?, datetime('now'))`,
        data.nome, data.cognome, data.telefono, data.email, data.specializzazione);
    }
  },
  verifyLogin: async (username, password) => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT * FROM utenti WHERE username = ? AND password_hash = ? AND attivo = 1', username, password);
    if (result.length) {
      await db.runAsync('UPDATE utenti SET ultimo_accesso = datetime("now") WHERE id = ?', result[0].id);
    }
    return result.length > 0;
  },
  
  // UTENTI MULTIPLI
  getUtenti: async () => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT id, username, ruolo, attivo, ultimo_accesso FROM utenti');
  },
  addUtente: async (username, passwordHash, ruolo) => {
    const db = await openDatabase();
    return await db.runAsync('INSERT INTO utenti (username, password_hash, ruolo) VALUES (?, ?, ?)', username, passwordHash, ruolo);
  },
  updateUtente: async (id, attivo, ruolo) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE utenti SET attivo = ?, ruolo = ? WHERE id = ?', attivo, ruolo, id);
  },
  deleteUtente: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM utenti WHERE id = ?', id);
  },

  // CLIENTI
  getClienti: async () => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM clienti ORDER BY cognome, nome');
  },
  getCliente: async (id) => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT * FROM clienti WHERE id = ?', id);
    return result.length ? result[0] : null;
  },
  addCliente: async (cliente) => {
    const db = await openDatabase();
    const result = await db.runAsync(`
      INSERT INTO clienti (nome, cognome, codice_fiscale, data_nascita, sesso, altezza_cm, peso_kg, telefono, email, indirizzo, citta, patologia, note, data_creazione)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, cliente.nome, cliente.cognome, cliente.codice_fiscale, cliente.data_nascita, cliente.sesso,
       cliente.altezza_cm, cliente.peso_kg, cliente.telefono, cliente.email, cliente.indirizzo,
       cliente.citta, cliente.patologia, cliente.note);
    return result.lastInsertRowId;
  },
  updateCliente: async (id, cliente) => {
    const db = await openDatabase();
    await db.runAsync(`
      UPDATE clienti SET nome=?, cognome=?, codice_fiscale=?, data_nascita=?, sesso=?, altezza_cm=?, peso_kg=?,
      telefono=?, email=?, indirizzo=?, citta=?, patologia=?, note=?
      WHERE id=?
    `, cliente.nome, cliente.cognome, cliente.codice_fiscale, cliente.data_nascita, cliente.sesso,
       cliente.altezza_cm, cliente.peso_kg, cliente.telefono, cliente.email, cliente.indirizzo,
       cliente.citta, cliente.patologia, cliente.note, id);
  },
  deleteCliente: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM clienti WHERE id = ?', id);
  },

  // FOTO PROFILO
  saveFotoProfilo: async (clienteId, percorso) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE clienti SET foto_profilo = ? WHERE id = ?', percorso, clienteId);
  },
  getFotoProfilo: async (clienteId) => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT foto_profilo FROM clienti WHERE id = ?', clienteId);
    return result.length ? result[0].foto_profilo : null;
  },

  // ALIMENTI
  getAlimenti: async (categoria = null) => {
    const db = await openDatabase();
    if (categoria && categoria !== 'Tutti') {
      return await db.getAllAsync('SELECT * FROM alimenti WHERE categoria = ? ORDER BY nome', categoria);
    }
    return await db.getAllAsync('SELECT * FROM alimenti ORDER BY nome');
  },
  addAlimento: async (alimento) => {
    const db = await openDatabase();
    const result = await db.runAsync(`
      INSERT INTO alimenti (nome, kcal, proteine, carbo, grassi, categoria)
      VALUES (?, ?, ?, ?, ?, ?)
    `, alimento.nome, alimento.kcal, alimento.proteine, alimento.carbo, alimento.grassi, alimento.categoria);
    return result.lastInsertRowId;
  },
  deleteAlimento: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM alimenti WHERE id = ?', id);
  },

  // DIETE
  getDieteByCliente: async (clienteId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM diete WHERE cliente_id = ? ORDER BY creato_il DESC', clienteId);
  },
  addDieta: async (clienteId, nome, note) => {
    const db = await openDatabase();
    const result = await db.runAsync(`
      INSERT INTO diete (cliente_id, nome, creato_il, note_personalizzate)
      VALUES (?, ?, datetime('now'), ?)
    `, clienteId, nome, note);
    return result.lastInsertRowId;
  },
  getPastiByDieta: async (dietaId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM pasti WHERE dieta_id = ? ORDER BY giorno, pasto', dietaId);
  },
  addPasto: async (pasto) => {
    const db = await openDatabase();
    const result = await db.runAsync(`
      INSERT INTO pasti (dieta_id, giorno, pasto, descrizione, kcal, proteine, carbo, grassi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, pasto.dieta_id, pasto.giorno, pasto.pasto, pasto.descrizione, pasto.kcal, pasto.proteine, pasto.carbo, pasto.grassi);
    return result.lastInsertRowId;
  },
  deletePasto: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM pasti WHERE id = ?', id);
  },

  // MONITORAGGIO PESO
  getMonitoraggio: async (clienteId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM monitoraggio WHERE cliente_id = ? ORDER BY data DESC', clienteId);
  },
  addMonitoraggio: async (mon) => {
    const db = await openDatabase();
    return await db.runAsync(`
      INSERT INTO monitoraggio (cliente_id, data, peso, note)
      VALUES (?, ?, ?, ?)
    `, mon.cliente_id, mon.data, mon.peso, mon.note);
  },
  deleteMonitoraggio: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM monitoraggio WHERE id = ?', id);
  },

  // FOTO PROGRESSO
  getFotoProgresso: async (clienteId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM foto_progresso WHERE cliente_id = ? ORDER BY data DESC', clienteId);
  },
  addFotoProgresso: async (clienteId, percorso, data, note) => {
    const db = await openDatabase();
    return await db.runAsync(`
      INSERT INTO foto_progresso (cliente_id, data, percorso_immagine, note)
      VALUES (?, ?, ?, ?)
    `, clienteId, data, percorso, note);
  },
  deleteFotoProgresso: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM foto_progresso WHERE id = ?', id);
  },

  // FATTURE
  getFatture: async (clienteId = null) => {
    const db = await openDatabase();
    if (clienteId) {
      return await db.getAllAsync('SELECT * FROM fatture WHERE cliente_id = ? ORDER BY data DESC', clienteId);
    }
    return await db.getAllAsync('SELECT * FROM fatture ORDER BY data DESC');
  },
  addFattura: async (fattura) => {
    const db = await openDatabase();
    return await db.runAsync(`
      INSERT INTO fatture (numero, cliente_id, data, descrizione, importo)
      VALUES (?, ?, ?, ?, ?)
    `, fattura.numero, fattura.cliente_id, fattura.data, fattura.descrizione, fattura.importo);
  },
  updateFatturaPagato: async (id, pagato) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE fatture SET pagato = ? WHERE id = ?', pagato, id);
  },
  deleteFattura: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM fatture WHERE id = ?', id);
  },

  // TRACKING ACQUA
  getTrackingAcqua: async (clienteId, data) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM tracking_acqua WHERE cliente_id = ? AND data = ? ORDER BY orario', clienteId, data);
  },
  addTrackingAcqua: async (clienteId, quantitaMl, data) => {
    const db = await openDatabase();
    const orario = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return await db.runAsync(`
      INSERT INTO tracking_acqua (cliente_id, data, quantita_ml, orario)
      VALUES (?, ?, ?, ?)
    `, clienteId, data, quantitaMl, orario);
  },
  deleteTrackingAcqua: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM tracking_acqua WHERE id = ?', id);
  },
  getTotaleAcquaGiornaliero: async (clienteId, data) => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT SUM(quantita_ml) as totale FROM tracking_acqua WHERE cliente_id = ? AND data = ?', clienteId, data);
    return result[0].totale || 0;
  },

  // REGOLE PATOLOGIE
  getAlimentiVietatiByPatologie: async (patologie) => {
    if (!patologie) return [];
    const db = await openDatabase();
    const patList = patologie.split(',').map(p => p.trim());
    let vietati = [];
    for (let pat of patList) {
      const rows = await db.getAllAsync('SELECT alimento_sconsigliato FROM regole_patologie WHERE patologia = ?', pat);
      vietati.push(...rows.map(r => r.alimento_sconsigliato));
    }
    return [...new Set(vietati)];
  },

  // APPUNTAMENTI
  getAppuntamenti: async (clienteId = null, data = null) => {
    const db = await openDatabase();
    if (clienteId && data) {
      return await db.getAllAsync('SELECT * FROM appuntamenti WHERE cliente_id = ? AND data = ? ORDER BY ora', clienteId, data);
    }
    if (clienteId) {
      return await db.getAllAsync('SELECT * FROM appuntamenti WHERE cliente_id = ? ORDER BY data DESC, ora', clienteId);
    }
    return await db.getAllAsync('SELECT * FROM appuntamenti ORDER BY data DESC, ora');
  },
  addAppuntamento: async (app) => {
    const db = await openDatabase();
    return await db.runAsync(`
      INSERT INTO appuntamenti (cliente_id, titolo, data, ora, descrizione)
      VALUES (?, ?, ?, ?, ?)
    `, app.cliente_id, app.titolo, app.data, app.ora, app.descrizione);
  },
  updateAppuntamentoCompletato: async (id, completato) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE appuntamenti SET completato = ? WHERE id = ?', completato, id);
  },
  deleteAppuntamento: async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM appuntamenti WHERE id = ?', id);
  },

  // CONSENSI GDPR
  getConsenso: async (clienteId) => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT * FROM consensi WHERE cliente_id = ? ORDER BY data_consenso DESC LIMIT 1', clienteId);
    return result.length ? result[0] : null;
  },
  setConsenso: async (clienteId, accettato, firma) => {
    const db = await openDatabase();
    await db.runAsync(`
      INSERT INTO consensi (cliente_id, tipo, accettato, data_consenso, firma, versione)
      VALUES (?, 'privacy', ?, datetime('now'), ?, '1.0')
    `, clienteId, accettato ? 1 : 0, firma);
  },

  // CHAT
  getChatMessaggi: async (clienteId) => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM chat_messaggi WHERE cliente_id = ? ORDER BY timestamp ASC', clienteId);
  },
  addMessaggio: async (clienteId, mittente, messaggio) => {
    const db = await openDatabase();
    return await db.runAsync(`
      INSERT INTO chat_messaggi (cliente_id, mittente, messaggio, timestamp, letto)
      VALUES (?, ?, ?, datetime('now'), ?)
    `, clienteId, mittente, messaggio, mittente === 'professionista' ? 1 : 0);
  },
  segnaLetto: async (clienteId) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE chat_messaggi SET letto = 1 WHERE cliente_id = ? AND mittente = "cliente"', clienteId);
  },

  // BACKUP
  backupDatabase: async () => {
    const db = await openDatabase();
    const backupDir = FileSystem.documentDirectory + 'backups/';
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    const backupPath = backupDir + `backup_${Date.now()}.db`;
    await FileSystem.copyAsync({ from: FileSystem.documentDirectory + 'SQLite/dietplanner.db', to: backupPath });
    await db.runAsync('INSERT INTO backup_log (data_backup, percorso_file, esito) VALUES (datetime("now"), ?, "successo")', backupPath);
    return backupPath;
  },
  getBackupLog: async () => {
    const db = await openDatabase();
    return await db.getAllAsync('SELECT * FROM backup_log ORDER BY data_backup DESC');
  }
};

export const DatabaseProvider = ({ children }) => children;