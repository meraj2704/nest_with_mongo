import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, age, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      age,
      password: hashedPassword,
      role: 'user',
    });
    const createdUser = await newUser.save();
    return this.userModel
      .findById(createdUser._id)
      .select('_id name email age role')
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('_id name email age role').exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
