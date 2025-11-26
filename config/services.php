<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'mpesa' => [
        // Configuracao generica para M-Pesa (Vodacom Mocambique)
        // Preencher estes valores no .env de acordo com o contrato.
        'host' => env('MPESA_HOST', 'https://api.sandbox.vm.co.mz'),
        'origin' => env('MPESA_ORIGIN', 'developer.mpesa.vm.co.mz'),
        'api_key' => env('MPESA_API_KEY'), // token completo usado no header Authorization: Bearer
        'service_provider_code' => env('MPESA_SERVICE_PROVIDER_CODE'),
        'environment' => env('MPESA_ENV', 'sandbox'), // sandbox | production
        'timeout' => env('MPESA_TIMEOUT', 30),
    ],

];
