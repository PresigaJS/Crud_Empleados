const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const sql = 'SELECT * FROM empleados';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('empleados/index', { empleados: results });
    });
  });

  router.get('/add', (req, res) => {
    res.render('empleados/add');
  });

  router.post('/add', (req, res) => {
    const { identificacion, nombres, apellidos, correo, direccion, telefono } = req.body;
    const fotografia = req.files.fotografia;
    const fotografiaPath = `/uploads/${fotografia.name}`;
    fotografia.mv(`./public/uploads/${fotografia.name}`, (err) => {
      if (err) throw err;
      const sql = `
        INSERT INTO empleados (identificacion, nombres, apellidos, correo, direccion, telefono, fotografia) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [identificacion, nombres, apellidos, correo, direccion, telefono, fotografiaPath], (err, result) => {
        if (err) throw err;
        res.redirect('/empleados');
      });
    });
  });

  router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM empleados WHERE id_empleado = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.render('empleados/edit', { empleado: result[0] });
    });
  });

  router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { identificacion, nombres, apellidos, correo, direccion, telefono } = req.body;
    const fotografia = req.files ? req.files.fotografia : null;
    let fotografiaPath = req.body.fotografia_anterior;

    if (fotografia) {
      fotografiaPath = `/uploads/${fotografia.name}`;
      fotografia.mv(`./public/uploads/${fotografia.name}`, (err) => {
        if (err) throw err;
      });
    }

    const sql = `
      UPDATE empleados 
      SET identificacion = ?, nombres = ?, apellidos = ?, correo = ?, direccion = ?, telefono = ?, fotografia = ?
      WHERE id_empleado = ?
    `;
    db.query(sql, [identificacion, nombres, apellidos, correo, direccion, telefono, fotografiaPath, id], (err, result) => {
      if (err) throw err;
      res.redirect('/empleados');
    });
  });

  router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM empleados WHERE id_empleado = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.redirect('/empleados');
    });
  });

  return router;
};
