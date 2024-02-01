const app = require('fastify')({ logger: true });
const { Pool } = require('pg');
const Client = require('pg/lib/client');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

app.get('/get', async (request, reply) => {
  try {
const result = await pool.query("SELECT * FROM users"); 
    // console.log(result); 
    reply.send(result.rows); 
  } catch (err) {
    console.log('Error:', err);
    reply.send('not');
  }
});

app.post('/user' , async (request, reply) => {
  try{
    const {name} = request.body
    const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', 
    [name])
    reply.send(result.rows[0])
  }
  catch(err){
    reply.send('error')
  }
})

app.put('/user/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const { name } = request.body;

    const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

    if (result.rows.length === 0) {
      reply.send("User not found");
    } else {
      reply.send(result.rows[0]);
    }
  } catch (err) {
    reply.send('Internal Server Error');
  }
});

app.delete('/user/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      reply.status(404).send({ message: 'User not found' });
    } else {
      reply.send({ message: 'User deleted successfully' });
    }
  } catch (err) {
    reply.send('Internal Server Error');
  }
});

app.listen({ port: 3000 }, () => {
  console.log(`Server is running on ${app.server.address().port}`)
})
