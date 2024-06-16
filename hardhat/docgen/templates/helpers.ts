import { HelperOptions, Utils } from 'handlebars';
import { ContractDefinition, EventDefinition, FunctionDefinition, StructDefinition, EnumDefinition, ModifierDefinition } from "solidity-ast";
import { ASTDereferencer, findAll } from "solidity-ast/utils";
import { DocItemWithContext, DOC_ITEM_CONTEXT } from "solidity-docgen/dist/site";
import { uniqBy } from 'lodash';


export function eq(v1:HelperOptions, v2:HelperOptions) {
  return v1 === v2;
};

export function ne(v1:HelperOptions, v2:HelperOptions) {
  return v1 !== v2;
};

export function or() {
  return [...arguments].slice(0, -1).some(Boolean);
};

export function and() {
  return [...arguments].slice(0, -1).every(Boolean);
};

/**
 * Returns a Markdown heading marker. An optional number increases the heading level.
 *
 *    Input                  Output
 *    {{h}} {{name}}         # Name
 *    {{h 2}} {{name}}       ## Name
 */
export function h(opts: HelperOptions): string;
export function h(hsublevel: number, opts: HelperOptions): string;
export function h(hsublevel: number | HelperOptions, opts?: HelperOptions) {
  const { hlevel } = getHLevel(hsublevel, opts);
  return new Array(hlevel).fill('#').join('');
};

/**
 * Delineates a section where headings should be increased by 1 or a custom number.
 *
 *    {{#hsection}}
 *    {{>partial-with-headings}}
 *    {{/hsection}}
 */
export function hsection(opts: HelperOptions): string;
export function hsection(hsublevel: number, opts: HelperOptions): string;
export function hsection(this: unknown, hsublevel: number | HelperOptions, opts?: HelperOptions) {
  let hlevel;
  ({ hlevel, opts } = getHLevel(hsublevel, opts));
  opts.data = Utils.createFrame(opts.data);
  opts.data.hlevel = hlevel;
  return opts.fn(this as unknown, opts);
}

/**
 * Helper for dealing with the optional hsublevel argument.
 */
function getHLevel(hsublevel: number | HelperOptions, opts?: HelperOptions) {
  if (typeof hsublevel === 'number') {
    opts = opts!;
    hsublevel = Math.max(1, hsublevel);
  } else {
    opts = hsublevel;
    hsublevel = 1;
  }
  const contextHLevel: number = opts.data?.hlevel ?? 0;
  return { opts, hlevel: contextHLevel + hsublevel };
}

export function trim(text: string) {
  if (typeof text === 'string') {
    return text.trim();
  }
}

export function joinLines(text?: string) {
  if (typeof text === 'string') {
    return text.replace(/\n+/g, ' ');
  }
}

export function allEvents(this: DocItemWithContext)
{
	if (this.nodeType ===  "ContractDefinition")
	{
		const deref: ASTDereferencer = this[DOC_ITEM_CONTEXT].build.deref;
		const parents: ContractDefinition[] = this.linearizedBaseContracts.map(deref("ContractDefinition"));
		
		const r: EventDefinition[] = parents.flatMap((p: ContractDefinition) => [...findAll("EventDefinition", p)]);
		// console.log(`Events: ${this.canonicalName} -> ${r.map(e => e.name)}`);
		return r;
	}
}

export function allFunctions(this: DocItemWithContext)
{
	if (this.nodeType ===  "ContractDefinition")
	{
		const deref: ASTDereferencer = this[DOC_ITEM_CONTEXT].build.deref;
		const parents: ContractDefinition[] = this.linearizedBaseContracts.map(deref("ContractDefinition"));
		
		const r: FunctionDefinition[] = parents.flatMap((p: ContractDefinition) => ([...findAll("FunctionDefinition", p)].filter(f => f.visibility !== 'private' && f.visibility !== 'internal')));

    return uniqBy(
      r,
      f => f.name === 'constructor' ? 'constructor' : f.id,
    );
	}
}

export function allStructs(this: DocItemWithContext)
{
	if (this.nodeType ===  "ContractDefinition")
	{
		const deref: ASTDereferencer = this[DOC_ITEM_CONTEXT].build.deref;
		const parents: ContractDefinition[] = this.linearizedBaseContracts.map(deref("ContractDefinition"));
		
		const r: StructDefinition[] = parents.flatMap((p: ContractDefinition) => ([...findAll("StructDefinition", p)]));

    return r;
	}
}

export function allEnums(this: DocItemWithContext)
{
	if (this.nodeType ===  "ContractDefinition")
	{
		const deref: ASTDereferencer = this[DOC_ITEM_CONTEXT].build.deref;
		const parents: ContractDefinition[] = this.linearizedBaseContracts.map(deref("ContractDefinition"));
		
		const r: EnumDefinition[] = parents.flatMap((p: ContractDefinition) => ([...findAll("EnumDefinition", p)]));

    return r;
	}
}

export function allModifiers(this: DocItemWithContext)
{
	if (this.nodeType ===  "ContractDefinition")
	{
		const deref: ASTDereferencer = this[DOC_ITEM_CONTEXT].build.deref;
		const parents: ContractDefinition[] = this.linearizedBaseContracts.map(deref("ContractDefinition"));
		
		const r: ModifierDefinition[] = parents.flatMap((p: ContractDefinition) => ([...findAll("ModifierDefinition", p)]));

    return r;
	}
}