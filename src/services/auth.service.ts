import { RegisterFormType } from '@/app/(auth)/(routes)/sign-up/useSignUp';
import { api } from '@/lib/axios';

export const register = async (data: RegisterFormType) =>
    await api.post(`/users/register`, data).then((res) => res.data);
