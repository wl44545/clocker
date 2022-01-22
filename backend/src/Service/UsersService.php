<?php

namespace App\Service;

class UsersService
{
    public function mygetUser($id): array
    {
        return [
            'id' => $id,
            'name' => 'user',
            'haslo' => 'bardzosilnehaslo'
        ];
    }
    public function getUsers(): array
    {
        return 'todo';
    }
    public function updateRole($id, $role)
    {
        $sql = "UPDATE users SET role = $role WHERE id=$id;";
        #todo update role
        return 'success, user '.$id.' now has '.$role.' role';
    }
    public function addUser($username, $pass, $role)
    {
        $sql = "INSERT INTO users (username, password, role) VALUES ($username, $pass, $role);";
        #todo update role
        return $sql;
    }
    public function removeUser($id)
    {
        #todo update role
        $sql = "DELETE FROM users WHERE id = $id;";
        return 'user '.$id.' deleted';
    }

}
