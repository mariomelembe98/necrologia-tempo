<?php

namespace App\Mail;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AnnouncementSubmittedToAdvertiser extends Mailable
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
            ->subject('Recebemos o seu anuncio na '.config('app.name'))
            ->view('emails.announcements.submitted_to_advertiser', [
                'announcement' => $this->announcement,
            ]);
    }
}

