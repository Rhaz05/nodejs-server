const mysql = require("mysql");
require("dotenv").config();
const crypt = require("./cryptography");
const { logEvents } = require("../middleware/logger");

console.log(process.env._PASSWORD);
let password = "";
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
  if (err) throw err;

  password = result;
  console.log(`${result}`);
});

const connection = mysql.createConnection({
  host: process.env._HOST,
  user: process.env._USER,
  password: password,
  database: process.env._DATABASE,
});

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      logEvents(
        `${err.errno}\t${err.code}\t${err.sqlState}\t${err.fatal}`,
        "mongoErrLog.log"
      );
      console.error("Error connection to MYSQL databases: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};

exports.InsertMultiple = async (stmt, todos) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row inserted: ${results.affectedRows}`);

      return 1;
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Select = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);

        return callback(error, null);
      }
      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.SelectParameter = (sql, condition, callback) => {
  connection.query(sql, [condition], (error, results, fields) => {
    if (error) {
      return callback(error, null);
    }
    // console.log(results);

    callback(null, results);
  });
};

exports.StoredProcedure = (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.StoredProcedureResult = (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.Update = async (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log("Rows affected:", results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.CloseConnect = () => {
  connection.end();
};

exports.Insert = (stmt, todos, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        callback(err, null);
      }
      // callback(null, Row inserted: ${results});
      let data = [
        {
          rows: results.affectedRows,
          id: results.insertId,
        },
      ];
      callback(null, data);
      // console.log(Row inserted: ${results.affectedRows});
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.SelectResult = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.InsertTable = (sql, data, callback) => {
  this.Insert(sql, data, (err, result) => {
    if (err) {
      callback(err, null);
    }
    callback(null, result);
  });
};

exports.SelectStatement = (str, data) => {
  let statement = "";
  let found = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "?") {
      statement += `'${data[found]}'`;
      found += 1;
    } else {
      statement += str[i];
    }
  }
  return statement;
};
