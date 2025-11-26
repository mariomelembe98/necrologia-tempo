@php
    /** @var \App\Models\Announcement $announcement */
@endphp

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>Novo anuncio submetido - {{ $announcement->name }}</title>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin:0; padding:24px; background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; background-color:#ffffff; border-radius:12px; padding:24px;">
                <tr>
                    <td>
                        <p style="margin:0 0 16px; font-size:14px; color:#3f3f46;">
                            Um novo anuncio necrologico foi submetido pelo site {{ config('app.name') }}.
                        </p>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Dados do anuncio</h2>
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
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Publicado por</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ $announcement->author }}</td>
                            </tr>
                        </table>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Plano e status</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b; border-collapse:collapse;">
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Plano</td>
                                <td style="padding:4px 0; vertical-align:top;">
                                    {{ optional($announcement->plan)->name ?? 'Sem plano associado' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Status</td>
                                <td style="padding:4px 0; vertical-align:top;">{{ ucfirst($announcement->status) }}</td>
                            </tr>
                            @if($announcement->expires_at)
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Expira em</td>
                                    <td style="padding:4px 0; vertical-align:top;">
                                        {{ $announcement->expires_at?->format('d/m/Y H:i') }}
                                    </td>
                                </tr>
                            @endif
                        </table>

                        @if($announcement->advertiser)
                            <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Dados do anunciante</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b; border-collapse:collapse;">
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Nome</td>
                                    <td style="padding:4px 0; vertical-align:top;">{{ $announcement->advertiser->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Email</td>
                                    <td style="padding:4px 0; vertical-align:top;">{{ $announcement->advertiser->email }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap; vertical-align:top;">Telefone</td>
                                    <td style="padding:4px 0; vertical-align:top;">{{ $announcement->advertiser->phone }}</td>
                                </tr>
                            </table>
                        @endif

                        <p style="margin:24px 0 0; font-size:12px; color:#a1a1aa;">
                            Esta mensagem foi enviada automaticamente pelo sistema {{ config('app.name') }} após a submissão de um anúncio.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
