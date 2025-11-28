@php
    /** @var \App\Models\Announcement $announcement */
    /** @var string $title */
    /** @var string $message */
    /** @var string $ctaLabel */
    /** @var string $ctaUrl */
    $advertiser = $announcement->advertiser;
@endphp

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <title>{{ $title }} - {{ $announcement->name }}</title>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin:0; padding:24px; background-color:#f9fafb;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; background-color:#ffffff; border-radius:12px; padding:24px;">
                <tr>
                    <td>
                        <p style="margin:0 0 12px; font-size:14px; color:#18181b;">
                            Ola{{ $advertiser && $advertiser->name ? ' '.$advertiser->name : '' }},
                        </p>

                        <h2 style="margin:0 0 16px; font-size:16px; color:#0f172a;">
                            {{ $title }}
                        </h2>
                        <p style="margin:0 0 16px; font-size:14px; color:#3f3f46;">
                            {{ $message }}
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#18181b; border-collapse:collapse; margin-bottom:20px;">
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap;">Tipo</td>
                                <td style="padding:4px 0;">{{ ucfirst($announcement->type) }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap;">Nome</td>
                                <td style="padding:4px 0;">{{ $announcement->name }}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap;">Plano</td>
                                <td style="padding:4px 0;">{{ optional($announcement->plan)->name ?? 'Sem plano' }}</td>
                            </tr>
                            @if($announcement->expires_at)
                                <tr>
                                    <td style="padding:4px 16px 4px 0; width:160px; color:#52525b; font-weight:500; white-space:nowrap;">Validade</td>
                                    <td style="padding:4px 0;">{{ $announcement->expires_at?->format('d/m/Y') }}</td>
                                </tr>
                            @endif
                        </table>

                        <p>
                            <a href="{{ $ctaUrl }}" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:8px; background-color:#0c64e3; color:#ffffff; text-decoration:none; font-size:14px;">{{ $ctaLabel }}</a>
                        </p>
                        <p style="margin:16px 0 0; font-size:12px; color:#94a3b8;">
                            Este email foi gerado automaticamente pelo {{ config('app.name') }}.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
