"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Connected to Tasker server');
});
(0, db_1.default)();
app.listen(config_1.PORT, () => {
    try {
        console.log(`Connected to ${config_1.PORT}`);
    }
    catch (err) {
        console.log('Error in connection with server');
    }
});
app.use('/api/', routes_1.default);
