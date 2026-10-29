import { SimplifiedResult } from '../types';

export const COMMON_LEGAL_TERMS: Record<string, string> = {
  'revelia': 'Quando a pessoa que foi processada não responde no prazo. A lei passa a considerar verdadeiros os fatos que a outra parte alegou.',
  'art. 344 do cpc': 'Artigo da lei que prevê a revelia caso o réu não apresente sua defesa.',
  'art. 523 do cpc': 'Regra para cobrança da dívida judicial com acréscimo de 10% de multa se não pagar no prazo.',
  'in limine': 'Logo no início do processo, sem esperar ouvir a outra parte.',
  'inaudita altera parte': 'Decisão tomada imediatamente antes mesmo de intimar ou ouvir a outra parte envolvida.',
  'exordial': 'Petição inicial; o primeiro documento com os pedidos que deram início ao processo.',
  'inicial': 'A primeira petição apresentada para abrir o processo.',
  'contestação': 'A resposta formal de defesa escrita que o réu apresenta contra as acusações.',
  'astreintes': 'Multa diária fixada pelo juiz para forçar o cumprimento rápido de uma ordem.',
  'tutela de urgência': 'Decisão provisória urgente tomada pelo juiz para evitar dano grave ou irreparável.',
  'fumus boni iuris': 'Indícios fortes e verossímeis de que quem pede tem razão na lei.',
  'periculum in mora': 'Perigo na demora; risco de dano à vida, saúde ou direitos se esperar o processo terminar.',
  'trânsito em julgado': 'Fim definitivo do processo. Não cabe mais nenhum recurso contra a decisão.',
  'concluso': 'Processo que foi encaminhado à mesa do juiz para que ele decida ou despache.',
  'preclusivo': 'Prazo fatal que não volta atrás; quem perder esse prazo perde o direito de se manifestar.',
  'mandado': 'Ordem por escrito assinada pelo juiz para ser cumprida pelo oficial de justiça.',
  'cite-se': 'Aviso oficial da Justiça convocando uma pessoa para tomar conhecimento do processo e se defender.',
  'intime-se': 'Aviso para que alguém saiba de uma decisão ou cumpra um prazo no processo.',
  'danos morais': 'Compensação financeira pelo sofrimento, abalo injusto ou transtorno grave.',
  'ipca-e': 'Índice oficial usado pela Justiça para corrigir o valor do dinheiro com o passar do tempo.',
  'juros moratórios': 'Percentual extra cobrado pelo atraso no pagamento.',
  'sisbajud': 'Sistema eletrônico que o juiz usa para localizar e bloquear valores em contas bancárias.',
  'bacenjud': 'Sistema bancário judicial de bloqueio de contas (sucedido pelo Sisbajud).'
};

