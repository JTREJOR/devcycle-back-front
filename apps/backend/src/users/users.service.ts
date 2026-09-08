import { Injectable } from "@nestjs/common";
import { roles, users, Role, User } from "@devcycle/shared";

@Injectable()
export class UsersService {
  findAllRoles(): Role[] {
    return roles;
  }

  findAllUsers(): User[] {
    return users;
  }

  findUsersByRole(roleId: string): User[] {
    return users.filter((u) => u.roleId === roleId);
  }
}
