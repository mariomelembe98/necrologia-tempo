<?php

namespace Database\Seeders;

use App\Models\Advertiser;
use App\Models\Announcement;
use App\Models\AnnouncementPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        if (AnnouncementPlan::query()->count() === 0) {
            $this->call(AnnouncementPlanSeeder::class);
        }

        $plan = AnnouncementPlan::query()->firstOrCreate(
            ['slug' => 'homenagem-15'],
            [
                'name' => 'Homenagem póstuma',
                'type' => 'homenagem',
                'duration_days' => 15,
                'price_mt' => 500,
                'is_active' => true,
            ],
        );

        $advertiser = Advertiser::query()->firstOrCreate(
            ['email' => 'homenagem.curratilaine@example.com'],
            [
                'name' => 'Comissão de Homenagem',
                'phone' => '+258 84 000 0000',
                'document_path' => null,
                'document_status' => 'verified',
                'document_verified_at' => Carbon::parse('2026-02-13 09:00:00'),
            ],
        );

        $publishedAt = Carbon::parse('2026-02-13 09:00:00');

        Announcement::query()->updateOrCreate(
            ['slug' => 'curratilaine-remane'],
            [
                'type' => 'homenagem',
                'name' => 'Curratilaine Remane',
                'date_of_birth' => '1956-03-10',
                'date_of_death' => '2025-08-10',
                'location' => 'Inhambane, Moçambique',
                'description' => "Curratilaine Remane: Uma Ode à Integridade e à Memória\n\nDas entranhas da cidade eterna - entre os becos sinuosos de Chalambe e as praias vibrantes do Matadouro e da Prancha — nasceu o fervor de ser manhambana de gema. Na memória, ecoam os assaltos joviais às amêndoas do velho nhachalane, as futeboladas desenfreadas no Rio Grande e os namoricos juvenis, embalados pela brisa marítima e cúmplice da lua.\n\nFoi nesse cenário de efervescência e simplicidade que moldaste teu carácter: íntegro e leal, como um rio que traça seu leito com a força da natureza.\n\nComo diziam os mais velhos, em tempos de sabedoria popular: “Quem não tomou chá de Ceilão não pode ser alguém de confiança.” Tu, és prova viva dessa máxima, diante de ti, nos curvamos.\n\nO Baluarte da Integridade no Mar de Seguros\n\nNo labirinto do sector de seguros, foste um farol de rectidão. Da Emose à Ímpar, da Seguradora Internacional de Moçambique à Fidelidade-Ímpar, e na presidência da Associação Moçambicana de Seguradoras, tua conduta sempre foi marcada pela serenidade e integridade.\n\nA corrente da malandragem, que tantas vezes verga outros, nunca te tocou. Foste exemplo, para a família, amigos, colegas e para a sociedade. Um pilar que não cede. Uma rocha inabalável.\n\nO Poeta da Serenidade, o Avô Guerreiro\n\nHoje, como os grandes guerreiros que depõem as armas após bravas batalhas, tuas mãos soltaram o escudo do profissional incansável. Agora, empunhas a armadura de pai e avô, transmitindo uma serenidade que lembra um lago límpido e calmo.\n\nAli, o som traquina dos netos arranca sorrisos nostálgicos, que te transportam à infância: as travessias da linha férrea rumo à escola Carvalho Araújo, os dias na Escola Técnica, e a migração forçada à capital em busca do saber.\n\nBem-haja, amigo Tainito, como carinhosamente teus amigos te chamam. Que a serenidade te envolva e que as risadas dos netos continuem a pintar a tela da tua vida com cores de alegria e paz.",
                'author' => 'Família Remane',
                'advertiser_id' => $advertiser->id,
                'plan_id' => $plan->id,
                'status' => 'published',
                'payment_status' => 'paid',
                'payment_method' => null,
                'payment_reference' => null,
                'photo_path' => 'https://i0.wp.com/revista.tempo.co.mz/wp-content/uploads/DESFOCADO-02.07.2025.png?resize=696%2C928&ssl=1',
                'document_path' => null,
                'published_at' => $publishedAt,
                'paid_at' => $publishedAt,
                'expires_at' => (clone $publishedAt)->addDays($plan->duration_days),
            ],
        );

        Announcement::factory()->count(30)->create();
    }
}
