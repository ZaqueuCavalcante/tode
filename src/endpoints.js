const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/syki-db')
const Todos = sequelize.define(
    'Todo',
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    }
);

(async () => {
    await sequelize.sync({ force: true });
})();

module.exports = function (app) {
    app.post('/todos', async (req, res) => {
        await Todos.create({ title: req.body.title });

        return res.status(201).send();
    });

    app.get('/todos', async (req, res) => {
        const x = await Todos.findAll();
        return res.status(200).send(x);
    });

    app.get('/todos/:id', async (req, res) => {
        const todo = await Todos.findByPk(req.params.id);
        return todo ? res.status(200).send(todo) : res.status(404).send();
    });

    app.put('/todos/:id', async (req, res) => {
        const todo = await Todos.findByPk(req.params.id);
        if (todo == null) {
            return res.status(404).send();
        }

        await User.update(
            { title: req.body.title },
            {
                where: {
                    id: todo.id,
                },
            },
        );

        return res.status(200).send();
    });

    app.delete('/todos/:id', async (req, res) => {
        const todo = await Todos.findByPk(req.params.id);
        if (todo == null) {
            return res.status(404).send();
        }

        await User.destroy(
            {
                where: {
                    id: todo.id,
                },
            },
        );

        return res.status(200).send();
    });
};
