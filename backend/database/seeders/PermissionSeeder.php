<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'create_citizen']);
        Permission::create(['name' => 'edit_citizen']);
        Permission::create(['name' => 'delete_citizen']);
        Permission::create(['name' => 'view_citizen']);
    }
}
