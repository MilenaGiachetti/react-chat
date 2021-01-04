// check duplicated mail or username
let sql =  
`SELECT username, email, is_admin 
FROM users 
WHERE username = ? OR email = ?`;
let sql =  
`SELECT username, email, is_admin 
FROM users 
WHERE username = ? OR email = ?`;
// check if it belongs to a diferent id (only if a id is sent, add  AND id != ?)
let sql =  
`SELECT username, email
FROM users 
WHERE (username = ? OR email = ?) AND id != ?`;


// add USER
let sql = `INSERT INTO users VALUES (:id, :username, :email, :password, :is_admin, :is_active, :created_at, updated_at)`;
let sql = `INSERT INTO users VALUES (:id, :username, :email, :password, :is_admin, :is_active, :created_at, :updated_at)`;


// GET USER by ID
let sql =  
`SELECT id, username, email, is_admin, is_active, created_at, updated_at  
FROM users 
WHERE id = ?`;
let sql =  
`SELECT username, email, is_admin, is_active
FROM users 
WHERE id = ?`;


// update user
let sql = 
`UPDATE users SET username = :username, email = :email, password = :password, is_admin = :is_admin, is_active = :is_active
WHERE id = :id`;

// delete usersS
let sql =  
`DELETE FROM users 
WHERE id = ?`;

// Check user credentials
let sql =  
`SELECT * FROM users 
WHERE (username = :username OR email = :email)`;

