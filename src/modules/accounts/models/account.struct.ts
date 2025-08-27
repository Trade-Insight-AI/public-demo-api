export interface IAccountModel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  email: string;
  password: string;

  accessToken?: string;
  refreshToken?: string;
}
