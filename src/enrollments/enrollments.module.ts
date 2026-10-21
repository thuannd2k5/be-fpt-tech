import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';
import { Classroom, ClassroomSchema } from '../classrooms/schemas/classroom.schema';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Enrollment.name, schema: EnrollmentSchema },
    { name: Classroom.name, schema: ClassroomSchema },
    { name: Invoice.name, schema: InvoiceSchema },
    { name: User.name, schema: UserSchema },
    { name: Role.name, schema: RoleSchema },
    { name: Course.name, schema: CourseSchema }
  ])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule { }
