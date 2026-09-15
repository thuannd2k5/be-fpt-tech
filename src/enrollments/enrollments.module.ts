import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Enrollment.name, schema: EnrollmentSchema },
    { name: Classroom.name, schema: ClassroomSchema }
  ])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule { }
