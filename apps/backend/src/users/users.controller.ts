import { Controller, Get, Query } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("roles")
  findAllRoles() {
    return this.usersService.findAllRoles();
  }

  @Get("users")
  findAllUsers(@Query("roleId") roleId?: string) {
    if (roleId) {
      return this.usersService.findUsersByRole(roleId);
    }
    return this.usersService.findAllUsers();
  }
}
