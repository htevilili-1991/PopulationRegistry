<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);

        $adminRole = Role::where('name', 'Admin')->first();
        $dataEntryClerkRole = Role::where('name', 'Data Entry Clerk')->first();

        $permissions = Permission::all();
        $adminRole->permissions()->attach($permissions);

        $viewCitizenPermission = Permission::where('name', 'view_citizen')->first();
        $createCitizenPermission = Permission::where('name', 'create_citizen')->first();
        $dataEntryClerkRole->permissions()->attach([$viewCitizenPermission->id, $createCitizenPermission->id]);

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $adminUser->roles()->attach($adminRole);

        $dataEntryClerkUser = User::factory()->create([
            'name' => 'Data Entry Clerk',
            'email' => 'clerk@example.com',
        ]);
        $dataEntryClerkUser->roles()->attach($dataEntryClerkRole);
    }
}
