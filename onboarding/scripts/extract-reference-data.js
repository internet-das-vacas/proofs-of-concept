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

function writeJson(fileName, data) {
  const outputPath = `${RESOURCES_DIR}/${fileName}`;
  Deno.writeTextFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Gerado ${fileName}`);
}

function main() {
  const workbook = XLSX.readFile(SPREADSHEET_PATH);

  const herd = extractTable(workbook.Sheets['Anexo Evolucao Rebanho'], {
    headerRow: 3, // linha 4
    labelCol: 1, // coluna B
    dataStartRow: 4, // linha 5
    dataEndRow: 21, // linha 22 (ignora a tabela "sem arredondamento" a partir da linha 25)
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

  const buildings = extractTable(infraestrutura, {
    headerRow: 25, // linha 26
    labelCol: 1, // coluna B
    dataStartRow: 26, // linha 27
    dataEndRow: 49, // linha 50 ("BENFEITORIAS UTILIZADAS PELA ATIVIDADE LEITEIRA")
  });
  writeJson('reference_buildings.json', buildings);

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
