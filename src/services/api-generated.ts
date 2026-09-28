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
  kota?: string;
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
  kota?: string;
}

export interface IndonesianCityDTO {
  id: string;
  name: string;
  type: 'Kota' | 'Kabupaten';
  province: string;
}

export interface CityFilterParams {
  search?: string;
  province?: string;
  page?: number;
  pageSize?: number;
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

export const INDONESIAN_CITIES: IndonesianCityDTO[] = [
  // DKI Jakarta
  { id: 'city-1', name: 'Jakarta Pusat', type: 'Kota', province: 'DKI Jakarta' },
  { id: 'city-2', name: 'Jakarta Selatan', type: 'Kota', province: 'DKI Jakarta' },
  { id: 'city-3', name: 'Jakarta Barat', type: 'Kota', province: 'DKI Jakarta' },
  { id: 'city-4', name: 'Jakarta Timur', type: 'Kota', province: 'DKI Jakarta' },
  { id: 'city-5', name: 'Jakarta Utara', type: 'Kota', province: 'DKI Jakarta' },
  { id: 'city-6', name: 'Kepulauan Seribu', type: 'Kabupaten', province: 'DKI Jakarta' },

  // Jawa Barat
  { id: 'city-7', name: 'Bandung', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-8', name: 'Bogor', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-9', name: 'Bekasi', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-10', name: 'Depok', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-11', name: 'Cimahi', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-12', name: 'Cirebon', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-13', name: 'Sukabumi', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-14', name: 'Tasikmalaya', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-15', name: 'Banjar', type: 'Kota', province: 'Jawa Barat' },
  { id: 'city-16', name: 'Karawang', type: 'Kabupaten', province: 'Jawa Barat' },
  { id: 'city-17', name: 'Garut', type: 'Kabupaten', province: 'Jawa Barat' },
  { id: 'city-18', name: 'Subang', type: 'Kabupaten', province: 'Jawa Barat' },

  // Banten
  { id: 'city-19', name: 'Tangerang', type: 'Kota', province: 'Banten' },
  { id: 'city-20', name: 'Tangerang Selatan', type: 'Kota', province: 'Banten' },
  { id: 'city-21', name: 'Serang', type: 'Kota', province: 'Banten' },
  { id: 'city-22', name: 'Cilegon', type: 'Kota', province: 'Banten' },
  { id: 'city-23', name: 'Lebak', type: 'Kabupaten', province: 'Banten' },
  { id: 'city-24', name: 'Pandeglang', type: 'Kabupaten', province: 'Banten' },

  // Jawa Tengah
  { id: 'city-25', name: 'Semarang', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-26', name: 'Surakarta (Solo)', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-27', name: 'Magelang', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-28', name: 'Pekalongan', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-29', name: 'Salatiga', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-30', name: 'Tegal', type: 'Kota', province: 'Jawa Tengah' },
  { id: 'city-31', name: 'Banyumas (Purwokerto)', type: 'Kabupaten', province: 'Jawa Tengah' },
  { id: 'city-32', name: 'Kudus', type: 'Kabupaten', province: 'Jawa Tengah' },
  { id: 'city-33', name: 'Cilacap', type: 'Kabupaten', province: 'Jawa Tengah' },
  { id: 'city-34', name: 'Klaten', type: 'Kabupaten', province: 'Jawa Tengah' },

  // DI Yogyakarta
  { id: 'city-35', name: 'Yogyakarta', type: 'Kota', province: 'DI Yogyakarta' },
  { id: 'city-36', name: 'Sleman', type: 'Kabupaten', province: 'DI Yogyakarta' },
  { id: 'city-37', name: 'Bantul', type: 'Kabupaten', province: 'DI Yogyakarta' },
  { id: 'city-38', name: 'Kulon Progo', type: 'Kabupaten', province: 'DI Yogyakarta' },
  { id: 'city-39', name: 'Gunungkidul', type: 'Kabupaten', province: 'DI Yogyakarta' },

  // Jawa Timur
  { id: 'city-40', name: 'Surabaya', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-41', name: 'Malang', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-42', name: 'Kediri', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-43', name: 'Blitar', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-44', name: 'Madiun', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-45', name: 'Mojokerto', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-46', name: 'Pasuruan', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-47', name: 'Probolinggo', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-48', name: 'Batu', type: 'Kota', province: 'Jawa Timur' },
  { id: 'city-49', name: 'Sidoarjo', type: 'Kabupaten', province: 'Jawa Timur' },
  { id: 'city-50', name: 'Gresik', type: 'Kabupaten', province: 'Jawa Timur' },
  { id: 'city-51', name: 'Banyuwangi', type: 'Kabupaten', province: 'Jawa Timur' },
  { id: 'city-52', name: 'Jember', type: 'Kabupaten', province: 'Jawa Timur' },

  // Bali & Nusa Tenggara
  { id: 'city-53', name: 'Denpasar', type: 'Kota', province: 'Bali' },
  { id: 'city-54', name: 'Badung (Kuta)', type: 'Kabupaten', province: 'Bali' },
  { id: 'city-55', name: 'Gianyar (Ubud)', type: 'Kabupaten', province: 'Bali' },
  { id: 'city-56', name: 'Mataram', type: 'Kota', province: 'Nusa Tenggara Barat' },
  { id: 'city-57', name: 'Bima', type: 'Kota', province: 'Nusa Tenggara Barat' },
  { id: 'city-58', name: 'Kupang', type: 'Kota', province: 'Nusa Tenggara Timur' },
  { id: 'city-59', name: 'Manggarai Barat (Labuan Bajo)', type: 'Kabupaten', province: 'Nusa Tenggara Timur' },

  // Sumatera
  { id: 'city-60', name: 'Banda Aceh', type: 'Kota', province: 'Aceh' },
  { id: 'city-61', name: 'Sabang', type: 'Kota', province: 'Aceh' },
  { id: 'city-62', name: 'Medan', type: 'Kota', province: 'Sumatera Utara' },
  { id: 'city-63', name: 'Binjai', type: 'Kota', province: 'Sumatera Utara' },
  { id: 'city-64', name: 'Pematangsiantar', type: 'Kota', province: 'Sumatera Utara' },
  { id: 'city-65', name: 'Padang', type: 'Kota', province: 'Sumatera Barat' },
  { id: 'city-66', name: 'Bukittinggi', type: 'Kota', province: 'Sumatera Barat' },
  { id: 'city-67', name: 'Pekanbaru', type: 'Kota', province: 'Riau' },
  { id: 'city-68', name: 'Dumai', type: 'Kota', province: 'Riau' },
  { id: 'city-69', name: 'Batam', type: 'Kota', province: 'Kepulauan Riau' },
  { id: 'city-70', name: 'Tanjungpinang', type: 'Kota', province: 'Kepulauan Riau' },
  { id: 'city-71', name: 'Jambi', type: 'Kota', province: 'Jambi' },
  { id: 'city-72', name: 'Palembang', type: 'Kota', province: 'Sumatera Selatan' },
  { id: 'city-73', name: 'Bengkulu', type: 'Kota', province: 'Bengkulu' },
  { id: 'city-74', name: 'Bandar Lampung', type: 'Kota', province: 'Lampung' },
  { id: 'city-75', name: 'Pangkalpinang', type: 'Kota', province: 'Bangka Belitung' },

  // Kalimantan
  { id: 'city-76', name: 'Pontianak', type: 'Kota', province: 'Kalimantan Barat' },
  { id: 'city-77', name: 'Singkawang', type: 'Kota', province: 'Kalimantan Barat' },
  { id: 'city-78', name: 'Banjarmasin', type: 'Kota', province: 'Kalimantan Selatan' },
  { id: 'city-79', name: 'Banjarbaru', type: 'Kota', province: 'Kalimantan Selatan' },
  { id: 'city-80', name: 'Palangka Raya', type: 'Kota', province: 'Kalimantan Tengah' },
  { id: 'city-81', name: 'Samarinda', type: 'Kota', province: 'Kalimantan Timur' },
  { id: 'city-82', name: 'Balikpapan', type: 'Kota', province: 'Kalimantan Timur' },
  { id: 'city-83', name: 'Nusantara (IKN)', type: 'Kota', province: 'Kalimantan Timur' },
  { id: 'city-84', name: 'Tarakan', type: 'Kota', province: 'Kalimantan Utara' },

  // Sulawesi
  { id: 'city-85', name: 'Manado', type: 'Kota', province: 'Sulawesi Utara' },
  { id: 'city-86', name: 'Bitung', type: 'Kota', province: 'Sulawesi Utara' },
  { id: 'city-87', name: 'Palu', type: 'Kota', province: 'Sulawesi Tengah' },
  { id: 'city-88', name: 'Makassar', type: 'Kota', province: 'Sulawesi Selatan' },
  { id: 'city-89', name: 'Parepare', type: 'Kota', province: 'Sulawesi Selatan' },
  { id: 'city-90', name: 'Palopo', type: 'Kota', province: 'Sulawesi Selatan' },
  { id: 'city-91', name: 'Kendari', type: 'Kota', province: 'Sulawesi Tenggara' },
  { id: 'city-92', name: 'Gorontalo', type: 'Kota', province: 'Gorontalo' },
  { id: 'city-93', name: 'Mamuju', type: 'Kota', province: 'Sulawesi Barat' },

  // Maluku & Papua
  { id: 'city-94', name: 'Ambon', type: 'Kota', province: 'Maluku' },
  { id: 'city-95', name: 'Ternate', type: 'Kota', province: 'Maluku Utara' },
  { id: 'city-96', name: 'Jayapura', type: 'Kota', province: 'Papua' },
  { id: 'city-97', name: 'Sorong', type: 'Kota', province: 'Papua Barat Daya' },
  { id: 'city-98', name: 'Merauke', type: 'Kabupaten', province: 'Papua Selatan' },
  { id: 'city-99', name: 'Mimika (Timika)', type: 'Kabupaten', province: 'Papua Tengah' },
];

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
    kota: 'Jakarta Selatan',
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
    kota: 'Bandung',
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
    kota: 'Surabaya',
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
    kota: 'Yogyakarta',
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
    kota: 'Semarang',
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
    kota: 'Medan',
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
    kota: 'Denpasar',
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
    kota: 'Makassar',
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

  static async getCities(params: CityFilterParams = {}): Promise<PaginatedResponse<IndonesianCityDTO>> {
    // Realistic simulated network latency to demonstrate debounce and loading skeletons
    await delay(250);

    const { search = '', province = '', page = 1, pageSize = 10 } = params;

    let filtered = [...INDONESIAN_CITIES];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q) ||
          `${c.type} ${c.name}`.toLowerCase().includes(q)
      );
    }

    if (province && province !== 'all') {
      filtered = filtered.filter((c) => c.province === province);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total,
      page: validPage,
      pageSize,
      totalPages,
    };
  }

  static async getCityById(id: string): Promise<IndonesianCityDTO | undefined> {
    await delay(100);
    return INDONESIAN_CITIES.find((c) => c.id === id || c.name === id);
  }
}
