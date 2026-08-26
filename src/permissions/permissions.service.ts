import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { path, method } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ path, method });

    if (isExist) {
      throw new BadRequestException(`permission với path ${path} và method ${method} đã tồn tại`)
    }
    return await this.permissionModel.create({ ...createPermissionDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.permissionModel.countDocuments(filter);
    const result = await this.permissionModel.find(filter).skip((current - 1) * defaultLimit)
      .limit(defaultLimit).sort(sort as any).populate(population).exec();
    return { meta: { current, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found permission';
    return await this.permissionModel.findOne({ _id: id });
  }

  async update(updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updatePermissionDto._id)) return 'not found permission';
    return await this.permissionModel.updateOne({ _id: updatePermissionDto._id }, {
      ...updatePermissionDto,
      updatedBy: { _id: user._id, email: user.email }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found permission';
    await this.permissionModel.updateOne({ _id: id }, {
      deletedBy: { _id: user._id, email: user.email }
    });
    return await this.permissionModel.delete({ _id: id });
  }
}
