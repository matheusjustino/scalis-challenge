import NextAuth, { DefaultSession } from 'next-auth';

// INTERFACES
import { RequestUser } from '@/interfaces/request-user.interface';

declare module 'next-auth' {
    interface Session {
        user?: RequestUser & DefaultSession['user'];
    }
}
