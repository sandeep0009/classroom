import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, JSX } from 'react';

interface Session {
  user: {
    role: 'principal' | 'teacher' | 'student';
  };
}

export function withAuth<P extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<P>) {
  const AuthWrapper = (props: P) => {
    const { data: session, status } = useSession();
    const router=useRouter()

    useEffect(() => {
      if (status === 'loading') return;

      if (session) {
        switch (session.user.role) {
          case 'principal':
            router.replace('/principal');
            break;
          case 'teacher':
            router.replace('/teachers');
            break;
          case 'student':
            router.replace('/students');
            break;
          default:
            router.replace('/');
        }
      }
    }, [session, status, router]);

    if (status === 'loading' || session) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
}
