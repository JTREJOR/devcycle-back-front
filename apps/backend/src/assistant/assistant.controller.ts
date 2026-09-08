import { Body, Controller, Post } from "@nestjs/common";
import { AssistantService, ChatRequest } from "./assistant.service";

@Controller("assistant")
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post("chat")
  chat(@Body() body: ChatRequest) {
    return this.assistantService.reply(body);
  }
}
