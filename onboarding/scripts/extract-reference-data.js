// AI GENERATED SCRIPT

// Extrai tabelas de comparação "Sistema 1".."Sistema 5" da planilha de custo do leite
// (aba "Seu sistema" é sempre ignorada) e gera os arquivos reference_*.json em ../resources.
import XLSX from 'xlsx';

const RESOURCES_DIR = `${import.meta.dirname}/../resources`;
const SPREADSHEET_PATH = `${RESOURCES_DIR}/Custo_Leite_Abril_2026 CEPA CONSELEITE.xlsx`;

// Parênteses cujo conteúdo é só uma unidade de medida são removidos do slug
// (ex: "Vacas em lactação (cabeças)" -> "vacas_em_lactacao"). Qualquer outro
// parêntese é mantido, pois pode ser parte do que distingue o item
// (ex: "Compost Barn (área da cama)" vs "Compost Barn (cocho de água galvanizado)").
const UNIT_PHRASES_IN_PARENS = new Set([
  'cabecas',
  'cabecas/ano',
  'dias/ano',
  'meses',
  '% ao ano',
]);

function stripAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(label) {
  let text = label.replace(/\(([^)]*)\)/g, (match, inner) => {
    const normalizedInner = stripAccents(inner.trim().toLowerCase());
    return UNIT_PHRASES_IN_PARENS.has(normalizedInner) ? '' : match;
  });
  text = stripAccents(text.toLowerCase());
  text = text.replace(/[^a-z0-9]+/g, '_');
  text = text.replace(/^_+|_+$/g, '');
  return text;
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function cellValue(sheet, row, col) {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[addr];
  return cell ? cell.v : undefined;
}

// Localiza dinamicamente em qual coluna está cada "Sistema N" (N de 1 a 5) na
// linha de cabeçalho informada, em vez de fixar letras de coluna.
function findSystemColumns(sheet, headerRow, range) {
  const columns = {};
  for (let c = range.s.c; c <= range.e.c; c++) {
    const value = cellValue(sheet, headerRow, c);
    if (typeof value !== 'string') continue;
    const match = value.trim().match(/^sistema\s*([1-5])$/i);
    if (match) {
      columns[Number(match[1])] = c;
    }
  }
  for (let n = 1; n <= 5; n++) {
    if (columns[n] === undefined) {
      throw new Error(`Não encontrei a coluna "Sistema ${n}" na linha ${headerRow + 1}`);
    }
  }
  return columns;
}

// Extrai uma tabela (label na coluna B, sistemas nas colunas detectadas via
// cabeçalho) e devolve um objeto plano { slug: { sistema_1: n, ..., sistema_5: n } }.
function extractTable(sheet, { headerRow, labelCol, dataStartRow, dataEndRow }) {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const systemCols = findSystemColumns(sheet, headerRow, range);
  const result = {};

  for (let row = dataStartRow; row <= dataEndRow; row++) {
    const label = cellValue(sheet, row, labelCol);
    if (typeof label !== 'string' || label.trim() === '') continue;

    const values = {};
    let hasAnyValue = false;
    for (let n = 1; n <= 5; n++) {
      const raw = cellValue(sheet, row, systemCols[n]);
      const numeric = typeof raw === 'number' ? raw : 0;
      if (numeric !== 0) hasAnyValue = true;
      values[n] = round2(numeric);
    }

    if (!hasAnyValue) continue; // linha sem nenhum dado preenchido em nenhum sistema

    const key = slugify(label);
    const entry = {};
    for (let n = 1; n <= 5; n++) entry[`sistema_${n}`] = values[n];

    if (result[key]) {
      // Mesma chave já existe (ex: label repetido em linhas diferentes) -> mescla,
      // desde que não haja sobreposição real de valores para o mesmo sistema.
      for (let n = 1; n <= 5; n++) {
        const existing = result[key][`sistema_${n}`];
        const incoming = entry[`sistema_${n}`];
        if (incoming === 0) continue;
        if (existing !== 0 && existing !== incoming) {
          throw new Error(
            `Conflito ao mesclar "${label}" (chave "${key}"): sistema_${n} já é ${existing}, novo valor ${incoming}`
          );
        }
        result[key][`sistema_${n}`] = incoming;
      }
    } else {
      result[key] = entry;
    }
  }

  return result;
}

// Reduz o resultado de extractTable a apenas as chaves listadas em `selection`.
// Cada valor de `selection` pode ser uma chave única (passa direto) ou uma
// lista de chaves (soma os valores por sistema em uma única chave de saída).
function pickFields(data, selection) {
  const result = {};
  for (const [outputKey, sources] of Object.entries(selection)) {
    const sourceKeys = Array.isArray(sources) ? sources : [sources];
    const entry = { sistema_1: 0, sistema_2: 0, sistema_3: 0, sistema_4: 0, sistema_5: 0 };
    for (const sourceKey of sourceKeys) {
      const source = data[sourceKey];
      if (!source) throw new Error(`Chave "${sourceKey}" não encontrada para montar "${outputKey}"`);
      for (let n = 1; n <= 5; n++) {
        entry[`sistema_${n}`] = round2(entry[`sistema_${n}`] + source[`sistema_${n}`]);
      }
    }
    result[outputKey] = entry;
  }
  return result;
}

