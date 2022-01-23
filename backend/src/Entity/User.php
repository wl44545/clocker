<?php
namespace App\Entity

class User
{
    private $_email;
    private $_password;

    public function login($email, $password)
    {
        $this->_email = mysql_real_escape_string($email);
        $this->_password = mysql_real_escape_string($password);

        $user_id = $this->_checkCredentials();
        if($user_id){
            $_SESSION['user_id'] = $user_id;
            return $user_id;
        }
        return false;
    }

    protected function _checkCredentials()
    {
        $query = "SELECT *
                    FROM users
                    WHERE email = '$this->_email'";
        $result = mysql_query($query);
        if(!empty($result)){
            $user = mysql_fetch_assoc($result);
            $submitted_pass = sha1($user['salt'] . $this->_password);
            if($submitted_pass == $user['password']){
                return $user['id'];
            }
        }
        return false;
    }
}

 ?>
