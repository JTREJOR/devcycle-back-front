import { Module } from "@nestjs/common";
import { FlowsModule } from "./flows/flows.module";
import { ProjectsModule } from "./projects/projects.module";
import { UsersModule } from "./users/users.module";
import { AssistantModule } from "./assistant/assistant.module";

@Module({
  imports: [FlowsModule, ProjectsModule, UsersModule, AssistantModule],
})
export class AppModule {}
