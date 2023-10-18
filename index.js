const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 3500;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname?.replaceAll(' ', '-'));
    },
});

const upload = multer({storage});

const usersList = [
    {
        id: '1',
        name: 'Malvinder Singh',
        email: 'malvinder@example.com',
        profilePic:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShC7CDrniEZDUN1pO49xLMm1qPd_zd3smFdug0d0mk-_ZoDP40Hj8L5wKimQVCOeDSsr8&usqp=CAU',
    },
    {
        id: '2',
        name: 'John Doe',
        email: 'johndoe@example.com',
        profilePic:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0YtOC-DWcKhaIbwJDRuAlgKJKugPwp5dfhKKgOJf_UDtKQdOeZq9CQEetxDF1jmntumU&usqp=CAU',
    },
    {
        id: '3',
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        profilePic:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb3Ghorto2A4X8WIVql4QWhKglZ-aILaz1yhll8Z0heuRnyKf2dunZEoBM47nl640wJJc&usqp=CAU',
    },
    {
        id: '4',
        name: 'Dummy User',
        email: 'dummy@example.com',
        profilePic:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa7dk4pYpCsGPoDzRZGiFbP5fqahoARTZyIHDYanvXdotw08fE4XoVyrHwF-FsOLImQsY&usqp=CAU',
    },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '../', 'public')));

app.use(
    cors({
        origin: '*',
        credentials: true,
    }),
);

app.get('/', (req, res) => {
    res.json({status: 'success', msg: 'success', data: {}});
});

app.get('/users', (req, res) => {
    res.json({status: 'success', data: usersList});
});

app.post('/users', (req, res) => {
    const {body} = req;
    usersList.push({...body});
    res.json({status: 'success', data: usersList});
});

app.put('/users', (req, res) => {
    const exList = [...usersList];
    const {id, name, email} = req?.body;
    const itemIndex = exList?.findIndex((item) => item?.id == id);
    if (itemIndex > -1) {
        exList[itemIndex] = {...exList[itemIndex], name, email};
    }
    res.json({status: 'success', data: exList});
});

app.delete('/users/:id', (req, res) => {
    const {id} = req?.params;
    const itemIndex = usersList?.findIndex((item) => item?.id == id);
    const updatedList = [...usersList];
    if (itemIndex > -1) {
        updatedList.splice(itemIndex, 1);
    }

    res.json({status: 'success', data: updatedList});
});

app.post('/upload', upload.single('attachment'), (req, res) => {
    const filePath = 'http://localhost:3500/uploads/' + req?.file?.filename;

    res.json({
        path: filePath,
        type: req?.file?.mimetype,
        file: req?.file,
    });
});

app.listen(port, () => {
    console.log(`SERVER started, listening to port: ${port}`);
});
