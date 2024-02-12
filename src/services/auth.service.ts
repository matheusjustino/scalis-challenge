import { User } from '@prisma/client';

// INTERFACES
import { IRegisterUser } from '@/interfaces/register-user.interface';

// LIBS
import { api } from '@/lib/axios';

export const register = async (data: IRegisterUser) =>
    await api.post<User>(`/users/register`, data).then((res) => res.data);
