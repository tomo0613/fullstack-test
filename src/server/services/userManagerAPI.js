const express = require('express');
const bodyParser = require('body-parser');
const userManager = require('./userManagerClass');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3100))

router.get('/', (req, res) => {
    res.send('userManagerAPI is running');
});

router.route('/users')
    .post((req, res) => {
        console.log('post user', req.body);
        userManager.addUser(req.body).then(result => {
            res.send(result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    })
    .get((req, res) => {
        userManager.findUser().then(result => {
            res.json(result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    });

router.route('/users/:user_id')
    .get((req, res) => {
        userManager.findUser(req.params.user_id).then(result => {
            res.json(result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    })
    .put((req, res) => {
        userManager.updateUser(req.body ,req.params.user_id).then(result => {
            console.log(`userManager update: \n`, result);
            res.send(result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    })
    .delete((req, res) => {
        userManager.deleteUser(req.params.user_id).then(result => {
            res.send(result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    });

app.use('/api', router);

app.listen(app.get('port'), () => {
    console.log(`user-manager running on port: ${app.get('port')}`);
});
