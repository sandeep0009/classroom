import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      role?: string;
      classroomId?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name:string;
    email: string;
    role?: string;
    classroomId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    role?: string;
    classroomId?: string;
  }
}