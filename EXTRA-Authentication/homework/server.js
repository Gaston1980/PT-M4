const express = require('express');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');

const app = express();

const users = [
  {id: 1, name: 'Franco', email: 'Franco@mail.com', password: '1234'},
  {id: 2, name: 'Toni', email: 'Toni@mail.com', password: '1234'}
]

app.use(morgan('dev'));
app.use(cookieparser()); // parsea las cookies de json a objeto
app.use(express.urlencoded({ extended: true }));// parsea el body de un query string(html) a un objeto
app.use((req, res, next) => {  // nos permite visualizar si hay cookies
  console.log(req.cookies);
  next();
});
//Middlewares
const isAuthenticated = (req, res, next) => {
  // Si NO hay un usuario logueado redirigir a /login de lo contrario llamar a next()
  const {userId} = req.cookies;
  if(!userId) return res.redirect("/login");
  next()
}
const isNotAuthenticated = (req, res, next) => {
  // Si hay un usuario logueado redirigir a /home de lo contrario llamar a next()
  const {userId} = req.cookies;
  if(userId) return res.redirect("/home");
  next()
}

app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenidos a Henry!</h1>
    ${req.cookies.userId ? `
      <a href='/home'>Perfil</a>
      <form method='post' action='/logout'>
        <button>Salir</button>
      </form>
      ` : `
      <a href='/login'>Ingresar</a>
      <a href='/register'>Registrarse</a>
      `}
  `)
});

app.get('/register',isNotAuthenticated, (req, res) => {
  res.send(`
    <h1>Registrarse</h1>
    <form method='post' action='/register'>
      <input name='name' placeholder='Nombre' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Registrarse' />
    </form>
    <a href='/login'>Iniciar sesión</a>
  `)
});

app.get('/login',isNotAuthenticated,  (req, res) => {
  res.send(`
    <h1>Iniciar sesión</h1>
    <form method='post' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Ingresar' />
    </form>
    <a href='/register'>Registrarse</a>
  `)
});

app.post('/login', (req, res) => {
const {email, password} = req.body;
if(email && password) {
  const user = users.find(user => user.email === email && user.password === password);
  if(user) {
    res.cookie('userId', user.id)
    return res.redirect('/home')
} 
}
return res.redirect('/login')
})

app.get('/home',isAuthenticated, (req, res) => {
  const user = users.find( u => u.id.toString() === req.cookies.userId); // toString xq lo que viene por req es en string
  res.send(`
    <h1>Bienvenido ${user.name}</h1>
    <h4>${user.email}</h4>
    <a href='/'>Inicio</a>
  `)
})

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  if( name && email && password){
    const userexist = users.find(user => user.email === email);
  if(!userexist) {
    const newuser = {
      id: users.length + 1,
      name,
      email,
      password
    }
    users.push(newuser)
    return res.redirect('/');
  }
  }
  res.redirect('/register')
})

app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});



app.listen(3000, (err) => {
  if(err) {
   console.log(err);
 } else {
   console.log('Listening on localhost:3000');
 }
});
