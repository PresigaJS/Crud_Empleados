const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const sql = `
      SELECT n.*, e.nombres, e.apellidos 
      FROM nomina n 
      JOIN empleados e ON n.id_empleado = e.id_empleado
    `;
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('nomina/index', { nominas: results });
    });
  });

  router.get('/add', (req, res) => {
    const sql = 'SELECT * FROM empleados WHERE estado = 1';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('nomina/add', { empleados: results });
    });
  });

  router.post('/add', (req, res) => {
    const { id_empleado, salario_base, deduccion_salud, deduccion_pension, comisiones } = req.body;
    const salario_neto = salario_base - deduccion_salud - deduccion_pension + (comisiones || 0);
    const sql = `
      INSERT INTO nomina (id_empleado, salario_base, deduccion_salud, deduccion_pension, salario_neto, comisiones) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [id_empleado, salario_base, deduccion_salud, deduccion_pension, salario_neto, comisiones], (err, result) => {
      if (err) throw err;
      res.redirect('/nomina');
    });
  });

  router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sqlNomina = 'SELECT * FROM nomina WHERE id_nomina = ?';
    const sqlEmpleados = 'SELECT * FROM empleados WHERE estado = 1';

    db.query(sqlNomina, [id], (err, resultNomina) => {
      if (err) throw err;
      db.query(sqlEmpleados, (err, resultEmpleados) => {
        if (err) throw err;
        res.render('nomina/edit', { nomina: resultNomina[0], empleados: resultEmpleados });
      });
    });
  });

  router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { id_empleado, salario_base, deduccion_salud, deduccion_pension, comisiones } = req.body;
    const salario_neto = salario_base - deduccion_salud - deduccion_pension + (comisiones || 0);
    const sql = `
      UPDATE nomina 
      SET id_empleado = ?, salario_base = ?, deduccion_salud = ?, deduccion_pension = ?, salario_neto = ?, comisiones = ?
      WHERE id_nomina = ?
    `;
    db.query(sql, [id_empleado, salario_base, deduccion_salud, deduccion_pension, salario_neto, comisiones, id], (err, result) => {
      if (err) throw err;
      res.redirect('/nomina');
    });
  });

  router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM nomina WHERE id_nomina = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.redirect('/nomina');
    });
  });

  return router;
};
