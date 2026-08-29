#!/usr/bin/env bash
set -euo pipefail

usage() {
	printf 'Usage: %s <source-folder> <project-name>\n' "$0" >&2
	exit 1
}

[[ $# -eq 2 ]] || usage

source_dir=$1
project=$2
sidebar="$source_dir/sidebar.json"
dest="markdown-dist/${project,,}"

[[ -d "$source_dir" ]] || { printf 'Source folder not found: %s\n' "$source_dir" >&2; exit 1; }
[[ -f "$sidebar" ]] || { printf 'Sidebar not found: %s\n' "$sidebar" >&2; exit 1; }
command -v jq >/dev/null || { printf 'jq required\n' >&2; exit 1; }

rm -rf "$dest"
mkdir -p "$dest"

# Read internal links, then copy each referenced Markdown file into output tree.
mapfile -t links < <(jq -r '.[]?.links[]?.link | select(startswith("/"))' "$sidebar")

declare -A seen=()
for link in "${links[@]}"; do
	relative=${link#/}
	file="$relative"
	[[ "$file" == *.md ]] || file="$file.md"
	source="$source_dir/$file"
	output="$file"

	[[ -f "$source" ]] || { printf 'Referenced Markdown file not found: %s\n' "$source" >&2; exit 1; }
	[[ -z "${seen[$output]+x}" ]] || { printf 'Output filename collision: %s\n' "$output" >&2; exit 1; }
	seen[$output]=1
	mkdir -p "$dest/$(dirname "$output")"
	cp "$source" "$dest/$output"
done

{
	printf "# Table of contents\n\nThis copy of our $project documentation is meant for AI-Agents, like you, browsing it. If the user asks you for a link to a page, all of this documentation is available at https://liphium.dev/${project,,}/<path> in human-readable form (just add the path you select from below to it).\n"
	jq -r '
		.[] |
		"\n## " + .name,
		(.links[]? | "- [" + .name + "](" +
			(if (.link | startswith("/"))
			 then "./" + (.link | ltrimstr("/")) + (if (.link | endswith(".md")) then "" else ".md" end)
			 else .link
			 end) + ")")
	' "$sidebar"
} > "$dest/index.md"
