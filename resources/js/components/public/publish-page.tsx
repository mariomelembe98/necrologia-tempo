import { useState, type ChangeEvent, type FormEvent } from 'react';

import { type AnnouncementType } from '@/context/AnnouncementContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Bell,
    Calendar,
    Check,
    Clock,
    FileText,
    Heart,
    Mail,
    Phone,
    Send,
    Shield,
    Upload,
    User,
} from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface Plan {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    type: AnnouncementType | 'outros';
    slug?: string;
}

interface PublishPageProps {
    plans?: {
        id: number;
        name: string;
        slug: string;
        type: AnnouncementType | 'outros';
        duration_days: number;
        price_mt: number;
    }[];
}

const defaultPlans: Plan[] = [
    {
        id: 'falecimento-3',
        slug: 'falecimento-3',
        name: 'Anúncio de falecimento 3 dias',
        description: '3 dias de publicação',
        duration: 3,
        price: 200,
        type: 'comunicado',
    },
    {
        id: 'falecimento-7',
        slug: 'falecimento-7',
        name: 'Anúncio de falecimento 7 dias',
        description: '7 dias de publicação',
        duration: 7,
        price: 300,
        type: 'comunicado',
    },
    {
        id: 'homenagem-15',
        slug: 'homenagem-15',
        name: 'Homenagem póstuma de 15 dias',
        description: '15 dias de publicação',
        duration: 15,
        price: 500,
        type: 'homenagem',
    },
    {
        id: 'outros-3',
        slug: 'outros-3',
        name: 'Outros anúncios',
        description: '3 dias de publicação',
        duration: 3,
        price: 200,
        type: 'outros',
    },
];

