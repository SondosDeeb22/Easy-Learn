// ==================================================================
//? Import 
// ==================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import bcrypt from 'bcryptjs';

// service
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

//dto 
import { LoginCredDto } from './dtos/login-cred.dto';

//enum
import { Roles } from '../users/enums/roles.enum';
import { NotFoundError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

// ==================================================================

//mock bcrypt globally for this file
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn().mockResolvedValue(true),
}))



// ==================================================================

describe('Auth Service', () => {

  let authService: AuthService;

  const mockUsersService = {
    findById: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  // =================================================
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  // -------------------------------------
  afterEach(() => {
    jest.clearAllMocks();
  });
  // ==================================================================

  // ===============================================
  //? login user
  // ===============================================
  describe("Login User", () => {
    it("should login user successfully", async () => {
      // prepare --- 
      // mocker fournduser from findById
      const mockFoundUser = {
        id: '1001',
        name: 'Sara',
        role: 'admin',
        birthDate: "1970-02-04T22:00:00.000Z",
        gender: 'female',
        email: 'sara@gmail.com',
        password: 'hashedPassword'
      };
      // ---------------------
      const mockCred: LoginCredDto = {
        id: "1001",
        password: "123",
      }
      const mockServiceResult = {
        name: "Sara",
        id: "1001",
        email: "sara@gmail.com",
        role: Roles.ADMIN
      };
      mockUsersService.findById.mockResolvedValue({ data: mockFoundUser });

      // act ----
      const result = await authService.login(mockCred);

      // assert ----
      expect(result.data.data).toEqual(mockServiceResult);
      expect(mockUsersService.findById).toHaveBeenCalledWith("1001");
      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
    });

    // ------------------------------------------------

    it("should return Not Found Error when user not found", async () => {
      //prepare --
      const mockCred: LoginCredDto = {
        id: "1001",
        password: "123",
      };
      mockUsersService.findById.mockRejectedValue(new NotFoundError('this user is not registered'));


      // act -------- 
      await expect(authService.login(mockCred)).rejects.toThrow(NotFoundError);

      // assert ----
      expect(mockUsersService.findById).toHaveBeenCalledWith("1001");
      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);

    });
    // ------------------------------------------------

    it("should return Unauthorized exceptoin if error is invalid", async () => {
      //prepare --
      // mocker fournduser from findById
      const mockFoundUser = {
        id: '1001',
        name: 'Sara',
        role: 'admin',
        birthDate: "1970-02-04T22:00:00.000Z",
        gender: 'female',
        email: 'sara@gmail.com',
        password: 'hashedPassword'
      };

      const mockCred: LoginCredDto = {
        id: "1001",
        password: "-",
      };
      mockUsersService.findById.mockResolvedValue({ data: mockFoundUser });

      // mock invalid pasword comparison
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // act + assert 
      await expect(authService.login(mockCred)).rejects.toThrow(UnauthorizedException);

      // assert ----
      expect(mockUsersService.findById).toHaveBeenCalledWith("1001");
      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockCred.password, mockFoundUser.password);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);



    })
  });



});
