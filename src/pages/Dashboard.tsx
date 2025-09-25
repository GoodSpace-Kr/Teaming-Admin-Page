import { UsersIcon, UserGroupIcon, ChartBarIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import type { DashboardStats } from '../types/index';
import { apiGet, API_ENDPOINTS } from '../utils/api';

const mockStats: DashboardStats = {
  totalUsers: 1247,
  totalTeams: 89,
  activeUsers: 892,
  newUsersThisMonth: 156,
};

const stats = [
  {
    name: '총 사용자',
    value: mockStats.totalUsers.toLocaleString(),
    icon: UsersIcon,
    change: '+12%',
    changeType: 'positive' as const,
  },
  {
    name: '총 팀',
    value: mockStats.totalTeams.toLocaleString(),
    icon: UserGroupIcon,
    change: '+8%',
    changeType: 'positive' as const,
  },
  {
    name: '활성 사용자',
    value: mockStats.activeUsers.toLocaleString(),
    icon: ChartBarIcon,
    change: '+15%',
    changeType: 'positive' as const,
  },
  {
    name: '이번 달 신규 사용자',
    value: mockStats.newUsersThisMonth.toLocaleString(),
    icon: ArrowUpIcon,
    change: '+23%',
    changeType: 'positive' as const,
  },
];

export default function Dashboard() {
  // 실제 API 호출 예시 (현재는 mock 데이터 사용)
  // const [stats, setStats] = useState<DashboardStats | null>(null);
  // const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const data = await apiGet(API_ENDPOINTS.STATS_DASHBOARD);
  //       setStats(data);
  //     } catch (error) {
  //       console.error('Failed to fetch dashboard stats:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStats();
  // }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">Teaming 서비스 현황을 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">지난 달 대비</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900">새로운 사용자 5명이 가입했습니다.</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900">새로운 팀 "개발팀"이 생성되었습니다.</p>
                <p className="text-xs text-gray-500">4시간 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900">시스템 업데이트가 완료되었습니다.</p>
                <p className="text-xs text-gray-500">1일 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
