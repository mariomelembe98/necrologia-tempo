<?php

namespace App\Mail;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AnnouncementModerationRequired extends Mailable
{
    use Queueable;
    use SerializesModels;

    public Announcement $announcement;

    public function __construct(Announcement $announcement)
    {
        $this->announcement = $announcement;
    }

    public function build(): self
    {
        return $this
            ->subject('Revisão necessária: anúncio gratuito pendente')
            ->view('emails.announcements.moderation_required', [
                'announcement' => $this->announcement,
                'reviewUrl' => route('admin.announcements.show', $this->announcement),
            ]);
    }
}
