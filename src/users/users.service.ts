import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from "bcryptjs";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from './user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>) { }

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { username, password, role_id, email, phone, gender, address, birthday } = createUserDto;
    const hashPassword = await this.hashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} da ton tai tren he thong. Vui long su dung email khac!`);
    }
    let newUser = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      phone,
      gender,
      address,
      birthday,
      role_id,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return newUser;
  }

  async register(user: RegisterUserDto) {
    const { username, email, password, gender, address } = user;
    const hashPassword = await this.hashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} da ton tai tren he thong. Vui long su dung email khac!`);
    }
    let newRegister = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      gender,
      address,
      role: "USER"
    })
    return newRegister;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user"
    }
    return await this.userModel.findOne({ _id: id }).select('-password');
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  async isValidPassword(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);
    return result;
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id))
      return 'not found user'

    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'

    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return await this.userModel.delete({ _id: id });
  }
}
