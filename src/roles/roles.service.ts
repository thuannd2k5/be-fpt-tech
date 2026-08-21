import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  create(createRoleDto: CreateRoleDto, user: IUser) {
    return this.roleModel.create({ ...createRoleDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.roleModel.countDocuments(filter);
    const result = await this.roleModel.find(filter).skip((current - 1) * defaultLimit)
      .limit(defaultLimit).sort(sort as any).populate((population || ['permissions']) as any).exec();
    return { meta: { current, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found role';
    return this.roleModel.findOne({ _id: id }).populate('permissions');
  }

  update(updateRoleDto: UpdateRoleDto, user: IUser) {
    return this.roleModel.updateOne({ _id: updateRoleDto._id }, {
      ...updateRoleDto,
      updatedBy: { _id: user._id, email: user.email }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found role';
    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: { _id: user._id, email: user.email }
    });
    return this.roleModel.delete({ _id: id });
  }
}
