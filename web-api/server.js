const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const mysql = require('mysql2');
const moment = require('moment');
const excelJS = require("exceljs");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'u364870520_kbankDb',
});

const bodyParser = require('body-parser');
const e = require('express');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Project API is working!');
});

app.post('/api/register', cors(), function (req, res) {
  try {
    connection.query(
      'SELECT id_user FROM `user` ORDER BY id_user DESC LIMIT 1;',
      function (_, results, _) {
        const id_user =
          results.length > 0 ? results[0].id_user + 1 : 1;
        const date = moment(new Date()).format('YYYY-MM-DD');
        connection.query(
          'INSERT INTO `user` (id_user,phone_number, `date`) VALUES(?, ?, NOW());',
          [id_user, req.body.phone_number, date],
          function (error, _, _) {
            if (error) {
              res.status(500).json({ message: 'Internal server error', error });
              return;
            }

            connection.query(
              'SELECT code FROM qr_code WHERE id_qrcode = ?;',
              [id_user],
              function (error, results, _) {
                if (error) {
                  res.status(500).json({ message: 'Internal server error', error });
                  return;
                }

                if (results.length === 0) {
                  res.status(500).json({ message: 'Internal server error' });
                  return;
                }

                res.status(200).json({ qrCode: results[0].code });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500, error);
    return;
  }
});

app.get('/api/check-phone', cors(), function (req, res) {
  const phone_number = req.query.phone_number;
  connection.query(
    'SELECT * FROM `user` WHERE phone_number = ? ORDER BY `date`  DESC LIMIT 1;',
    [phone_number],
    function (err, results) {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (results.length === 0) {
        res.json(
          {
            is_registered: false,
          }
        );
        return;
      }

      const registeredDate = moment(results[0].date).format('YYYY-MM-DD');
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      const isRegisteredToday = registeredDate === currentDate;

      if (isRegisteredToday) {
        res.json(
          {
            is_registered: true,
          }
        );
        return;
      }

      res.json(
        {
          is_registered: false,
        }
      );
    }
  );
})

app.get('/api/export', cors(), function (req, res) {
  try {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('User');
    worksheet.columns = [
      { header: 'Phone Number', key: 'phone_number', width: 32 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'QR Code', key: 'code', width: 32 },
    ];

    connection.query(
      'SELECT u.phone_number, qc.code,  DATE_FORMAT(u.`date`, \'%d/%m/%Y\') AS  `date`  FROM `user` u inner join qr_code qc on u.id_user = qc.id_qrcode WHERE u.`date` >= ? and u.`date` <= ?;',
      [startDate, endDate],
      function (err, results) {
        if (err) {
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        results.forEach((result) => {
          worksheet.addRow(result);
        });

        res.status(200);
        res.setHeader('Content-Type', 'text/xlsx');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=exportUserUseQrCode.xlsx'
        );
        workbook.xlsx.write(res).then(function () {
          res.end();
        });
      }
    );

  } catch (error) {
    res.status(500, error);
    return;
  }
});



app.listen(port, () => {
  console.log('Starting node.js at port ' + port);
});