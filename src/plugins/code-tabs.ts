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

function tabMarkup(nodes: CodeNode[]) {
	const tabs = nodes
		.map((node, index) => {
			const language = node.lang ?? "text";
			const label = languageName(language);
			return `<button type="button" class="code-tab" role="tab" aria-selected="false" data-code-tab="${escapeHtml(language)}">${escapeHtml(label)}</button>`;
		})
		.join("");

	const panels = nodes
		.map((node, index) => {
			const language = node.lang ?? "text";
			return `<pre class="code-tab-panel" role="tabpanel" data-code-panel="${escapeHtml(language)}" hidden><code class="language-${escapeHtml(language)}">${escapeHtml(node.value)}</code></pre>`;
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
