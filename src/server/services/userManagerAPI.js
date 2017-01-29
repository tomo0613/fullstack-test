const express = require('express');
const bodyParser = require('body-parser');
const userManager = require('./userManagerClass');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3100))

router.get('/', (req, res) => {
    // res.json({message: 'hooray! welcome to our api!'});
    res.send('userManagerAPI is running');
});

app.use('/api', router);

app.listen(app.get('port'), () => {
    console.log(`listening on *: ${app.get('port')}`);
});

var dummyUser = {
    name: 'usr4',
    password: 'pw',
    email: 'usr@mail4'
};

/* TODO
add -> POST
delete -> DELETE
update -> PUT
get -> GET
*/

// userManager.addUser(dummyUser).then(result => {
//     console.log(`userManager response: \n`, result);
// }).catch(error => console.error(error));
