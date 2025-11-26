@php
    /** @var \App\Models\Announcement $announcement */
    $advertiser = $announcement->advertiser;
@endphp

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>Recebemos o seu anuncio</title>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin:0; padding:24px; background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; background-color:#ffffff; border-radius:12px; padding:24px;">
                <tr>
                    <td>
                        <p style="margin:0 0 12px; font-size:14px; color:#18181b;">
                            Ola{{ $advertiser && $advertiser->name ? ' '.$advertiser->name : '' }},
                        </p>

                        <p style="margin:0 0 16px; font-size:14px; color:#3f3f46;">
                            Recebemos o seu pedido de anuncio necrologico no site {{ config('app.name') }}. A nossa equipa vai rever as informacoes enviadas e entrara em contacto para confirmar os detalhes e o pagamento antes da publicacao.
                        </p>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Resumo do seu anuncio</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b; border-collapse:collapse;">
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Tipo</td>
                                <td style="padding:4px 0; vertical-align:top;">
                                    {{ ucfirst($announcement->type) }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Nome</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ $announcement->name }}</td>
                            </tr>
                            @if($announcement->date_of_birth || $announcement->date_of_death)
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Datas</td>
                                    <td style="padding:4px 0; vertical-align:top;">
                                        @if($announcement->date_of_birth)
                                            {{ $announcement->date_of_birth?->format('d/m/Y') }}
                                        @endif
                                        @if($announcement->date_of_birth && $announcement->date_of_death)
                                            &nbsp;&ndash;&nbsp;
                                        @endif
                                        @if($announcement->date_of_death)
                                            {{ $announcement->date_of_death?->format('d/m/Y') }}
                                        @endif
                                    </td>
                                </tr>
                            @endif
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Local</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ $announcement->location }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Mensagem</td>
                                <td style="padding:4px 0; vertical-align:top; white-space:pre-line;">
                                    {{ $announcement->description }}
                                </td>
                            </tr>
                        </table>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Plano escolhido</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b; border-collapse:collapse;">
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Plano</td>
                                <td style="padding:4px 0; vertical-align:top;">
                                    {{ optional($announcement->plan)->name ?? 'Sem plano associado' }}
                                </td>
                            </tr>
                            @if($announcement->plan)
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Duracao</td>
                                    <td style="padding:4px 0; vertical-align:top;">
                                        {{ $announcement->plan->duration_days }} dias
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Valor</td>
                                    <td style="padding:4px 0; vertical-align:top;">
                                        {{ $announcement->plan->price_mt }} MT
                                    </td>
                                </tr>
                            @endif
                        </table>

                        <p style="margin:24px 0 0; font-size:12px; color:#a1a1aa;">
                            Esta mensagem foi enviada automaticamente pelo sistema {{ config('app.name') }} apos a submissao do seu anuncio. Se nao reconhece este pedido, por favor ignore este email.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