export default function PublishPage({ plans }: PublishPageProps) {
    const { errors, flash } = usePage<{
        errors: Record<string, string>;
        flash?: { success?: string; error?: string };
    }>().props;
    const availablePlans: Plan[] =
        plans && plans.length
            ? plans.map((plan) => ({
                id: String(plan.id),
                name: plan.name,
                description: `${plan.duration_days} dias de publicação`,
                duration: plan.duration_days,
                price: plan.price_mt,
                type: plan.type,
                slug: plan.slug,
            }))
            : defaultPlans;

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [selectedType, setSelectedType] =
        useState<AnnouncementType | null>(null);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState<string | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [responsibilityAccepted, setResponsibilityAccepted] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFreeNotice, setShowFreeNotice] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        dateOfDeath: '',
        location: '',
        description: '',
        author: '',
        advertiserName: '',
        advertiserPhone: '',
        advertiserEmail: '',
    });

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setSelectedType(
            plan.type === 'homenagem' || plan.type === 'comunicado'
                ? plan.type
                : null,
        );
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const formatPhoneMozambique = (value: string) => {
        const numbers = value.replace(/\D/g, '');

        if (numbers.startsWith('258')) {
            const withoutCode = numbers.substring(3);
            if (withoutCode.length <= 2) {
                return `+258 ${withoutCode}`;
            }
            if (withoutCode.length <= 5) {
                return `+258 ${withoutCode.substring(
                    0,
                    2,
                )} ${withoutCode.substring(2)}`;
            }

            return `+258 ${withoutCode.substring(0, 2)} ${withoutCode.substring(
                2,
                5,
            )} ${withoutCode.substring(5, 9)}`;
        }

        if (numbers.length <= 2) {
            return numbers;
        }

        if (numbers.length <= 5) {
            return `${numbers.substring(0, 2)} ${numbers.substring(2)}`;
        }

        return `${numbers.substring(0, 2)} ${numbers.substring(
            2,
            5,
        )} ${numbers.substring(5, 9)}`;
    };

    const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneMozambique(event.target.value);
        setFormData((previous) => ({
            ...previous,
            advertiserPhone: formatted,
        }));
    };

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setPhotoName(null);
            setPhotoFile(null);
            return;
        }

        setPhotoName(file.name);
        setPhotoFile(file);
    };

    const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setDocumentName(null);
            setDocumentFile(null);
            return;
        }

        setDocumentName(file.name);
        setDocumentFile(file);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!selectedPlan) {
            alert('Selecione um plano para continuar.');
            return;
        }

        if (
            !formData.name ||
            (selectedPlan.type === 'comunicado' &&
                !formData.dateOfDeath) ||
            !formData.location ||
            !formData.description ||
            !formData.author
        ) {
            alert('Preencha todos os campos obrigatórios do anúncio.');
            return;
        }

        if (
            !formData.advertiserName ||
            !formData.advertiserPhone ||
            !documentName
        ) {
            alert(
                'Preencha todos os dados do anunciante e envie um documento.',
            );
            return;
        }

        if (!responsibilityAccepted) {
            alert(
                'Confirme que as informacoes fornecidas sao verdadeiras e autoriza a publicacao.',
            );
            return;
        }

        const finalType: AnnouncementType =
            selectedType ?? 'comunicado';

        setIsSubmitting(true);

        router.post(
            '/anuncios',
            {
                type: finalType,
                name: formData.name,
                dateOfBirth: formData.dateOfBirth || undefined,
                dateOfDeath: formData.dateOfDeath,
                location: formData.location,
                description: formData.description,
                author: formData.author,
                advertiserName: formData.advertiserName,
                advertiserPhone: formData.advertiserPhone,
                advertiserEmail: formData.advertiserEmail || undefined,
                advertiserDocument: 'uploaded',
                plan: selectedPlan.name,
                planPrice: selectedPlan.price,
                planDuration: selectedPlan.duration,
                responsibilityAccepted,
                photo: photoFile ?? undefined,
                document: documentFile ?? undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormData({
                        name: '',
                        dateOfBirth: '',
                        dateOfDeath: '',
                        location: '',
                        description: '',
                        author: '',
                        advertiserName: '',
                        advertiserPhone: '',
                        advertiserEmail: '',
                    });
                    setPhotoName(null);
                    setPhotoFile(null);
                    setDocumentName(null);
                    setDocumentFile(null);
                    setResponsibilityAccepted(false);

                    if (typeof window !== 'undefined') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        });
                    }
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    if (!selectedPlan) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-900 via-amber-200/60 to-slate-900 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        {flash?.success && (
                            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
                                {flash.error}
                            </div>
                        )}
                        
                        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
                            Publicar Anúncio
                        </h1>
                        <p className="text-sm text-slate-100 max-w-2xl">
                            Escolha o plano ideal para sua publicação.
                        </p>
                    </header>

                    <div className="mb-6 rounded-2xl bg-gray-800/30 p-6 sm:p-8 text-center">
                        <h2 className="text-lg font-semibold text-white mb-1">
                            Planos disponíveis
                        </h2>
                        <p className="text-sm text-slate-200">
                            Selecione o plano que melhor atende às suas
                            necessidades.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {availablePlans.map((plan) => (
                            <Card
                                key={plan.id}
                                className="bg-white text-slate-900 dark:bg-white dark:text-slate-900 border-slate-200 cursor-pointer hover:border-slate-400 hover:shadow-xl transition-all group border-2 relative overflow-hidden"
                                onClick={() => handlePlanSelect(plan)}
                            >
                                {plan.slug === 'falecimento-7' && (
                                    <div className="absolute top-4 -right-10 bg-blue-600 text-white px-12 py-1 text-sm rotate-45 shadow-lg">
                                        Popular
                                    </div>
                                )}

                                <CardHeader className="text-center pb-6 pt-8">
                                    <div
                                        className={`mx-auto mb-4 p-4 rounded-2xl group-hover:scale-110 transition-transform ${plan.type === 'homenagem'
                                            ? 'bg-rose-50 group-hover:bg-rose-100'
                                            : plan.type === 'comunicado'
                                                ? 'bg-blue-50 group-hover:bg-blue-100'
                                                : 'bg-purple-50 group-hover:bg-purple-100'
                                            }`}
                                    >
                                        {plan.type === 'homenagem' ? (
                                            <Heart className="w-12 h-12 text-rose-600" />
                                        ) : plan.type === 'comunicado' ? (
                                            <Bell className="w-12 h-12 text-blue-600" />
                                        ) : (
                                            <FileText className="w-12 h-12 text-purple-600" />
                                        )}
                                    </div>

                                    <CardTitle className="mb-3 text-lg">
                                        {plan.name}
                                    </CardTitle>

                                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-4 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{plan.description}</span>
                                    </div>

                                    <div className="text-center border-t pt-4 mt-4">
                                        <div className="text-slate-900 mb-1">
                                            <span className="text-sm">
                                                MT
                                            </span>{' '}
                                            {plan.price}
                                        </div>
                                        <div className="text-slate-600 text-sm">
                                            {plan.duration}{' '}
                                            {plan.duration === 1
                                                ? 'dia'
                                                : 'dias'}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="text-center pb-6">
                                    <Button
                                        className={`w-full text-white ${plan.type === 'homenagem'
                                            ? 'bg-rose-600 hover:bg-rose-700'
                                            : plan.type === 'comunicado'
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-purple-600 hover:bg-purple-700'
                                            }`}
                                    >
                                        Selecionar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-900 via-amber-200/60 to-slate-900 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {showFreeNotice && (
                            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                                <div className="mt-0.5 rounded-full bg-amber-100 p-1">
                                    <Bell className="h-4 w-4 text-amber-700" />
                                </div>
                                <div className="flex-1">
                                    <p>
                                        A submissão de anúncios na Tempo Necrologia
                                        é gratuita até <span className="font-semibold">10/12/2025</span>.
                                        Após esta data poderemos aplicar tarifas de publicação.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowFreeNotice(false)}
                                    className="ml-2 text-xs font-medium text-amber-800 hover:text-amber-900"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}

                <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit border-slate-300 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-700 hover:bg-slate-100"
                        >
                            Publicar comunicado
                        </Button>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            Formulario de anuncio necrologico
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Preencha os dados abaixo para publicar um comunicado de falecimento, uma homenagem ou outros anuncios relacionados. Todas as submetas sao verificadas antes da publicacao para garantir respeito e autenticidade.
                        </p>

                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 sm:text-sm">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span>Suporte: <a href="tel:+258833219644">+258 83 321 9644</a></span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 sm:text-sm">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <span>Email: <a href="mailto:necrologia@tempo.co.mz">necrologia@tempo.co.mz</a></span>
                        </div>
                    </div>
                </div>

                <Card className="bg-white text-slate-900 dark:bg-white dark:text-slate-900 border-slate-200 border-2 shadow-lg pt-0">
                    <CardHeader
                        className={`border-b-2 py-4 ${selectedType === 'homenagem'
                            ? 'bg-rose-50 border-rose-200'
                            : selectedType === 'comunicado'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-purple-50 border-purple-200'
                            }`}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-xl ${selectedType === 'homenagem'
                                        ? 'bg-rose-100'
                                        : selectedType === 'comunicado'
                                            ? 'bg-blue-100'
                                            : 'bg-purple-100'
                                        }`}
                                >
                                    {selectedType === 'homenagem' ? (
                                        <Heart className="w-7 h-7 text-rose-600" />
                                    ) : (
                                        <Bell className="w-7 h-7 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="mb-1 text-base sm:text-lg">
                                        {selectedPlan?.name}
                                    </CardTitle>
                                    {selectedPlan && (
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {selectedPlan.duration} dias
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="text-slate-400">
                                                    •
                                                </span>
                                                {selectedPlan.price} MT
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedPlan && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedPlan(null);
                                        setSelectedType(null);
                                    }}
                                    className="sm:ml-4"
                                >
                                    <span className="mr-2">{'←'}</span>
                                    Mudar plano
                                </Button>
                            )}
                        </div>
                    </CardHeader>



                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Dados do anúncio
                                    </h2>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nome completo *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nome completo da pessoa falecida"
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">
                                            Data de nascimento (opcional)
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className={
                                                errors?.dateOfBirth
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : undefined
                                            }
                                        />
                                        {errors?.dateOfBirth && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.dateOfBirth}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfDeath">
                                            {selectedPlan.type ===
                                                'comunicado'
                                                ? 'Data de falecimento *'
                                                : 'Data de falecimento (opcional)'}
                                        </Label>
                                        <Input
                                            id="dateOfDeath"
                                            type="date"
                                            name="dateOfDeath"
                                            value={formData.dateOfDeath}
                                            onChange={handleChange}
                                            required={
                                                selectedPlan.type ===
                                                'comunicado'
                                            }
                                            className={
                                                errors?.dateOfDeath
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : undefined
                                            }
                                        />
                                        {errors?.dateOfDeath && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.dateOfDeath}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Local *</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Cidade, província"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="photo">
                                        Foto do homenageado/falecido (opcional)
                                    </Label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                                        {!photoName ? (
                                            <label htmlFor="photo" className="cursor-pointer block">
                                                <div className="text-center">
                                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                                    <p className="text-slate-700 mb-1">
                                                        Clique para selecionar uma foto
                                                    </p>
                                                    <p className="text-slate-500 text-xs">
                                                        Formatos JPG ou PNG, máx. 5MB
                                                    </p>
                                                </div>
                                                <input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-green-100 rounded-lg">
                                                    <Check className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-slate-900">{photoName}</p>
                                                    <p className="text-xs text-slate-500">
                                                        Foto carregada com sucesso.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        {selectedType === 'homenagem'
                                            ? 'Mensagem de homenagem *'
                                            : selectedType === 'comunicado'
                                                ? 'Detalhes do comunicado *'
                                                : 'Mensagem / detalhes *'}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder={
                                            selectedType === 'homenagem'
                                                ? 'Escreva uma mensagem em memória, compartilhe histórias e momentos especiais...'
                                                : selectedType === 'comunicado'
                                                    ? 'Informações sobre velório, cerimônia, missa de 7º dia, local e horário...'
                                                    : 'Escreva os detalhes principais do anúncio...'
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">
                                        Publicado por *
                                    </Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="Nome da família ou responsável"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200">
                                <div className="flex items-start gap-3 pb-2 border-b border-slate-200">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Shield className="w-5 h-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-900">
                                            Dados do anunciante
                                        </h2>
                                        <p className="text-xs text-slate-600">
                                            As informações são usadas apenas
                                            para contato e verificação.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="advertiserName">
                                        Nome completo *
                                    </Label>
                                    <Input
                                        id="advertiserName"
                                        name="advertiserName"
                                        value={formData.advertiserName}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="advertiserPhone">
                                            Telefone *
                                        </Label>
                                        <Input
                                            id="advertiserPhone"
                                            name="advertiserPhone"
                                            type="tel"
                                            value={formData.advertiserPhone}
                                            onChange={handlePhoneChange}
                                            placeholder="+258 XX XXX XXXX"
                                            required
                                        />
                                        <p className="text-xs text-slate-500">
                                            Formato sugerido: +258 84 123 4567
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="advertiserEmail">
                                            E-mail (opcional)
                                        </Label>
                                        <Input
                                            id="advertiserEmail"
                                            name="advertiserEmail"
                                            type="email"
                                            value={formData.advertiserEmail}
                                            onChange={handleChange}
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="document">
                                        Documento de identificação *
                                    </Label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                        {!documentName ? (
                                            <label
                                                htmlFor="document"
                                                className="cursor-pointer block"
                                            >
                                                <div className="text-center">
                                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                                    <p className="text-slate-700 mb-1">
                                                        Clique para fazer upload
                                                        do documento
                                                    </p>
                                                    <p className="text-slate-500 text-xs">
                                                        BI, passaporte ou carta
                                                        de condução (JPG, PNG ou
                                                        PDF, máx. 5MB)
                                                    </p>
                                                </div>
                                                <input
                                                    id="document"
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={
                                                        handleDocumentChange
                                                    }
                                                    className="hidden"
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-green-100 rounded-lg">
                                                    <Check className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-slate-900">
                                                        {documentName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Documento enviado com
                                                        sucesso
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            Seus dados não serão exibidos
                                            publicamente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-6 border-t border-slate-200">
                                <div className="flex-1">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
                                        <div className="mb-4">
                                            <label className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={responsibilityAccepted}
                                                    onChange={(event) =>
                                                        setResponsibilityAccepted(
                                                            event.target
                                                                .checked,
                                                        )
                                                    }
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="max-w-xl leading-relaxed">
                                                    Declaro, que todas as informações fornecidas neste anúncio necrológico são verdadeiras e autorizo a sua
                                                    publicação neste site. *
                                                </span>
                                            </label>
                                        </div>

                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 sm:p-5">
                                            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                                Formas de pagamento
                                            </h3>
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm">
                                                    <div className="text-[11px] font-semibold tracking-wide text-slate-500">
                                                        EMOLA
                                                    </div>
                                                    <div className="mt-1 text-slate-900">
                                                        +258 86 801 0880
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm">
                                                    <div className="text-[11px] font-semibold tracking-wide text-slate-500">
                                                        M-PESA
                                                    </div>
                                                    <div className="mt-1 text-slate-900">
                                                        +258 XX XXX XXXX
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm">
                                                    <div className="text-[11px] font-semibold tracking-wide text-slate-500">
                                                        TRANSFERÊNCIA BANCÁRIA
                                                    </div>
                                                    <div className="mt-1 text-slate-900">
                                                        NIB/Conta XXXX XXXX XXXX
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                                                O pagamento deve ser efectuado após a aprovação do anúncio. Entraremos em contacto com os dados de confirmação.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                {selectedPlan && (
                                    <div className="flex-1">
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-600">
                                                    Total a pagar:
                                                </span>
                                                <span className="text-slate-900 font-semibold">
                                                    {selectedPlan.price} MT
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Clock className="w-4 h-4" />
                                                Válido por{' '}
                                                {selectedPlan.duration}{' '}
                                                {selectedPlan.duration === 1
                                                    ? 'dia'
                                                    : 'dias'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <div className="flex gap-3 justify-end">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => router.visit('/')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`text-white ${selectedType === 'homenagem'
                                                ? 'bg-rose-600 hover:bg-rose-700'
                                                : selectedType === 'comunicado'
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : selectedPlan?.type === 'outros'
                                                        ? 'bg-purple-600 hover:bg-purple-700'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Publicar anúncio
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 mt-4">
                                Ao submeter este formulário, você concorda com os nossos{' '}
                                <a href="#" className="underline">
                                    Termos de Serviço
                                </a>{' '}
                                e{' '}
                                <a href="#" className="underline">
                                    Política de Privacidade
                                </a>
                                .
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
