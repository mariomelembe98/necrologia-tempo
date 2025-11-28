<?php

namespace App\Mail;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AnnouncementStatusNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public Announcement $announcement;
    public string $title;
    public string $message;
    public string $ctaLabel;
    public string $ctaUrl;

    public function __construct(
        Announcement $announcement,
        string $title,
        string $message,
        string $ctaLabel,
        string $ctaUrl,
    ) {
        $this->announcement = $announcement;
        $this->title = $title;
        $this->message = $message;
        $this->ctaLabel = $ctaLabel;
        $this->ctaUrl = $ctaUrl;
    }

    public function build(): self
    {
        return $this
            ->subject("{$this->title} — ".config('app.name'))
            ->view('emails.announcements.status_notification', [
                'announcement' => $this->announcement,
                'title' => $this->title,
                'message' => $this->message,
                'ctaLabel' => $this->ctaLabel,
                'ctaUrl' => $this->ctaUrl,
            ]);
    }
}
