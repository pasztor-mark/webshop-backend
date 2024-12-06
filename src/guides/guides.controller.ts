import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { $Enums } from '@prisma/client';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Post()
  create(@Body() createGuideDto: CreateGuideDto) {
    return this.guidesService.create(createGuideDto);
  }

  @Get()
  findAll() {
    return this.guidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(+id);
  }

  @Get('author/:authorId')
  findManyByAuthorId(@Param('authorId') authorId: string) {
    return this.guidesService.findManyByAuthorId(+authorId);
  }

  @Get('subject/:subject')
  findManyBySubject(@Param('subject') subject: string) {
    return this.guidesService.findManyBySubject(subject as $Enums.Subject);
  }

  @Get('level/:level')
  findManyByLevel(@Param('level') level: string) {
    return this.guidesService.findManyByLevel(level as $Enums.Level);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guidesService.update(+id, updateGuideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guidesService.remove(+id);
  }
}
