import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bell, Send, ArrowLeft, User, Phone, Mail, FileText, Shield, Upload, Check, Calendar, Clock } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  type: 'homenagem' | 'comunicado' | 'outros';
}

const plans: Plan[] = [
  {
    id: 'falecimento-3',
    name: 'Anúncio de falecimento 3 dias',
    description: '3 dias de publicação',
    duration: 3,
    price: 200,
    type: 'comunicado'
  },
  {
    id: 'falecimento-7',
    name: 'Anúncio de falecimento 7 dias',
    description: '7 dias de publicação',
    duration: 7,
    price: 300,
    type: 'comunicado'
  },
  {
    id: 'homenagem-15',
    name: 'Homenagem póstuma de 15 dias',
    description: '15 dias de publicação',
    duration: 15,
    price: 500,
    type: 'homenagem'
  },
  {
    id: 'outros-3',
    name: 'Outros anúncios',
    description: '3 dias de publicação',
    duration: 3,
    price: 200,
    type: 'outros'
  }
];

export function PublishPage() {
  const navigate = useNavigate();
  const { addAnnouncement } = useAnnouncements();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedType, setSelectedType] = useState<'homenagem' | 'comunicado' | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    dateOfDeath: '',
    location: '',
    description: '',
    author: '',
    advertiserName: '',
    advertiserPhone: '',
    advertiserEmail: ''
  });

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    if (plan.type === 'homenagem' || plan.type === 'comunicado') {
      setSelectedType(plan.type);
    } else {
      setSelectedType(null);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de arquivo não permitido. Use JPG, PNG ou PDF');
        return;
      }

      setDocumentFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocumentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview('pdf');
      }

      toast.success('Documento carregado com sucesso');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan || !selectedType) {
      toast.error('Por favor, selecione um plano');
      return;
    }

    if (!formData.name || !formData.dateOfDeath || !formData.location || !formData.description || !formData.author) {
      toast.error('Por favor, preencha todos os campos obrigatórios do anúncio');
      return;
    }

    if (!formData.advertiserName || !formData.advertiserPhone || !formData.advertiserEmail || !documentFile) {
      toast.error('Por favor, preencha todos os dados do anunciante e faça upload do documento');
      return;
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + selectedPlan.duration);

    addAnnouncement({
      type: selectedType,
      name: formData.name,
      dateOfBirth: formData.dateOfBirth || undefined,
      dateOfDeath: formData.dateOfDeath,
      location: formData.location,
      description: formData.description,
      author: formData.author,
      advertiserName: formData.advertiserName,
      advertiserPhone: formData.advertiserPhone,
      advertiserEmail: formData.advertiserEmail,
      advertiserDocument: 'verified', // In production, upload to server
      plan: selectedPlan.name,
      planPrice: selectedPlan.price,
      planDuration: selectedPlan.duration,
      expiresAt: expiresAt.toISOString()
    });

    toast.success('Anúncio publicado com sucesso');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatPhoneMozambique = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format: +258 XX XXX XXXX
    if (numbers.startsWith('258')) {
      const withoutCode = numbers.substring(3);
      if (withoutCode.length <= 2) {
        return `+258 ${withoutCode}`;
      } else if (withoutCode.length <= 5) {
        return `+258 ${withoutCode.substring(0, 2)} ${withoutCode.substring(2)}`;
      } else {
        return `+258 ${withoutCode.substring(0, 2)} ${withoutCode.substring(2, 5)} ${withoutCode.substring(5, 9)}`;
      }
    } else if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.substring(0, 2)} ${numbers.substring(2)}`;
    } else {
      return `${numbers.substring(0, 2)} ${numbers.substring(2, 5)} ${numbers.substring(5, 9)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneMozambique(e.target.value);
    setFormData(prev => ({ ...prev, advertiserPhone: formatted }));
  };

  const handleBack = () => {
    if (formData.name || formData.description) {
      if (confirm('Tem certeza que deseja voltar? Seus dados serão perdidos.')) {
        setSelectedPlan(null);
        setSelectedType(null);
      }
    } else {
      setSelectedPlan(null);
      setSelectedType(null);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-3">Publicar Anúncio</h1>
          <p className="text-slate-600">
            {!selectedPlan 
              ? 'Escolha o plano ideal para sua publicação'
              : 'Preencha os dados abaixo para publicar seu anúncio'
            }
          </p>
        </div>

        {/* Plan Selection */}
        {!selectedPlan ? (
          <div>
            <div className="mb-6">
              <h2 className="text-slate-900 mb-2">Planos Disponíveis</h2>
              <p className="text-slate-600">Selecione o plano que melhor atende suas necessidades</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className="cursor-pointer hover:border-slate-400 hover:shadow-xl transition-all group border-2 relative overflow-hidden"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {/* Ribbon for popular plan */}
                  {plan.id === 'falecimento-7' && (
                    <div className="absolute top-4 -right-10 bg-blue-600 text-white px-12 py-1 text-sm rotate-45 shadow-lg">
                      Popular
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`mx-auto mb-4 p-4 rounded-2xl group-hover:scale-110 transition-transform ${
                      plan.type === 'homenagem' 
                        ? 'bg-rose-50 group-hover:bg-rose-100' 
                        : plan.type === 'comunicado'
                        ? 'bg-blue-50 group-hover:bg-blue-100'
                        : 'bg-purple-50 group-hover:bg-purple-100'
                    }`}>
                      {plan.type === 'homenagem' ? (
                        <Heart className="w-12 h-12 text-rose-600" />
                      ) : plan.type === 'comunicado' ? (
                        <Bell className="w-12 h-12 text-blue-600" />
                      ) : (
                        <FileText className="w-12 h-12 text-purple-600" />
                      )}
                    </div>

                    <CardTitle className="mb-3 text-lg">{plan.name}</CardTitle>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.description}</span>
                    </div>

                    <div className="text-center border-t pt-4 mt-4">
                      <div className="text-slate-900 mb-1">
                        <span className="text-sm">MT</span>
                      </div>
                      <div className="text-slate-600">
                        {plan.duration} {plan.duration === 1 ? 'dia' : 'dias'}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="text-center pb-6">
                    <Button 
                      className={`w-full ${
                        plan.type === 'homenagem' 
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
        ) : (
          <Card className="border-2 shadow-lg">
            {/* Plan Summary Header */}
            <CardHeader className={`border-b-2 ${selectedType === 'homenagem' ? 'bg-rose-50 border-rose-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${selectedType === 'homenagem' ? 'bg-rose-100' : 'bg-blue-100'}`}>
                    {selectedType === 'homenagem' ? (
                      <Heart className="w-8 h-8 text-rose-600" />
                    ) : (
                      <Bell className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="mb-1">{selectedPlan.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedPlan.duration} dias
                      </span>
                      <span className="flex items-center gap-1">
                        <span>•</span>
                        {selectedPlan.price} MT
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Mudar Plano
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Announcement Data Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-700" />
                    </div>
                    <h3 className="text-slate-900">Dados do Anúncio</h3>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nome completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nome completo da pessoa falecida"
                      className="text-base"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-base">Data de nascimento</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfDeath" className="text-base">Data de falecimento *</Label>
                      <Input
                        id="dateOfDeath"
                        name="dateOfDeath"
                        type="date"
                        required
                        value={formData.dateOfDeath}
                        onChange={handleChange}
                        className="text-base"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base">Local *</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Cidade, Província"
                      className="text-base"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      {selectedType === 'homenagem' ? 'Mensagem de homenagem *' : 'Detalhes do comunicado *'}
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={
                        selectedType === 'homenagem'
                          ? 'Escreva uma mensagem em memória, compartilhe histórias e momentos especiais...'
                          : 'Informações sobre velório, cerimônia, missa de 7º dia, local e horário...'
                      }
                      rows={6}
                      className="text-base resize-none"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-base">Publicado por *</Label>
                    <Input
                      id="author"
                      name="author"
                      type="text"
                      required
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Nome da família ou responsável"
                      className="text-base"
                    />
                  </div>
                </div>

                {/* Advertiser Data Section */}
                <div className="space-y-6 pt-6 border-t-2 border-slate-200">
                  <div className="flex items-start gap-3 pb-3 border-b-2 border-slate-200">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Shield className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-900 mb-1">Dados do Anunciante</h3>
                      <p className="text-slate-600 text-sm">
                        Informações para contato e verificação de identidade.
                      </p>
                    </div>
                  </div>

                  {/* Advertiser Name */}
                  <div className="space-y-2">
                    <Label htmlFor="advertiserName" className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome completo do anunciante *
                    </Label>
                    <Input
                      id="advertiserName"
                      name="advertiserName"
                      type="text"
                      required
                      value={formData.advertiserName}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="text-base"
                    />
                  </div>

                  {/* Phone and Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="advertiserPhone" className="text-base flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone *
                      </Label>
                      <Input
                        id="advertiserPhone"
                        name="advertiserPhone"
                        type="tel"
                        required
                        value={formData.advertiserPhone}
                        onChange={handlePhoneChange}
                        placeholder="+258 XX XXX XXXX"
                        className="text-base"
                      />
                      <p className="text-sm text-slate-500">
                        Formato: +258 84 123 4567
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advertiserEmail" className="text-base flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-mail *
                      </Label>
                      <Input
                        id="advertiserEmail"
                        name="advertiserEmail"
                        type="email"
                        required
                        value={formData.advertiserEmail}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="text-base"
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="document" className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documento de Identificação *
                    </Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-slate-400 transition-colors">
                      {!documentFile ? (
                        <label htmlFor="document" className="cursor-pointer block">
                          <div className="text-center">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-700 mb-1">
                              Clique para fazer upload do documento
                            </p>
                            <p className="text-slate-500 text-sm">
                              BI, Passaporte ou Carta de Condução (JPG, PNG ou PDF, máx. 5MB)
                            </p>
                          </div>
                          <input
                            id="document"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                            onChange={handleDocumentUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                              <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-slate-900">{documentFile.name}</p>
                              <p className="text-slate-500 text-sm">
                                {(documentFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDocumentFile(null);
                              setDocumentPreview('');
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Seus dados estão protegidos e não serão compartilhados publicamente
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-slate-200">
                  <div className="flex-1">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Total a pagar:</span>
                        <span className="text-slate-900">{selectedPlan.price} MT</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        Válido por {selectedPlan.duration} dias
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className={`${
                        selectedType === 'homenagem' 
                          ? 'bg-rose-600 hover:bg-rose-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publicar e Pagar
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
