import dotenv from 'dotenv';
import { createHmac } from "node:crypto";
import { DataSource, DatabaseType } from "typeorm"
import IDataSourceInfo from "./interfaces/IDataSourceInfo.js"
import { EmailList } from './models/EmailList.js';
import { SenderEmailList } from './models/SenderEmailList.js';
import { ProxyList } from './models/ProxyList.js';
import { sendMail } from './services/MailSenderService.js';

const _config = dotenv.config().parsed || {};
let dbInfo: IDataSourceInfo = {
    dbType: _config.DATABASE_TYPE,
    dbHost: _config.HOST,
    dbName: _config.DATABASE,
    dbUser: _config.USERNAME,
    dbPassword: _config.PASSWORD,
    dbPort: Number(_config.PORT)
}

const secretKey = _config.HASH_SECRET_KEY;

if (!dbInfo.dbType)
    console.log("Undefined database type (Use mysql or postgres)")

const AppDataSource = new DataSource({
    type: dbInfo.dbType as "mysql",
    host: dbInfo.dbHost,
    port: dbInfo.dbPort,
    username: dbInfo.dbUser,
    password: dbInfo.dbPassword,
    database: dbInfo.dbName,
    entities: [EmailList, SenderEmailList, ProxyList],
    synchronize: true,
})

let emailList: any[];
let senderEmailList: any[];
let proxyList: any[];
let hash:string

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        emailList = await AppDataSource.manager.findBy(EmailList, {
            senderEmailListId: undefined
        })

        senderEmailList = await AppDataSource.manager.find(SenderEmailList)

        proxyList = await AppDataSource.manager.find(ProxyList)
    
        emailList.forEach(async element => {
            let emailIndex = Math.floor(
                Math.random() * senderEmailList.length
            );
            if (!element.Hash) {
                hash = await createHmac('sha256', secretKey)
                .update(element.Email)
                .digest('hex');

                AppDataSource.createQueryBuilder()
                .update(EmailList)
                .set({
                    Hash: hash
                })
                .where("id = :id", { id: element.Id })
                .execute()
            }

            sendMail(senderEmailList[emailIndex].Email, senderEmailList[emailIndex].Password, element.Email, "Test" )
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })