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
    public function addUser()
    {
        $name = null;
        $pass = null;
        $email = null;
        $sql = "INSERT INTO users VALUES ($name, $pass, $email);";
        #todo update role
        return 'success';
    }
    public function removeUser($id)
    {
        #todo update role
        $sql = "DELETE FROM users WHERE id = $id;";
        return 'user '.$id.' deleted';
    }

}