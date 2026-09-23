import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { AddApprovalDto, AddFileDto, CreateProjectDto, PatchProjectDto } from "./dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(":id")
  patch(@Param("id") id: string, @Body() dto: PatchProjectDto) {
    return this.projectsService.patch(id, dto);
  }

  @Post(":id/files")
  addFile(@Param("id") id: string, @Body() dto: AddFileDto) {
    return this.projectsService.addFile(id, dto);
  }

  @Post(":id/approvals")
  addApproval(@Param("id") id: string, @Body() dto: AddApprovalDto) {
    return this.projectsService.addApproval(id, dto);
  }
}
