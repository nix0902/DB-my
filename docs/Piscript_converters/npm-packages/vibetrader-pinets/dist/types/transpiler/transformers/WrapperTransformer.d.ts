/**
 * Wraps unwrapped code in a context arrow function.
 * If the code is already wrapped in a function, returns it as-is.
 * Otherwise, wraps it in: (context) => { ... }
 *
 * @param code The input code string
 * @returns The wrapped code string
 */
export declare function wrapInContextFunction(code: string): string;
