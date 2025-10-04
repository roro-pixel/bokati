import React from 'react';

interface Permission {
  id: string;
  category: string;
  action: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleMatrixProps {
  roles: Role[];
  permissions: Permission[];
  onPermissionToggle: (roleId: string, permissionId: string) => void;
}

export const RoleMatrix: React.FC<RoleMatrixProps> = ({ roles, permissions, onPermissionToggle }) => {
  // Grouper les permissions par catégorie
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Matrice des permissions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Permission
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <React.Fragment key={category}>
                  <tr className="bg-gray-50">
                    <td colSpan={roles.length + 1} className="px-4 py-2 text-sm font-medium text-gray-900">
                      {category}
                    </td>
                  </tr>
                  {categoryPermissions.map(permission => (
                    <tr key={permission.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{permission.action}</div>
                          <div className="text-gray-500 text-xs">{permission.description}</div>
                        </div>
                      </td>
                      {roles.map(role => (
                        <td key={`${role.id}-${permission.id}`} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={role.permissions.includes(permission.id)}
                            onChange={() => onPermissionToggle(role.id, permission.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};