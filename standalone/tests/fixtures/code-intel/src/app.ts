export function greet(name: string): string {
	return helper(name);
}

export function helper(name: string): string {
	return `hello ${name}`;
}
