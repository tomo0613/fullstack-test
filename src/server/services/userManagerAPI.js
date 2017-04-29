const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../.config').jwtSecret;
const requestAuthorization = require('../middlewares/requestAuthorization');
const userManager = require('./userManagerModule');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(requestAuthorization({roles: ['admin'], secret: jwtSecret}).filter({method: 'POST'}));

app.set('port', (process.env.PORT || 3100))

router.get('/', (req, res) => {
    res.send('userManagerAPI is running');
});

router.route('/users')
    .get((req, res) => {
        userManager.findUser().then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    })
    .post((req, res) => {
        userManager.addUser(req.body).then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    });

router.route('/users/:user_id')
    .get((req, res) => {
        userManager.findUser(req.params.user_id).then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    })
    .post((req, res) => {
        userManager.authenticateUser(req.body, req.params.user_id).then((result) => {
            if (typeof result !== 'string') {
                res.json({
                    data: jwt.sign(result.data, jwtSecret),
                    message: result.message
                });
            } else {
                res.send(result);
            }
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    })
    .put((req, res) => {
        userManager.updateUser(req.body, req.params.user_id).then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    })
    .delete((req, res) => {
        userManager.deleteUser(req.params.user_id).then((result) => {
            res.json(result);
        }).catch((error) => {
            res.send(error);
            console.error(error);
        });
    });

app.use('/api', router);

app.listen(app.get('port'), () => {
    console.log('user-manager started on port:' + app.get('port'));
});
