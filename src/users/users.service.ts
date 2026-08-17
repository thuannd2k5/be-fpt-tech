import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from "bcryptjs";
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await this.hashPassword(createUserDto.password);
    const result = await this.userModel.create({ ...createUserDto, password: hashPassword });
    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user"
    }
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  async isValidPassword(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);
    return result;
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      return "not found user"
    }
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user"
    }
    return await this.userModel.deleteOne({ _id: id });
  }
}
