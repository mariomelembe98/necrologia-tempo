<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Promoção de Anúncios
    |--------------------------------------------------------------------------
    |
    | Esta configuração define até quando a promoção gratuita está ativa e
    | quais endereços receberão notificações de moderação quando um anúncio
    | pendente for criado durante esse período.
    |
    */

    'promotion_end' => env('ANNOUNCEMENTS_PROMOTION_END', '2025-12-31 23:59:59'),
    'moderation_email' => env('ANNOUNCEMENTS_MODERATION_EMAIL'),
];
