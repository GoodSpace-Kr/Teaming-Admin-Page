import { useState } from 'react';
import type { Team } from '../types/index';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const mockTeams: Team[] = [
  {
    id: '1',
    name: '개발팀',
    description: '프로덕트 개발을 담당하는 팀입니다.',
    members: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-09-20',
  },
  {
    id: '2',
    name: '디자인팀',
    description: 'UI/UX 디자인을 담당하는 팀입니다.',
    members: [],
    createdAt: '2024-02-10',
    updatedAt: '2024-09-18',
  },
  {
    id: '3',
    name: '마케팅팀',
    description: '마케팅 및 홍보를 담당하는 팀입니다.',
    members: [],
    createdAt: '2024-03-05',
    updatedAt: '2024-09-15',
  },
];

export default function Teams() {
  const [teams] = useState<Team[]>(mockTeams);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">팀 관리</h1>
          <p className="text-gray-600">팀 목록을 확인하고 관리하세요.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>팀 생성</span>
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="팀 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 팀 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.members.length}명의 멤버</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{team.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>생성일: {new Date(team.createdAt).toLocaleDateString('ko-KR')}</span>
                <span>수정일: {new Date(team.updatedAt).toLocaleDateString('ko-KR')}</span>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <button className="text-primary-600 hover:text-primary-900 p-2">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 p-2">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-2">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
