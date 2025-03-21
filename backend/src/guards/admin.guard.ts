import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('AdminGuard checking user:', user);

    // Check if user exists and has admin role
    const isAdmin = user && user.role === 'admin';
    console.log('Is admin?', isAdmin);

    return isAdmin;
  }
} 
