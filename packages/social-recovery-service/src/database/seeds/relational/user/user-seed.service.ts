import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    configService = new ConfigService();
  }

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const ADMIN_PASSWORD: string = this.configService.get<string>('ADMIN_PASSWORD') || 'secret';
      const password = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: this.configService.get<string>('ADMIN_EMAIL'),
          password,
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    // const countUser = await this.repository.count({
    //   where: {
    //     role: {
    //       id: RoleEnum.user,
    //     },
    //   },
    // });

    // if (!countUser) {
    //   const salt = await bcrypt.genSalt();
    //   const password = await bcrypt.hash('secret', salt);

    //   await this.repository.save(
    //     this.repository.create({
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       email: 'john.doe@example.com',
    //       password,
    //       role: {
    //         id: RoleEnum.user,
    //         name: 'User',
    //       },
    //       status: {
    //         id: StatusEnum.active,
    //         name: 'Active',
    //       },
    //     }),
    //   );
    // }
  }
}
