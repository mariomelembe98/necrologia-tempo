@php
    /** @var \App\Models\Announcement $announcement */
@endphp

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>Novo anuncio submetido</title>
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
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b;">
                            <tr>
                                <td style="padding:4px 0; width:140px; color:#52525b;">Tipo</td>
                                <td style="padding:4px 0;">
                                    {{ ucfirst($announcement->type) }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#52525b;">Nome</td>
                                <td style="padding:4px 0;">{{ $announcement->name }}</td>
                            </tr>
                            @if($announcement->date_of_birth || $announcement->date_of_death)
                                <tr>
                                    <td style="padding:4px 0; color:#52525b;">Datas</td>
                                    <td style="padding:4px 0;">
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
                                <td style="padding:4px 0; color:#52525b;">Local</td>
                                <td style="padding:4px 0;">{{ $announcement->location }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; vertical-align:top; color:#52525b;">Mensagem</td>
                                <td style="padding:4px 0; white-space:pre-line;">
                                    {{ $announcement->description }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#52525b;">Publicado por</td>
                                <td style="padding:4px 0;">{{ $announcement->author }}</td>
                            </tr>
                        </table>

                        <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Plano e status</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b;">
                            <tr>
                                <td style="padding:4px 0; width:140px; color:#52525b;">Plano</td>
                                <td style="padding:4px 0;">
                                    {{ optional($announcement->plan)->name ?? 'Sem plano associado' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#52525b;">Status</td>
                                <td style="padding:4px 0;">{{ ucfirst($announcement->status) }}</td>
                            </tr>
                            @if($announcement->expires_at)
                                <tr>
                                    <td style="padding:4px 0; color:#52525b;">Expira em</td>
                                    <td style="padding:4px 0;">
                                        {{ $announcement->expires_at?->format('d/m/Y H:i') }}
                                    </td>
                                </tr>
                            @endif
                        </table>

                        @if($announcement->advertiser)
                            <h2 style="margin:24px 0 8px; font-size:16px; color:#18181b;">Dados do anunciante</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b;">
                                <tr>
                                    <td style="padding:4px 0; width:140px; color:#52525b;">Nome</td>
                                    <td style="padding:4px 0;">{{ $announcement->advertiser->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 0; color:#52525b;">Email</td>
                                    <td style="padding:4px 0;">{{ $announcement->advertiser->email }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 0; color:#52525b;">Telefone</td>
                                    <td style="padding:4px 0;">{{ $announcement->advertiser->phone }}</td>
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

