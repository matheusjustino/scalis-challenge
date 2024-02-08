import type { NextApiRequest, NextApiResponse } from 'next';
import { genSalt, hash } from 'bcryptjs';

// LIBS
import prisma from '@/lib/prisma';

export interface IRegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const { password, ...body } = (await req.json()) as IRegisterUser;

    console.log(req.body);

    const emailAlreadyUsed = await prisma.user.findFirst({
        where: {
            email: body.email,
        },
    });
    if (emailAlreadyUsed) {
        return new Response('Email already used', { status: 400 });
    }

    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);
    await prisma.user.create({
        data: {
            ...body,
            password: hashedPassword,
        },
    });

    return new Response();
}
