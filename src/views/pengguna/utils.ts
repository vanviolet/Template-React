export function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'info' | 'outline' {
  switch (role) {
    case 'admin':
      return 'default';
    case 'manager':
      return 'info';
    case 'staff':
      return 'secondary';
    default:
      return 'outline';
  }
}
