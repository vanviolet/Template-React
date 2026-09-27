import { FilterParams, PaginatedResponse } from '@/types/common';

export interface UserDTO {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  nik: string;
  gaji: number;
  role: 'admin' | 'manager' | 'staff' | 'user';
  status: 'active' | 'inactive';
  verified: boolean;
  createdAt: string;
}

export interface CreateUserDTO {
  nama: string;
  email: string;
  noHp: string;
  nik: string;
  gaji: number;
  role: 'admin' | 'manager' | 'staff' | 'user';
  status: 'active' | 'inactive';
  verified: boolean;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {}

export interface DashboardMetricsDTO {
  totalUser: number;
  activeUser: number;
  monthlyRevenue: number;
  systemHealth: number;
  userGrowthPercentage: number;
  revenueGrowthPercentage: number;
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning';
  }>;
}

const INITIAL_USERS: UserDTO[] = [
  {
    id: 'usr-101',
    nama: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    noHp: '081234567890',
    nik: '3171012345670001',
    gaji: 15500000,
    role: 'admin',
    status: 'active',
    verified: true,
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'usr-102',
    nama: 'Siti Rahmawati',
    email: 'siti.rahma@example.com',
    noHp: '081987654321',
    nik: '3171023456780002',
    gaji: 12000000,
    role: 'manager',
    status: 'active',
    verified: true,
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'usr-103',
    nama: 'Ahmad Prasetyo',
    email: 'ahmad.p@example.com',
    noHp: '085711223344',
    nik: '3171034567890003',
    gaji: 8500000,
    role: 'staff',
    status: 'active',
    verified: false,
    createdAt: '2026-02-10T11:20:00Z',
  },
  {
    id: 'usr-104',
    nama: 'Dewi Lestari',
    email: 'dewi.lestari@example.com',
    noHp: '082199887766',
    nik: '3171045678900004',
    gaji: 9200000,
    role: 'staff',
    status: 'inactive',
    verified: true,
    createdAt: '2026-02-22T14:45:00Z',
  },
  {
    id: 'usr-105',
    nama: 'Eko Wijaya',
    email: 'eko.wijaya@example.com',
    noHp: '081344556677',
    nik: '3171056789010005',
    gaji: 6500000,
    role: 'user',
    status: 'active',
    verified: false,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'usr-106',
    nama: 'Fitri Handayani',
    email: 'fitri.h@example.com',
    noHp: '087812341234',
    nik: '3171067890120006',
    gaji: 11000000,
    role: 'manager',
    status: 'active',
    verified: true,
    createdAt: '2026-03-05T16:10:00Z',
  },
  {
    id: 'usr-107',
    nama: 'Giri Utama',
    email: 'giri.u@example.com',
    noHp: '081566778899',
    nik: '3171078901230007',
    gaji: 7800000,
    role: 'user',
    status: 'inactive',
    verified: false,
    createdAt: '2026-03-12T09:05:00Z',
  },
  {
    id: 'usr-108',
    nama: 'Hendra Gunawan',
    email: 'hendra.g@example.com',
    noHp: '082233445566',
    nik: '3171089012340008',
    gaji: 14000000,
    role: 'admin',
    status: 'active',
    verified: true,
    createdAt: '2026-03-18T13:25:00Z',
  },
];

let mockUsersDB = [...INITIAL_USERS];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export class ApiClient {
  static async getUsers(params: FilterParams = {}): Promise<PaginatedResponse<UserDTO>> {
    await delay(350);

    const {
      search = '',
      role = 'all',
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10,
    } = params;

    let filtered = [...mockUsersDB];

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (u) =>
          u.nama.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.nik.includes(query) ||
          u.noHp.includes(query)
      );
    }

    if (role && role !== 'all') {
      filtered = filtered.filter((u) => u.role === role);
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((u) => u.status === status);
    }

    filtered.sort((a, b) => {
      const valA = a[sortBy as keyof UserDTO] ?? '';
      const valB = b[sortBy as keyof UserDTO] ?? '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  static async getUserById(id: string): Promise<UserDTO> {
    await delay(200);
    const user = mockUsersDB.find((u) => u.id === id);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }
    return { ...user };
  }

  static async createUser(data: CreateUserDTO): Promise<UserDTO> {
    await delay(400);

    // Validation check
    const existingEmail = mockUsersDB.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingEmail) {
      throw new Error('Email sudah terdaftar dalam sistem.');
    }

    const newUser: UserDTO = {
      ...data,
      id: `usr-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    mockUsersDB.unshift(newUser);
    return { ...newUser };
  }

  static async updateUser(id: string, data: UpdateUserDTO): Promise<UserDTO> {
    await delay(400);
    const index = mockUsersDB.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Pengguna tidak ditemukan untuk diperbarui');
    }

    mockUsersDB[index] = {
      ...mockUsersDB[index],
      ...data,
    };

    return { ...mockUsersDB[index] };
  }

  static async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    await delay(300);
    const index = mockUsersDB.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Pengguna tidak ditemukan');
    }

    mockUsersDB.splice(index, 1);
    return { success: true, message: 'Pengguna berhasil dihapus' };
  }

  static async getDashboardMetrics(): Promise<DashboardMetricsDTO> {
    await delay(300);
    const totalUser = mockUsersDB.length;
    const activeUser = mockUsersDB.filter((u) => u.status === 'active').length;

    return {
      totalUser,
      activeUser,
      monthlyRevenue: 184500000,
      systemHealth: 99.8,
      userGrowthPercentage: 14.2,
      revenueGrowthPercentage: 8.5,
      recentActivities: [
        {
          id: 'act-1',
          user: 'Budi Santoso',
          action: 'Memperbarui profil administrator',
          timestamp: '5 menit lalu',
          type: 'info',
        },
        {
          id: 'act-2',
          user: 'Siti Rahmawati',
          action: 'Menambahkan staf baru (Fitri Handayani)',
          timestamp: '12 menit lalu',
          type: 'success',
        },
        {
          id: 'act-3',
          user: 'Sistem Ops',
          action: 'Pencadangan otomatis database selesai',
          timestamp: '1 jam lalu',
          type: 'info',
        },
        {
          id: 'act-4',
          user: 'Eko Wijaya',
          action: 'Percobaan login dari lokasi baru',
          timestamp: '2 jam lalu',
          type: 'warning',
        },
      ],
    };
  }
}
