const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

class clsDB {

    constructor(ID, TableName = "users") {
        this.ID = String(ID);
        this.TableName = TableName;
        
    }

    async DeleteEntityByID(EntityID) {
        const Query = `DELETE FROM ${this.TableName} WHERE ID = ${EntityID}`;
        db.run(Query, [], ()=>{return});
    }

    async GetAllEntities() {
        return new Promise((resolve, reject) => {
            const Query = `SELECT * FROM ${this.TableName}`;
            db.all(Query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async GetEntity(ColumnToSearch) {
        const Query = `SELECT * FROM ${this.TableName} WHERE ${ColumnToSearch} = ?`;
        return new Promise((resolve, reject) => {
            db.get(Query, [this.ID], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async GetQuery(Query)
    {
        return new Promise((resolve, reject) => {
            db.get(Query,[], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async _InsertEntity(ArrayOfColumns, ArrayOfInsertedValues) {
        const Query = `INSERT INTO ${this.TableName}(${ArrayOfColumns.toString()}) VALUES (${ArrayOfInsertedValues.toString()})`;
        // return db.run(Query, [], async (e, r) =>{if(e) return false; return true});
        return new Promise((resolve) => {
            db.run(Query, [], async (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async AddUser()
    {
        this._InsertEntity(["UserID"], [`${this.ID}`])
    }

    async UpdateEntity(ColumnName, NewValue) {
        const Query = `UPDATE ${this.TableName} SET ${ColumnName} = '${NewValue}' WHERE UserID = ${this.ID}`;
        db.run(Query, [], () => {return;});
    }

    async AddNewColumn(ColumnName, ColumnType = "TEXT") {
        const query = `ALTER TABLE ${this.TableName} ADD COLUMN ${ColumnName} ${ColumnType}`;
        db.run(query);
    }

    async PrintAllDatabaseData() {
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
            tables.forEach(table => {
                db.all(`SELECT * FROM ${table.name}`, [], (err, rows) => {
                    console.log(table.name);
                    rows.forEach(row => {
                        console.log(row);
                    });
                    console.log("\n");
                });
            });
        });
    }
}

module.exports = clsDB;
