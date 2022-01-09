<?php

namespace App\Service;

class StatsService 
{
    public function getStats(): array
    {
        return [
            'dayStats' => 1,
            'weekStats' => 2,
            'monthStats' => 3,
            'yearStats' => 4
        ];
    }
}