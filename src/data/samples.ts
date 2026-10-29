export interface LegalSample {
  id: string;
  title: string;
  category: 'Despacho' | 'Sentença' | 'Decisão Liminar' | 'Ementa' | 'Execução';
  description: string;
  originalText: string;
}

export const LEGAL_SAMPLES: LegalSample[] = [
  {
    id: 'despacho-citacao',
    title: 'Despacho de Citação com Prazo',
    category: 'Despacho',
    description: 'Aviso para a pessoa responder a um processo no prazo de 15 dias úteis.',
    originalText: `Vistos. Cite-se a parte requerida para, querendo, apresentar contestação no prazo preclusivo de 15 (quinze) dias úteis, sob pena de incidência dos efeitos materiais da revelia, reputando-se verdadeiros os fatos articulados na exordial (art. 344 do CPC). Intime-se a parte autora para juntada da guia comprobatória do recolhimento de custas complementares em 5 dias, sob pena de cancelamento da distribuição. Cumpra-se com urgência pelo oficial de justiça de plantão.`
  },
  {
    id: 'sentenca-danos-morais',
    title: 'Sentença Procedente (Danos Morais)',
    category: 'Sentença',
    description: 'Decisão final de um juizado que deu vitória ao cidadão contra uma empresa.',
    originalText: `Ante o exposto e por tudo mais que dos autos consta, acolho a preliminar de ilegitimidade passiva do segundo corréu e, no mérito, JULGO PARCIALMENTE PROCEDENTE o pleito formulado na exordial para: 
a) condenar a concessionária requerida na obrigação de fazer consistente no imediato restabelecimento dos serviços essenciais no prazo de 48 horas, sob pena de astreintes diárias fixadas em R$ 200,00 (duzentos reais), até o teto de R$ 5.000,00;
b) condenar a ré ao pagamento da quantia de R$ 4.500,00 (quatro mil e quinhentos reais) a título de compensação por danos morais, corrigida monetariamente pelo IPCA-E a partir desta publicação e com juros moratórios de 1% ao mês a fluir da citação válida.
Sem custas ou verbas sucumbenciais em primeiro grau de jurisdição, ex vi do art. 55 da Lei 9.099/95. Publique-se. Registre-se. Intimem-se.`
  },
  {
    id: 'decisao-liminar-saude',
    title: 'Decisão de Liminar (Fornecimento de Remédio)',
    category: 'Decisão Liminar',
    description: 'Ordem judicial urgente para o Estado fornecer medicamento para tratamento.',
    originalText: `Trata-se de pedido de tutela provisória de urgência antecipada requerida em caráter antecedente em face do Estado de Roraima, objetivando o fornecimento in natura do medicamento prescrito ao paciente, portador de cardiopatia grave (CID 10: I50.9).
Presentes a plausibilidade do direito (fumus boni iuris) atestada pelo receituário do SUS e o periculum in mora decorrente do risco iminente de descompensação e óbito.
DEFIRO a medida liminar inaudita altera parte para determinar que a Secretaria de Estado da Saúde disponibilize o medicamento no prazo improrrogável de 72 (setenta e duas) horas, sob pena de sequestro de numerário público via Bacenjud/Sisbajud e responsabilização do gestor por crime de desobediência.
Expeça-se mandado em regime de plantão.`
  },
  {
    id: 'ementa-consumidor',
    title: 'Ementa de Recurso (Nome Negativado)',
    category: 'Ementa',
    description: 'Resumo do julgamento de desembargadores mantendo vitória do consumidor.',
    originalText: `APELAÇÃO CÍVEL. RELAÇÃO DE CONSUMO. APONTAMENTO INDEVIDO EM ÓRGÃOS DE PROTEÇÃO AO CRÉDITO (SPC/SERASA). FRAUDE DE TERCEIRO NÃO EXCLUDENTE DO NEXO CAUSAL. FORTUITO INTERNO. SÚMULA 479 DO STJ. DANO MORAL CONFIGURADO IN RE IPSA. QUANTUM INDENIZATÓRIO ARBITRADO EM HARMONIA COM OS PRINCÍPIOS DA RAZOABILIDADE E PROPORCIONALIDADE. RECURSO CONHECIDO E DESPROVIDO. MAJORAÇÃO DOS HONORÁRIOS RECURSAIS NA FORMA DO ART. 85, §11, DO CPC.`
  },
  {
    id: 'intimacao-divida',
    title: 'Intimação para Pagamento de Dívida',
    category: 'Execução',
    description: 'Aviso formal para pagar uma dívida judicial antes de sofrer bloqueio de conta.',
    originalText: `Certifico que a r. sentença transitou em julgado no dia 10 p.p. Consoante requerimento de cumprimento de sentença de id 109823, intime-se o executado, na pessoa de seu patrono constituído, para que promova o adimplemento voluntário da quantia exequenda de R$ 8.920,50 no prazo legal de 15 (quinze) dias úteis.
Fica o devedor expressamente advertido de que o não pagamento no interregno legal implicará o acréscimo da multa de 10% (dez por cento) e, também, de honorários advocatícios de 10% sobre o débito, ex vi do art. 523, § 1º, do CPC, procedendo-se incontinenti à constrição judicial de ativos financeiros.`
  }
];
