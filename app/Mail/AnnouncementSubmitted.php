<?php

namespace App\Mail;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AnnouncementSubmitted extends Mailable
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
            ->subject('Novo anuncio submetido')
            ->view('emails.announcements.submitted', [
                'announcement' => $this->announcement,
            ]);
    }
}

