import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Enrollment, EnrollmentSchema } from '../enrollments/schemas/enrollment.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Classroom.name, schema: ClassroomSchema },
    { name: Enrollment.name, schema: EnrollmentSchema },
    { name: Course.name, schema: CourseSchema },
  ])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
})
export class ClassroomsModule { }