// Soma grupos de chaves em uma única chave de saída, mantendo intactas as
// chaves que não fazem parte de nenhum grupo (ao contrário de pickFields,
// que descarta tudo que não é selecionado).
function mergeFields(data, merges) {
  const sourceToOutput = new Map();
  for (const [outputKey, sourceKeys] of Object.entries(merges)) {
    for (const sourceKey of sourceKeys) sourceToOutput.set(sourceKey, outputKey);
  }

  const result = {};
  const sums = {};
  for (const [key, value] of Object.entries(data)) {
    const outputKey = sourceToOutput.get(key);
    if (!outputKey) {
      result[key] = value;
      continue;
    }
    sourceToOutput.delete(key);
    if (!sums[outputKey]) {
      sums[outputKey] = { sistema_1: 0, sistema_2: 0, sistema_3: 0, sistema_4: 0, sistema_5: 0 };
      result[outputKey] = sums[outputKey];
    }
    for (let n = 1; n <= 5; n++) {
      sums[outputKey][`sistema_${n}`] = round2(sums[outputKey][`sistema_${n}`] + value[`sistema_${n}`]);
    }
  }

  if (sourceToOutput.size > 0) {
    throw new Error(`Chave(s) não encontrada(s) para mesclar: ${[...sourceToOutput.keys()].join(', ')}`);
  }

  return result;
}

// Remove chaves específicas do resultado (ex: um campo cuja unidade não faz
// sentido somar com os demais).
function omitFields(data, keys) {
  const keysToOmit = new Set(keys);
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    if (!keysToOmit.has(key)) result[key] = value;
  }
  return result;
}

function writeJson(fileName, data) {
  const outputPath = `${RESOURCES_DIR}/${fileName}`;
  Deno.writeTextFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Gerado ${fileName}`);
}

function main() {
  const workbook = XLSX.readFile(SPREADSHEET_PATH);

  const herdRaw = extractTable(workbook.Sheets['Anexo Evolucao Rebanho'], {
    headerRow: 3, // linha 4
    labelCol: 1, // coluna B
    dataStartRow: 4, // linha 5
    dataEndRow: 21, // linha 22 (ignora a tabela "sem arredondamento" a partir da linha 25)
  });
  // Só interessam essas 3 categorias; novilhas em recria é a soma das duas faixas etárias.
  const herd = pickFields(herdRaw, {
    vacas_em_lactacao: 'vacas_em_lactacao',
    novilhas_em_recria: ['novilhas_em_recria_acima_de_24_meses', 'novilhas_em_recria_de_12_a_24_meses'],
    bezerras_ate_12_meses: 'bezerras_ate_12_meses',
  });
  writeJson('reference_systems_herd.json', herd);

  const land = extractTable(workbook.Sheets['Area e atividades'], {
    headerRow: 4, // linha 5
    labelCol: 1, // coluna B
    dataStartRow: 5, // linha 6
    dataEndRow: 8, // linha 9 (tabela "ÁREAS (HECTARES)")
  });
  writeJson('reference_systems_land.json', land);

  const infraestrutura = workbook.Sheets['Infraestrutura'];

  const buildingsRaw = extractTable(infraestrutura, {
    headerRow: 25, // linha 26
    labelCol: 1, // coluna B
    dataStartRow: 26, // linha 27
    dataEndRow: 49, // linha 50 ("BENFEITORIAS UTILIZADAS PELA ATIVIDADE LEITEIRA")
  });
  const buildings = mergeFields(buildingsRaw, {
    cercas_permanentes: [
      'cercas_permanentes_sistema_1',
      'cercas_permanentes_sistema_2',
      'cercas_permanentes_sist_3_4_e_5',
    ],
    // "cocho de água galvanizado" é medido em metros, não em metros quadrados
    // como os outros 3, então fica de fora da soma (ver omitFields abaixo).
    compost_barn: [
      'compost_barn_area_da_cama',
      'compost_barn_area_da_pista_de_alimentacao',
      'compost_barn_area_de_circulacao_e_trato',
    ],
  });
  const buildingsFinal = omitFields(buildings, ['compost_barn_cocho_de_agua_galvanizado']);
  writeJson('reference_buildings.json', buildingsFinal);

  const equipment = extractTable(infraestrutura, {
    headerRow: 55, // linha 56
    labelCol: 1, // coluna B
    dataStartRow: 56, // linha 57
    dataEndRow: 95, // linha 96 ("EQUIPAMENTOS UTILIZADOS PELA ATIVIDADE LEITEIRA")
  });
  writeJson('reference_equipement.json', equipment);

  const machines = extractTable(infraestrutura, {
    headerRow: 102, // linha 103
    labelCol: 1, // coluna B
    dataStartRow: 103, // linha 104
    dataEndRow: 110, // linha 111 ("MÁQUINAS, VEÍCULOS E ANIMAIS DE TRABALHO UTILIZADOS PELA ATIVIDADE LEITEIRA")
  });
  writeJson('reference_machines.json', machines);
}

main();