export function parseLegalTextRuleBased(text: string, docType: string = 'geral'): SimplifiedResult {
  const lower = text.toLowerCase();
  
  // 1. Detect deadines
  let deadlineInfo = 'Nenhum prazo imediato identificado';
  const deadlineMatch = text.match(/prazo(?:\s+legal|\s+preclusivo|\s+improrrogável)?\s+de\s+([0-9]+|\w+)\s+(?:\([^\)]+\)\s+)?(dias\s+úteis|dias|horas)/i);
  if (deadlineMatch) {
    deadlineInfo = `${deadlineMatch[1]} ${deadlineMatch[2]}`;
  } else if (lower.includes('15 dias úteis') || lower.includes('15 (quinze) dias úteis')) {
    deadlineInfo = '15 dias úteis a contar da intimação/citação';
  } else if (lower.includes('48 horas')) {
    deadlineInfo = '48 horas';
  } else if (lower.includes('72 horas')) {
    deadlineInfo = '72 horas (urgente)';
  } else if (lower.includes('5 dias')) {
    deadlineInfo = '5 dias úteis';
  }

  // 2. Detect Action Required
  const hasAction = lower.includes('cite-se') || 
    lower.includes('apresentar contestação') || 
    lower.includes('sob pena') || 
    lower.includes('intime-se') || 
    lower.includes('adimplemento') || 
    lower.includes('pagamento');

  // 3. Determine Outcome / Nature
  let outcome = 'Andamento de Rotina';
  if (lower.includes('julgo procedente') || lower.includes('julgo parcialmente procedente')) {
    outcome = 'Decisão Favorável (Pedido Aceito)';
  } else if (lower.includes('julgo improcedente')) {
    outcome = 'Decisão Desfavorável (Pedido Negado)';
  } else if (lower.includes('defiro a medida') || lower.includes('defiro a tutela') || lower.includes('defiro a liminar')) {
    outcome = 'Ordem Urgente Deferida (Liminar Aceita)';
  } else if (lower.includes('recurso conhecido e desprovido')) {
    outcome = 'Recurso Negado (Decisão Anterior Mantida)';
  } else if (lower.includes('cite-se')) {
    outcome = 'Citação para Defesa (Aviso de Processo)';
  } else if (lower.includes('transitou em julgado')) {
    outcome = 'Processo Finalizado (Fim dos Recursos)';
  }

  // 4. Generate Summary
  let summary = '';
  if (lower.includes('cite-se') && lower.includes('contestação')) {
    summary = `O juiz determinou que você seja comunicado oficialmente sobre a existência de um processo contra você e concedeu prazo para apresentar sua defesa por escrito.`;
  } else if (lower.includes('julgo procedente') || lower.includes('julgo parcialmente procedente')) {
    summary = `O juiz analisou o caso e concordou com o pedido formulado, determinando que a parte requerida cumpra as obrigações e indenizações determinadas.`;
  } else if (lower.includes('defiro a tutela') || lower.includes('defiro a medida liminar')) {
    summary = `O juiz concedeu uma decisão urgente imediata, ordenando o cumprimento imediato do pedido (como fornecimento de tratamento/remédio ou obrigação urgente).`;
  } else if (lower.includes('recurso conhecido e desprovido')) {
    summary = `O tribunal analisou o recurso e decidiu manter a decisão anterior, confirmando a vitória de quem já havia vencido em primeira instância.`;
  } else if (lower.includes('cumprimento de sentença') || lower.includes('quantia exequenda')) {
    summary = `O processo chegou à fase de cobrança final dos valores definidos na sentença que já se tornou definitiva.`;
  } else {
    summary = `O Poder Judiciário emitiu um despacho no processo com orientações e prazos para o andamento da ação.`;
  }

  // 5. Generate Meaning
  let meaning = '';
  if (lower.includes('revelia')) {
    meaning = `A Justiça está avisando que, se você não responder no prazo fixado, o juiz entenderá que as alegações da outra pessoa são verdadeiras, e você poderá perder a ação sem que seus argumentos sejam analisados.`;
  } else if (lower.includes('danos morais') || lower.includes('astreintes')) {
    meaning = `A empresa ou parte ré foi condenada a pagar uma compensação financeira pelos transtornos e cumprir a ordem sob pena de multa diária se atrasar.`;
  } else if (lower.includes('inaudita altera parte') || lower.includes('tutela provisória')) {
    meaning = `A ordem foi dada de imediato pela urgência da situação para salvar a saúde ou evitar prejuízo grave, sem ter que aguardar a manifestação prévia da outra parte.`;
  } else {
    meaning = `O despacho estabelece as regras e os próximos procedimentos que as partes e advogados devem cumprir para que o processo possa avançar regularmente.`;
  }

  // 6. Generate Next Steps
  const nextSteps: string[] = [];
  if (lower.includes('contestação') || lower.includes('cite-se')) {
    nextSteps.push(`Procure imediatamente um advogado de confiança ou a Defensoria Pública de Roraima (DPE-RR) se não puder pagar.`);
    nextSteps.push(`Apresente sua resposta e comprovantes dentro do prazo de ${deadlineInfo} para não sofrer as consequências da revelia.`);
  } else if (lower.includes('adimplemento') || lower.includes('executado')) {
    nextSteps.push(`Efetue o pagamento voluntário do débito indicado no prazo para evitar a cobrança de multa de 10% e bloqueios bancários.`);
    nextSteps.push(`Se discordar dos cálculos, informe seu advogado ou defensor público para apresentar impugnação.`);
  } else if (lower.includes('recurso')) {
    nextSteps.push(`Aguarde a certidão de trânsito em julgado ou a intimação para o início da execução dos valores.`);
  } else if (lower.includes('liminar') || lower.includes('remédio') || lower.includes('fármaco')) {
    nextSteps.push(`Acompanhe junto ao órgão público responsável o cumprimento da ordem no prazo determinado.`);
    nextSteps.push(`Caso o medicamento ou serviço não seja entregue, comunique imediatamente ao juiz do processo.`);
  } else {
    nextSteps.push(`Verifique se o seu advogado ou defensor público já tomou ciência da publicação.`);
    nextSteps.push(`Acompanhe a movimentação processual através do portal TJRR ou Balcão Virtual.`);
  }

  // 7. Find glossary terms present
  const glossary: Array<{ term: string; definition: string }> = [];
  for (const [key, val] of Object.entries(COMMON_LEGAL_TERMS)) {
    if (lower.includes(key)) {
      glossary.push({
        term: key.charAt(0).toUpperCase() + key.slice(1),
        definition: val,
      });
    }
  }

  // 8. Needs Lawyer
  let needsLawyer = 'Recomenda-se acompanhamento por advogado ou pela Defensoria Pública do Estado de Roraima (DPE-RR).';
  if (lower.includes('juizado especial') && lower.includes('primeiro grau')) {
    needsLawyer = 'Em causas no Juizado Especial Cível de até 20 salários mínimos não é obrigatório advogado na fase inicial, mas é essencial em caso de recurso.';
  }

  const formattedText = `PODER JUDICIÁRIO DE RORAIMA - TJRR
Pacto pela Linguagem Simples (CNJ)

1. RESUMO DO PROCESSO:
${summary}

2. O QUE ISSO SIGNIFICA:
${meaning}

3. PRÓXIMOS PASSOS:
${nextSteps.map(s => `• ${s}`).join('\n')}

PRAZO INFORMADO: ${deadlineInfo}
ORIENTAÇÃO: ${needsLawyer}`;

  return {
    summary,
    meaning,
    outcome,
    nextSteps,
    hasActionRequired: hasAction,
    deadlineInfo,
    needsLawyer,
    glossary,
    formattedText,
  };
}
