import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";

import { BadRequest } from "../errors/BadRequest";
import { UserService } from "../services/UserService";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";
import { Contacts } from '../models/Contacts';

@Authorized()
@JsonController("/contacts")
export class ContactsController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public async create(
        @CurrentUser({ required: true }) user: User,
        @Body() contacts: Contacts[]
    ): Promise<User | Error> {
        return this.userService.addContactList(contacts, user);
    }
}
