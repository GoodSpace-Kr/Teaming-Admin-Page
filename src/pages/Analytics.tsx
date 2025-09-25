import { ChartBarIcon, UsersIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const analyticsData = {
  userGrowth: [
    { month: '1월', users: 100 },
    { month: '2월', users: 150 },
    { month: '3월', users: 200 },
    { month: '4월', users: 280 },
    { month: '5월', users: 350 },
    { month: '6월', users: 420 },
    { month: '7월', users: 500 },
    { month: '8월', users: 580 },
    { month: '9월', users: 650 },
  ],
  teamStats: [
    { name: '활성 팀', value: 45, color: 'bg-blue-500' },
    { name: '비활성 팀', value: 12, color: 'bg-gray-400' },
    { name: '신규 팀', value: 8, color: 'bg-green-500' },
  ],
  recentActivity: [
    { type: 'user_signup', message: '새로운 사용자 가입', count: 15, time: '오늘' },
    { type: 'team_created', message: '새로운 팀 생성', count: 3, time: '오늘' },
    { type: 'user_login', message: '사용자 로그인', count: 89, time: '오늘' },
  ],
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">통계 및 분석</h1>
        <p className="text-gray-600">서비스 사용 현황과 트렌드를 확인하세요.</p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">총 사용자</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">총 팀</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">평균 세션 시간</p>
              <p className="text-2xl font-bold text-gray-900">24분</p>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 증가 차트 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">사용자 증가 추이</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.userGrowth.map((data, index) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600">{data.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.users / 650) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm font-medium text-gray-900">{data.users}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 팀 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">팀 현황</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.teamStats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <span className="text-sm text-gray-600">{stat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span className="text-sm font-bold text-primary-600">{activity.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

