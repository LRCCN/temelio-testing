function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

export function uniqueName(prefix = 'QA-Automation'): string {
  return `${prefix}-${uniqueSuffix()}`;
}

export function uniqueEmail(prefix = 'qa-automation'): string {
  return `${prefix}-${uniqueSuffix()}@example.com`;
}
