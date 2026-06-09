/**
 * Manages single-row inline edit state for flat tables.
 * Use one instance per editable table. Key is the row index.
 *
 * For nested tables (e.g. Customer Matrix with per-account rows),
 * use a typed state object directly in the component instead.
 */
export class InlineEdit<T extends object> {
  editing: { key: unknown; form: T } | null = null;

  get form(): T { return this.editing!.form; }
  get isOpen(): boolean { return this.editing !== null; }

  start(key: unknown, source: T): void {
    this.editing = { key, form: { ...source } };
  }

  isActive(key: unknown): boolean {
    return this.editing?.key === key;
  }

  cancel(): void {
    this.editing = null;
  }
}
