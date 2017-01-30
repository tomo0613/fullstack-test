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
            // console.log(`userManager response: \n`, result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    })
    .get((req, res) => {
        console.log('find * users');
        userManager.findUser().then(result => {
            res.json(result);
            // console.log(`userManager response: \n`, result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    });

router.route('/users/:user_id')
    .get((req, res) => {
        console.log('find user', req.params.user_id);
        userManager.findUser(req.params.user_id).then(result => {
            res.json(result);
            // console.log(`userManager response: \n`, result);
        }).catch(error => {
            res.send(error);
            console.error(error);
        });
    })
    .put((req, res) => {
        console.log('update user', req.params.user_id);

    })
    .delete((req, res) => {
        console.log('delete user', req.params.user_id);

    });

app.use('/api', router);

app.listen(app.get('port'), () => {
    console.log(`user-manager started on port: ${app.get('port')}`);
});

var dummyUser = {
    name: 'usr4',
    password: 'pw',
    email: 'usr@mail4'
};
 
// userManager.addUser(dummyUser).then(result => {
//     console.log(`userManager response: \n`, result);
// }).catch(error => console.error(error));
