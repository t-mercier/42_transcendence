import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';
// user.service.ts

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateImage(login: string, base64Image: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ login });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.picture = base64Image;
    return this.usersRepository.save(user);
  }

  async update(login: string, updateUserDto: UserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.displayName) {
      user.displayName = updateUserDto.displayName;
    }
    if (updateUserDto.picture) {
      user.picture = updateUserDto.picture;
    }
    return await this.usersRepository.save(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async findOne(login: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ login });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async removeOne(id: number): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();
  }

  async deleteUser(login: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { login } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete({ login });
    return true;
  }

  async enableTwoFA(login: string, base32: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.twoFASecret = base32;
    user.isTwoFAEnabled = true;
    return this.usersRepository.save(user);
  }

  async disableTwoFA(login: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.twoFASecret = '';
    user.isTwoFAEnabled = false;
    return this.usersRepository.save(user);
  }

  async updateWinLossScore(
    loginWon: string,
    loginLost: string,
  ): Promise<boolean> {
    const userWon = await this.usersRepository.findOneBy({
      login: loginWon,
    });
    console.log(`Game ended. Player '${loginWon}' won from '${loginLost}'`);
    if (!userWon) {
      throw new NotFoundException('User not found');
    }
    userWon.won += 1;
    this.usersRepository.save(userWon);

    const userLost = await this.usersRepository.findOneBy({
      login: loginLost,
    });
    if (!userLost) {
      throw new NotFoundException('User not found');
    }
    userLost.lost += 1;
    this.usersRepository.save(userLost);
    return true;
  }
}
