import type { Root } from "mdast";
import type { Plugin } from "unified";

type CodeNode = Extract<Root["children"][number], { type: "code" }>;
type RootChild = Root["children"][number];

const LANGUAGE_NAMES: Record<string, string> = {
	ts: "TypeScript",
	tsx: "TSX",
	js: "JavaScript",
	jsx: "JSX",
	sh: "Shell",
	bash: "Bash",
	shell: "Shell",
	python: "Python",
	py: "Python",
	go: "Go",
	rust: "Rust",
	java: "Java",
	kotlin: "Kotlin",
	c: "C",
	cpp: "C++",
	cs: "C#",
	csharp: "C#",
	php: "PHP",
	ruby: "Ruby",
	rb: "Ruby",
	sql: "SQL",
	json: "JSON",
	yaml: "YAML",
	yml: "YAML",
	html: "HTML",
	css: "CSS",
	scss: "SCSS",
	vue: "Vue",
	svelte: "Svelte",
};

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function languageName(language: string | null | undefined) {
	const key = (language ?? "text").toLowerCase();
	return LANGUAGE_NAMES[key] ?? (key === "text" ? "Text" : key);
}

type TabOptions = {
	name: string;
	key: string;
	prefix: string | null;
};

function parseTabOptions(node: CodeNode): TabOptions {
	const language = node.lang ?? "text";
	const defaults: TabOptions = { name: languageName(language), key: language, prefix: null };
	const meta = node.meta ?? "";
	const values = [...meta.matchAll(/(?:^|\s)(name|key|prefix)=(?:"([^"]*)"|'([^']*)'|(\S+))/g)];

	for (const [, property, doubleQuoted, singleQuoted, unquoted] of values) {
		const value = doubleQuoted ?? singleQuoted ?? unquoted;
		if (!value) continue;
		if (property === "name") defaults.name = value;
		if (property === "key") defaults.key = value;
		if (property === "prefix") defaults.prefix = value;
	}

	return defaults;
}

function tabMarkup(nodes: CodeNode[]) {
	const options = nodes.map(parseTabOptions);
	const tabs = options
		.map(({ name, key, prefix }) => {
			const prefixAttribute = prefix ? ` data-code-prefix="${escapeHtml(prefix)}"` : "";
			return `<button type="button" class="code-tab" role="tab" aria-selected="false" data-code-tab="${escapeHtml(key)}"${prefixAttribute}>${escapeHtml(name)}</button>`;
		})
		.join("");

	const panels = nodes
		.map((node, index) => {
			const language = node.lang ?? "text";
			const { key, prefix } = options[index];
			const prefixAttribute = prefix ? ` data-code-prefix="${escapeHtml(prefix)}"` : "";
			return `<pre class="code-tab-panel" role="tabpanel" data-code-panel="${escapeHtml(key)}"${prefixAttribute} hidden><code class="language-${escapeHtml(language)}">${escapeHtml(node.value)}</code></pre>`;
		})
		.join("");
	return `<div class="code-tabs" data-code-tabs><div class="code-tab-list" role="tablist">${tabs}</div>${panels}</div>`;
}

const codeTabs: Plugin<[], Root> = () => (tree) => {
	const children = tree.children;
	const output: RootChild[] = [];

	for (let index = 0; index < children.length; index++) {
		const node = children[index];
		if (node.type !== "code") {
			output.push(node);
			continue;
		}

		const group: CodeNode[] = [node];
		let next = index + 1;
		while (next < children.length) {
			const candidate = children[next];
			if (candidate.type === "code") {
				group.push(candidate);
				next++;
				continue;
			}

			break;
		}

		if (group.length > 1) {
			output.push({ type: "html", value: tabMarkup(group) });
			index = next - 1;
		} else {
			output.push(node);
		}
	}

	tree.children = output;
};

export default codeTabs;
