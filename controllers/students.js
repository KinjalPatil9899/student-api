var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DB_NAME
});

connection.connect(function(err){
    if(!err){
        console.log("database is connected");
    } else {
        console.log("error connecting database");
    }
});

// GET all Students
// const getAllStudents = (req, res) => {
//     connection.query('SELECT * FROM tbl_student', (error, results) => {
//         if(error) {
//             res.send(JSON.stringify({"status": 500,"flag": 0, "message": error.sqlMessage}));
//         } else {
//             if(results && results.length>0){
//               count = results.length;
//             //   console.log(results);
//               res.send(JSON.stringify({"status": 200,"flag": 1, "message": "students Fetch", "data": results}));
//             } else {
//               res.send(JSON.stringify({"status": 200,"flag": 0, "message": "No Recoreds Found"}));
//             }
//         }
//     });
// };

// GET all Students with Pagination
const getAllStudents = (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    // First get total count of records
    connection.query('SELECT COUNT(*) as total FROM tbl_student', (err, countResult) => {
        if (err) {
            return res.send(JSON.stringify({
                status: 500,
                flag: 0,
                message: err.sqlMessage
            }));
        }

        const total = countResult[0].total;

        // Then fetch paginated data
        connection.query(
            'SELECT * FROM tbl_student LIMIT ? OFFSET ?',
            [limit, offset],
            (error, results) => {
                if (error) {
                    res.send(JSON.stringify({
                        status: 500,
                        flag: 0,
                        message: error.sqlMessage
                    }));
                } else {
                    if (results && results.length > 0) {
                        res.send(JSON.stringify({
                            status: 200,
                            flag: 1,
                            message: "Students fetched successfully",
                            data: results,
                            meta: {
                                totalRecords: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit)
                            }
                        }));
                    } else {
                        res.send(JSON.stringify({
                            status: 200,
                            flag: 0,
                            message: "No Records Found",
                            data: [],
                            meta: {
                                totalRecords: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit)
                            }
                        }));
                    }
                }
            }
        );
    });
};

// GET Student by ID
const getStudentById = (req, res) => {
    const studentId = req.params.studentId;
    connection.query('SELECT * FROM tbl_student WHERE std_id = ?', [studentId], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": error.sqlMessage}));
        } else {
            // console.log(results);
            if(Object.keys(results).length !== 0){
              res.send(JSON.stringify({"status": 200,"flag": 1, "message": "student Fetch", "data": results}));
            } else {
              res.send(JSON.stringify({"status": 200,"flag": 0, "message": "student not found"}));
            }      
        }
    });
};
    
// POST new Student
const createStudent = (req, res) => {
    
    const { name, email, age } = req.body;
    connection.query('INSERT INTO tbl_student (std_name, std_email, std_age) VALUES (?, ?, ?)', [name, email, age], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": error.sqlMessage}));
        } else {
            res.send(JSON.stringify({"status": 200,"flag": 1, "message": "student Added", "data": { id: results.insertId, name, email, age }}));
        }
    });
};
    
// PUT Update Student
const updateStudent = (req, res) => {
    const studentId = req.params.studentId;
    const { name, email, age } = req.body;
    connection.query('SELECT * FROM tbl_student WHERE std_id = ?', [studentId], (error, results) => {

        if(error) {
            res.send(JSON.stringify({"status": 500,"flag": 0, "message": error.sqlMessage}));
        } else {
            console.log(results);
            if(Object.keys(results).length !== 0){
                connection.query('UPDATE tbl_student SET std_name = ?, std_email = ?, std_age = ? WHERE std_id = ?', [name, email, age, studentId], (err, results) => {
                    if(err) {
                        res.send(JSON.stringify({"status": 500,"flag": 0, "message": err.sqlMessage}));
                    } else {
                        res.send(JSON.stringify({"status": 200,"flag": 1, "message": "student Updated", "data": { id: studentId, name, email, age }}));
                    }
                });
            } else {
              res.send(JSON.stringify({"status": 200,"flag": 0, "message": "student not found"}));
            }      
        }
    });
};
    
// DELETE Student
const deleteStudent = (req, res) => {
    const studentId = req.params.studentId;
        connection.query('DELETE FROM tbl_student WHERE std_id = ?', [studentId], (error, results) => {
        if(error){
            res.status(500).send(JSON.stringify({"status": 500, "flag": 0, "message": "Error", "Data": error}));
        } else {
            if(results && results.affectedRows > 0){
                res.status(200).send(JSON.stringify({"status": 200, "flag": 1, "message": "student deleted", "affectedRows": results.affectedRows}));
            } else {
                res.status(200).send(JSON.stringify({"status": 200, "flag": 0, "message": "student not found"}));
            }
        }
    });
};
    
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};