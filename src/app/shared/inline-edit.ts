/**
 * Manages single-row inline edit state for flat tables.
 * Use one instance per editable table. Key is the row index.
 *
 * For nested tables (e.g. Customer Matrix with per-account rows),
 * use a typed state object directly in the component instead.
 */
export class InlineEdit<T extends object> {
  editing: { index: number; form: T } | null = null;

  get form(): T { return this.editing!.form; }
  get isOpen(): boolean { return this.editing !== null; }

  start(index: number, source: T): void {
    this.editing = { index, form: { ...source } };
  }

  isActive(index: number): boolean {
    return this.editing?.index === index;
  }

  cancel(): void {
    this.editing = null;
  }
}
