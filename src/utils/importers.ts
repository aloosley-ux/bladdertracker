import readXlsxFile from 'read-excel-file/browser';
import type { BowelEntry, DrinkEntry, ImportedDiaryPayload } from '../types';

function normaliseKey(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function parseBoolean(value: unknown): boolean {
  const normalised = String(value ?? '').trim().toLowerCase();
  return ['true', 'yes', 'y', '1', 'wet', 'pass', 'given'].includes(normalised);
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
}

function rowToRecord(headers: string[], values: unknown[]): Record<string, string> {
  return headers.reduce<Record<string, string>>((record, header, index) => {
    record[normaliseKey(header)] = String(values[index] ?? '').trim();
    return record;
  }, {});
}

function inferEntryType(record: Record<string, string>): 'drink' | 'urine' | 'bowel' | null {
  const declaredType = record.entrytype || record.type;
  if (declaredType === 'drink' || declaredType === 'urine' || declaredType === 'bowel') {
    return declaredType;
  }

  if (record.amountml || record.drinktype) return 'drink';
  if (record.wet || record.pass) return 'urine';
  if (record.bristoltype || record.location) return 'bowel';
  return null;
}

function spreadsheetRecordsToPayload(records: Record<string, string>[]): ImportedDiaryPayload {
  const payload: ImportedDiaryPayload = {
    drinks: [],
    urineEntries: [],
    bowelEntries: [],
  };

  records.forEach((record) => {
    const entryType = inferEntryType(record);
    if (!entryType) return;

    if (entryType === 'drink') {
      payload.drinks?.push({
        date: record.date,
        time: record.time,
        type: (record.drinktype || record.type || 'cup') as DrinkEntry['type'],
        amountMl: Number(record.amountml || record.amount || 0),
        notes: record.notes || '',
      });
      return;
    }

    if (entryType === 'urine') {
      payload.urineEntries?.push({
        date: record.date,
        time: record.time,
        wet: parseBoolean(record.wet),
        pass: parseBoolean(record.pass),
        notes: record.notes || '',
      });
      return;
    }

    payload.bowelEntries?.push({
      date: record.date,
      time: record.time,
      location: (record.location || 'toilet') as BowelEntry['location'],
      amount: (record.amount || 'M') as BowelEntry['amount'],
      bristolType: Number(record.bristoltype || record.bristol || 4) as BowelEntry['bristolType'],
      laxativesGiven: parseBoolean(record.laxativesgiven || record.laxatives),
      notes: record.notes || '',
    });
  });

  return payload;
}

function parseCsv(content: string): ImportedDiaryPayload {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return {};
  const headers = splitCsvLine(lines[0]);
  const records = lines.slice(1).map((line) => rowToRecord(headers, splitCsvLine(line)));
  return spreadsheetRecordsToPayload(records);
}

function parseJson(content: string): ImportedDiaryPayload {
  const parsed = JSON.parse(content) as ImportedDiaryPayload | { entries?: Array<Record<string, string>> };
  if ('entries' in parsed && Array.isArray(parsed.entries)) {
    return spreadsheetRecordsToPayload(parsed.entries);
  }

  const directPayload = parsed as ImportedDiaryPayload;
  return {
    drinks: directPayload.drinks ?? [],
    urineEntries: directPayload.urineEntries ?? [],
    bowelEntries: directPayload.bowelEntries ?? [],
  };
}

async function parseXlsx(file: File): Promise<ImportedDiaryPayload> {
  const rows = (await readXlsxFile(file)) as Array<Array<string | number | boolean | Date | null>>;
  if (rows.length < 2) return {};

  const headers = rows[0].map((cell: string | number | boolean | Date | null) => String(cell ?? ''));
  const records = rows.slice(1).map((row: Array<string | number | boolean | Date | null>) => rowToRecord(headers, row));
  return spreadsheetRecordsToPayload(records);
}

export async function parseImportFile(file: File): Promise<ImportedDiaryPayload> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.xlsx')) {
    return parseXlsx(file);
  }

  const content = await file.text();

  if (lowerName.endsWith('.json')) {
    return parseJson(content);
  }

  return parseCsv(content);
}

export function getImportTemplateDescription(): string[] {
  return [
    'Use entryType values of drink, urine, or bowel.',
    'Include date and time columns for every row.',
    'Drink rows support drinkType and amountMl.',
    'Urine rows support wet, pass, and notes.',
    'Bowel rows support location, amount, bristolType, laxativesGiven, and notes.',
  ];
}
