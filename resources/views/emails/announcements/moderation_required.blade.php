@php
    /** @var \App\Models\Announcement $announcement */
    /** @var string $reviewUrl */
@endphp

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>Revisão pendente: {{ $announcement->name }}</title>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin:0; padding:24px; background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; background-color:#ffffff; border-radius:12px; padding:24px;">
                <tr>
                    <td>
                        <p style="margin:0 0 16px; font-size:14px; color:#3f3f46;">
                            Um novo anúncio criado durante a promoção gratuita está aguardando aprovação.
                        </p>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Dados para revisão</h2>
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
                            @if($announcement->plan)
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Plano</td>
                                    <td style="padding:4px 0; vertical-align:top;">
                                        {{ $announcement->plan->name }} ({{ $announcement->plan->duration_days }} dias)
                                    </td>
                                </tr>
                            @endif
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Anunciante</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ optional($announcement->advertiser)->name ?? '–' }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Telefone</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ optional($announcement->advertiser)->phone ?? '–' }}</td>
                            </tr>
                        </table>

                        <p style="margin:24px 0 8px; font-size:14px; color:#3f3f46;">
                            Clique abaixo para revisar e publicar o anúncio:
                        </p>
                        <p>
                            <a href="{{ $reviewUrl }}" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:8px; background-color:#0c64e3; color:#ffffff; text-decoration:none; font-size:14px;">Ver no painel administrativo</a>
                        </p>
                        <p style="margin:0; font-size:12px; color:#94a3b8;">
                            Caso o anúncio já tenha sido revisado, você pode ignorar essa mensagem.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
