<?php

namespace App\Service;

class PostService 
{
    public function getPost($id): array
    {
        return [
            'id' => $id,
            'text' => 'Przykładowa treść wpisu',
        ];
    }
    public function getPosts(): array
    {
        return 'todo';
    }
    public function updatePost($id)
    {
        $sql = "UPDATE worklog SET things WHERE id=$id;";
        #todo update post
        return 'success, post '.$id.' edited';
    }
    public function addPost()
    {
        $name = null;
        $pass = null;
        $email = null;
        $sql = "INSERT INTO worklog VALUES things;";
        #todo update role
        return 'success';
    }
    public function removePost($id)
    {
        #todo update role
        $sql = "DELETE FROM worklog WHERE id = $id;";
        return 'post '.$id.' deleted';
    }

}