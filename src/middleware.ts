import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const { pathname } = request.nextUrl;

    const principalRoutes = ['/create-classroom', '/create-student', '/create-teacher', '/teacher-edit', '/student-edit'];
    if (principalRoutes.some(route => pathname.startsWith(route))) {
        if (token.role !== 'principal') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    const teacherRoutes = ['/create-timetable'];
    if (teacherRoutes.some(route => pathname.startsWith(route))) {
        if (token.role !== 'teacher' && token.role !== 'principal') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/create-classroom', '/create-student', '/create-teacher', '/teacher-edit', '/student-edit', '/create-timetable']
};