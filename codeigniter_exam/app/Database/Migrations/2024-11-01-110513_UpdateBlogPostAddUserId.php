<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateBlogPostAddUserId extends Migration
{
    public function up()
    {
        $this->forge->addColumn('blogposts', [
            'user_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('blogposts', 'user_id');
    }
}
