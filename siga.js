// Mostra, com dados inventados, o caminho real que cada transação faz na categorização do Obsidio.
const PERGUNTAS = [
  'Existe regra criada para essa pessoa ou empresa?',
  'É dinheiro da própria pessoa mudando de lugar?',
  'A Pluggy sabe o que é?',
  'Ninguém soube responder',
];

const EXEMPLOS = [
  {
    rotulo: 'Pix de R$ 6,90 para Pedro',
    descricao: 'Pix enviado Pedro Henrique Alves',
    valor: ['R$ 6', ',90'],
    doc: 'CPF de outra pessoa',
    pluggy: 'Só que foi um Pix',
    respostas: ['Sim. Pedro com esse valor exato é o Spotify Família dividido. A regra por pessoa e valor vale antes da regra geral.'],
    resultado: 'Assinaturas',
    nota: 'Entra na conta do mês.',
  },
  {
    rotulo: 'Pix de R$ 38,00 para Pedro',
    descricao: 'Pix enviado Pedro Henrique Alves',
    valor: ['R$ 38', ',00'],
    doc: 'CPF de outra pessoa',
    pluggy: 'Só que foi um Pix',
    respostas: [
      'Existe uma regra para Pedro, mas só com R$ 6,90. Este valor não se encaixa.',
      'Não. O CPF é de outra pessoa.',
      'Não. Para um Pix a uma pessoa, o banco não diz para que foi.',
      'O app pergunta o que foi. A resposta pode virar regra para as próximas.',
    ],
    resultado: 'Pendentes',
    nota: 'Espera até a pessoa dizer o que foi.',
  },
  {
    rotulo: 'Pix de R$ 1.941,31 da empresa',
    descricao: 'Pix enviado Lucas Andrade',
    valor: ['R$ 1.941', ',31'],
    doc: 'CPF do próprio Lucas',
    pluggy: 'Só que foi um Pix',
    respostas: [
      'Não. Ninguém criou regra para esse nome.',
      'Sim. O CPF que recebe é do próprio Lucas, e a conta que enviou é a da empresa dele.',
    ],
    resultado: 'Retirada do sócio',
    nota: 'Na visão com todas as contas, não conta como gasto: o dinheiro só trocou de conta.',
  },
  {
    rotulo: 'Restaurante, R$ 72,14',
    descricao: 'Restaurante Sabor da Casa',
    valor: ['R$ 72', ',14'],
    doc: 'Empresa, compra no cartão',
    pluggy: 'Alimentação e bebidas',
    respostas: [
      'Não. Ninguém criou regra para esse restaurante.',
      'Não. É uma compra no cartão.',
      'Sim. A Pluggy classifica a compra, e o app traduz para a categoria dele.',
    ],
    resultado: 'Alimentação',
    nota: 'Entra na conta do mês em que a compra foi feita, não no mês da fatura.',
  },
];

const el = (id) => document.getElementById(id);
const escolha = el('siga-escolha');
const passos = el('siga-passos');

function mostrar(indice, animar) {
  const ex = EXEMPLOS[indice];
  [...escolha.children].forEach((b, i) => {
    b.setAttribute('aria-checked', String(i === indice));
    b.tabIndex = i === indice ? 0 : -1;
  });
  el('siga-descricao').textContent = ex.descricao;
  el('siga-valor').innerHTML = `${ex.valor[0]}<i>${ex.valor[1]}</i>`;
  el('siga-doc').textContent = ex.doc;
  el('siga-pluggy').textContent = ex.pluggy;

  const ultimo = ex.respostas.length - 1;
  passos.replaceChildren(...PERGUNTAS.map((pergunta, i) => {
    const li = document.createElement('li');
    const respondeu = i <= ultimo;
    li.className = i === ultimo ? 'achou' : respondeu ? 'passou' : 'nao-chegou';
    if (animar && respondeu) {
      li.classList.add('aparece');
      li.style.setProperty('--i', i);
    }
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = i + 1;
    const perg = document.createElement('span');
    perg.className = 'perg';
    perg.textContent = pergunta;
    li.append(num, perg);
    if (respondeu) {
      const resp = document.createElement('span');
      resp.className = 'resp';
      resp.textContent = ex.respostas[i];
      li.append(resp);
    }
    return li;
  }));
  el('siga-resultado').textContent = ex.resultado;
  el('siga-nota').textContent = ex.nota;
}

EXEMPLOS.forEach((ex, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'radio');
  b.textContent = ex.rotulo;
  b.addEventListener('click', () => mostrar(i, true));
  b.addEventListener('keydown', (e) => {
    const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!passo) return;
    e.preventDefault();
    const proximo = (i + passo + EXEMPLOS.length) % EXEMPLOS.length;
    mostrar(proximo, true);
    escolha.children[proximo].focus();
  });
  escolha.append(b);
});
mostrar(0, false);
