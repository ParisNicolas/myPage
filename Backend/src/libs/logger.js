const {appendFile} = require("fs");
const path = require("path");
const dayjs = require('dayjs');

const { logPath } = require("../config");

const warningLogPath = path.join(logPath, '/warn.log');
const loggerPath = path.join(logPath, '/all.log');

class logger {
    static reset = '\x1b[0m';
    static black = '\x1b[30m';
    static red = '\x1b[31m';
    static green = '\x1b[32m';
    static yellow = '\x1b[33m';
    static blue = '\x1b[34m';
    static magenta = '\x1b[35m';
    static cyan = '\x1b[36m';
    static white = '\x1b[37m';

    static levelShow = 0; //from 0 (show all) to 7 (just errors)
    static type = 'STORAGE';

    static levels = {
        error:{
            prefix: '[x]',
            color: this.red,
            levelN: 7,
            isImportant: true
        },
        warn:{
            prefix: '[!]',
            color: this.yellow,
            levelN: 6,
            isImportant: true
        },
        auth:{
            prefix: '[auth]',
            color: this.cyan,
            levelN: 5,
            isImportant: true
        },
        created:{
            prefix: '[+]',
            color: this.green,
            levelN: 4,
            isImportant: false
        },
        removed:{
            prefix: '[-]',
            color: this.magenta,
            levelN: 3,
            isImportant: false
        },
        modified:{
            prefix: '[M]',
            color: this.blue,
            levelN: 2,
            isImportant: false
        },
        info:{
            prefix: '',
            color: this.white,
            levelN: 1,
            isImportant: false
        },
        debug:{
            prefix: '',
            color: this.black,
            levelN: 0,
            isImportant: false
        }
    }

    static log(level, message, data = {}){
        const {prefix, color, levelN, isImportant} = this.levels[level.toLowerCase()];

        if(this.levelShow <= levelN){
            const errFunc = (err) => err && console.error('Error al escribir en el archivo de registro:', err);
            const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

            //---Messages---//
            const messageConsole = `${color + prefix} ${message + this.reset}`;

            let messageFile;
            if(data.req){
                //DATE [STORAGE] [LEVEL] message [METHOD] [PATH] [ADRESS] --> error
                messageFile = `${currentDate} [${this.type}] [${level.toUpperCase()}]\t${message} [${data.req.method} ${data.req.originalUrl}]\t\t[${data.req.ip}]\n`;
            }else{
                //DATE [STORAGE] [LEVEL] message --> error
                messageFile = `${currentDate} [${this.type}] [${level.toUpperCase()}]\t${message}\n`;
            }
            
            //Console LOG
            console.log(messageConsole);
            if(data.err) console.log(data.err);
            
            //Files logs
            if(isImportant){
                appendFile(warningLogPath, '\n'+ messageFile + (data.err ? data.err+'\n':''), errFunc);
            }
            appendFile(loggerPath, messageFile, errFunc);
        }
    } 

    //Put enter between request
    static logEnter(){
        console.log();
        appendFile(loggerPath, '\n', errFunc);
    }

    //Static methods
    static error = (message, data) => this.log('error', message, data);
    static warn = (message, data) => this.log('warn', message, data);
    static auth = (message, data) => this.log('auth', message, data);
    static created = (message, data) => this.log('created', message, data);
    static removed = (message, data) => this.log('removed', message, data);
    static modified = (message, data) => this.log('modified', message, data);
    static info = (message, data) => this.log('info', message, data);
    static debug = (message, data) => this.log('debug', message, data);
}

module.exports = logger;