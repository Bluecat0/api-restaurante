require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| BANCO DE DADOS
|--------------------------------------------------------------------------
*/

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);

/*
|--------------------------------------------------------------------------
| MODELO USUÁRIO
|--------------------------------------------------------------------------
*/

const Usuario = sequelize.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

/*
|--------------------------------------------------------------------------
| MODELO RESERVA
|--------------------------------------------------------------------------
*/

const Reserva = sequelize.define("Reserva", {
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  horario: {
    type: DataTypes.STRING,
    allowNull: false
  },

  numeroPessoas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },

  observacao: {
    type: DataTypes.TEXT
  }
});

Usuario.hasMany(Reserva);
Reserva.belongsTo(Usuario);

/*
|--------------------------------------------------------------------------
| MIDDLEWARE JWT
|--------------------------------------------------------------------------
*/

function autenticar(req, res, next) {

  console.log("=== HEADERS ===");
  console.log(req.headers);

  const authHeader = req.headers.authorization;

  console.log("AUTH:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado"
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN:", token);

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    req.usuario = decoded;

    next();

  } catch (err) {

    console.log("JWT ERROR:", err);

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}

/*
|--------------------------------------------------------------------------
| CADASTRO
|--------------------------------------------------------------------------
*/

app.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    const existe = await Usuario.findOne({
      where: { email }
    });

    if (existe) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: hash
    });

    res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: "Email ou senha inválidos"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Email ou senha inválidos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      mensagem: "Login realizado",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| NOVA RESERVA
|--------------------------------------------------------------------------
*/

app.post("/reservas", autenticar, async (req, res) => {
  try {

    const {
      data,
      horario,
      numeroPessoas,
      email,
      telefone,
      observacao
    } = req.body;

    const reserva = await Reserva.create({
      data,
      horario,
      numeroPessoas,
      email,
      telefone,
      observacao,
      UsuarioId: req.usuario.id
    });

    res.status(201).json({
      mensagem: "Reserva criada",
      reserva
    });

  } catch (erro) {
    res.status(500).json({
      erro: erro.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| LISTAR RESERVAS DO USUÁRIO
|--------------------------------------------------------------------------
*/

app.get("/reservas", autenticar, async (req, res) => {

  const reservas = await Reserva.findAll({
    where: {
      UsuarioId: req.usuario.id
    },
    order: [
      ["data", "ASC"]
    ]
  });

  res.json(reservas);
});

/*
|--------------------------------------------------------------------------
| PERFIL
|--------------------------------------------------------------------------
*/

app.get("/perfil", autenticar, async (req, res) => {

  const usuario = await Usuario.findByPk(
    req.usuario.id,
    {
      attributes: ["id", "nome", "email"]
    }
  );

  res.json(usuario);
});

/*
|--------------------------------------------------------------------------
| INICIAR SERVIDOR
|--------------------------------------------------------------------------
*/

sequelize.sync()
.then(() => {

  app.listen(process.env.PORT, () => {
    console.log(
      `Servidor rodando na porta ${process.env.PORT}`
    );
  });

})
.catch(err => {
  console.log(err);
});



