import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FriendService } from './friend.service';
import { Friend } from './friend.entity';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: any): Promise<User | null> {
    return await this.userService.findOne(req.user.login);
  }

  @Get(':login')
  @UseGuards(JwtAuthGuard)
  async findUser(
    @Req() request: Request & any,
    @Param('login') login: string,
  ): Promise<User | null> {
    const user = await this.userService.findOne(login);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':login')
  async updateUser(
    @Param('login') login: string,
    @Body() updateUserDto: UserDto,
    @Req() request: Request & any,
  ): Promise<User> {
    const user = request.user;
    if (user.login !== login) {
      throw new UnauthorizedException();
    }
    return await this.userService.update(login, updateUserDto);
  }

  @Post(':login/friend/:friend')
  async toggleFriend(
    @Param('login') login: string,
    @Param('friend') friendId: string,
  ): Promise<any> {
    if (await this.friendService.isFriend(login, friendId)) {
      this.friendService.removeFriend(login, friendId);
      return { message: 'Friend removed successfully' };
    } else {
      this.friendService.addFriend(login, friendId);
      return { message: 'Friend added successfully' };
    }
  }

  @Get(':login/friends')
  @UseGuards(JwtAuthGuard)
  async listAllFriends(@Param('login') login: string): Promise<User[]> {
    return this.friendService.getFriends(login);
  }

  @Patch(':login/image')
  async updateImage(
    @Param('login') login: string,
    @Body() body: { picture: string },
  ): Promise<User> {
    return this.userService.updateImage(login, body.picture);
  }
}
