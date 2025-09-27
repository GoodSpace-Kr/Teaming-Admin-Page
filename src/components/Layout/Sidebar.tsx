import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  UserGroupIcon, 
  CogIcon,
  ChartBarIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

const navigation = [
  { name: '대시보드', href: '/', icon: HomeIcon },
  { name: '사용자 관리', href: '/users', icon: UsersIcon },
  { name: '팀 관리', href: '/teams', icon: UserGroupIcon },
  { name: '기프티콘 관리', href: '/gifticon', icon: GiftIcon },
  { name: '통계', href: '/analytics', icon: ChartBarIcon },
  { name: '설정', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Teaming Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

