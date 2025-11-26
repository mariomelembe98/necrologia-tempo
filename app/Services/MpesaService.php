<?php

namespace App\Services;

use App\Models\Announcement;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    public function __construct(
        protected HttpFactory $http,
    ) {
    }

    /**
     * Inicia um pagamento C2B via M‑Pesa.
     *
     * IMPORTANTE: Os detalhes exactos (endpoints, campos obrigatorios)
     * devem ser ajustados de acordo com a documentacao oficial da M‑Pesa
     * (Vodacom Mocambique).
     *
     * @return array{success:bool,message:string,transactionId:?string}
     */
    public function initiatePayment(Announcement $announcement, string $phone): array
    {
        $config = config('services.mpesa');

        if (empty($config['host']) || empty($config['api_key']) || empty($config['service_provider_code'])) {
            return [
                'success' => false,
                'message' => 'MPesa nao esta configurado. Verifique o ficheiro .env.',
                'transactionId' => null,
            ];
        }

        // Normaliza o numero de telefone para MSISDN (ex: 25884XXXXXXX)
        $msisdn = preg_replace('/\D+/', '', $phone);
        if (! str_starts_with($msisdn, '258') && strlen($msisdn) === 9) {
            $msisdn = '258'.$msisdn;
        }

        $amount = (int) Arr::get($announcement->plan, 'price_mt', 0);

        // Payload conforme exemplo oficial da API C2B singleStage
        $payload = [
            'input_TransactionReference' => 'ANUNCIO-'.$announcement->id,
            'input_CustomerMSISDN' => $msisdn,
            'input_Amount' => (string) $amount,
            'input_ThirdPartyReference' => $announcement->slug ?? ('ANUNCIO-'.$announcement->id),
            'input_ServiceProviderCode' => $config['service_provider_code'],
        ];

        try {
            $url = rtrim($config['host'], '/').'/ipg/v1x/c2bPayment/singleStage/';
            $verify = ($config['environment'] ?? 'sandbox') !== 'sandbox';

            /** @var Response $response */
            $response = $this->http
                ->withHeaders([
                    'Origin' => $config['origin'] ?? 'developer.mpesa.vm.co.mz',
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer '.$config['api_key'],
                ])
                ->withOptions(['verify' => $verify])
                ->timeout((int) $config['timeout'])
                ->post($url, $payload);

            if (! $response->successful()) {
                Log::warning('MPesa payment failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Nao foi possivel iniciar o pagamento via MPesa.',
                    'transactionId' => null,
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'message' => 'Pedido de pagamento enviado para o numero '.$phone.'.',
                'transactionId' => $data['transactionId'] ?? null,
            ];
        } catch (\Throwable $exception) {
            Log::error('MPesa error', ['exception' => $exception]);

            return [
                'success' => false,
                'message' => 'Ocorreu um erro ao comunicar com MPesa.',
                'transactionId' => null,
            ];
        }
    }
}
