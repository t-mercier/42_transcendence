/**
 * .controller handles request in NestJS.
 * This file contains the AuthController for a NestJS application.
 * Handles HTTP requests related to user authentication.
 *
 *? Controller Setup:
 * The controller is marked with the '@Controller' decorator, defining it as a NestJS controller with a base route.
 * The AuthService is injected into the controller to handle authentication logic.
 *
 *? Routes:
 *  // @Get('42')
 *      Route for initiating the 42 OAuth authentication process.
 *  // @Get('42/callback')
 *      Callback route for 42 OAuth authentication, handling the user data after
 *      successful authentication and setting an HTTP-only cookie with the access token.
 *
 *? Authentication Guard:
 * Utilizes NestJS's '@UseGuards' with an 'AuthGuard' to protect the routes and manage the authentication flow.
 */

import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async signInWith42() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { accessToken, login, image } = req.user;
    const profilePic = image?.versions?.small; //*url profil pic small size
    /**
     *  accessToken et login sont directement extraits de req.user.
     * Pour la photo de profil, image est également extrait,
     * et ensuite profilePicUrl est défini en utilisant
     * les propriétés imbriquées versions et small.
     */

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.redirect('http://localhost:5173/login');
  }
}
