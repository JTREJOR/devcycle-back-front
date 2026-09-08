import { Injectable, NotFoundException } from "@nestjs/common";
import { stages, Stage } from "@devcycle/shared";

@Injectable()
export class FlowsService {
  findAll(): Stage[] {
    return stages;
  }

  findOne(id: string): Stage {
    const stage = stages.find((s) => s.id === id);
    if (!stage) {
      throw new NotFoundException(`Etapa '${id}' no encontrada`);
    }
    return stage;
  }
}
